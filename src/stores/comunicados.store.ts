import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { Comunicado } from '../types';
import { TipoComunicado, DestinatarioComunicado } from '../types';
import { useAuthStore } from './auth.store';
import { useAlumnosStore } from './alumnos.store';

export const useComunicadosStore = defineStore('comunicados', () => {
  const comunicadosStorage = useStorage<Comunicado>('escolar_comunicados');
  const authStore = useAuthStore();

  const comunicados = computed(() => comunicadosStorage.get());

  const getComunicadosPorGrupo = (grupoId: string): Comunicado[] => {
    return comunicados.value.filter(c =>
      c.destinatario === DestinatarioComunicado.GRUPO &&
      c.destinatarioId === grupoId
    );
  };

  const getComunicadosPorGrado = (gradoId: string): Comunicado[] => {
    return comunicados.value.filter(c =>
      c.destinatario === DestinatarioComunicado.GRADO &&
      c.destinatarioId === gradoId
    );
  };

  const getComunicadosTodos = (): Comunicado[] => {
    return comunicados.value.filter(c => c.destinatario === DestinatarioComunicado.TODOS);
  };

  const getComunicadosParaPadre = (alumnoId: string): Comunicado[] => {
    const alumnosStore = useAlumnosStore();
    const gruposStorage = useStorage<any>('escolar_grupos');
    
    const alumno = alumnosStore.getAlumno(alumnoId);
    if (!alumno) return [];

    const grupo = gruposStorage.findById(alumno.grupoId);
    if (!grupo) return [];

    const comunicadosGrupo = getComunicadosPorGrupo(grupo.id);
    const comunicadosGrado = getComunicadosPorGrado(grupo.gradoId);
    const comunicadosTodos = getComunicadosTodos();

    return [...comunicadosGrupo, ...comunicadosGrado, ...comunicadosTodos]
      .sort((a, b) => b.publicadoEn.localeCompare(a.publicadoEn));
  };

  const crearComunicado = (datos: Partial<Comunicado>): Comunicado => {
    const comunicado: Comunicado = {
      id: `com_${Date.now()}`,
      tipo: datos.tipo || TipoComunicado.AVISO,
      titulo: datos.titulo || '',
      mensaje: datos.mensaje || '',
      destinatario: datos.destinatario || DestinatarioComunicado.TODOS,
      destinatarioId: datos.destinatarioId,
      fechaEvento: datos.fechaEvento,
      adjunto: datos.adjunto,
      urgente: datos.urgente || false,
      publicadoPor: authStore.currentUser?.id || '',
      publicadoEn: new Date().toISOString(),
      leidoPor: [],
    };

    comunicadosStorage.add(comunicado);
    return comunicado;
  };

  const marcarComoLeido = (comunicadoId: string, usuarioId: string): void => {
    const comunicado = comunicadosStorage.findById(comunicadoId);
    if (!comunicado) return;

    if (!comunicado.leidoPor.includes(usuarioId)) {
      comunicado.leidoPor.push(usuarioId);
      comunicadosStorage.update(comunicadoId, { leidoPor: comunicado.leidoPor });
    }
  };

  const eliminarComunicado = (id: string): void => {
    comunicadosStorage.remove(id);
  };

  return {
    comunicados,
    getComunicadosPorGrupo,
    getComunicadosPorGrado,
    getComunicadosTodos,
    getComunicadosParaPadre,
    crearComunicado,
    marcarComoLeido,
    eliminarComunicado,
  };
});
