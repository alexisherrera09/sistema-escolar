import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import type { MenuComedor, InscripcionComedor } from '../types';
import { format } from 'date-fns';

export const useComedorStore = defineStore('comedor', () => {
  const menuStorage = useStorage<MenuComedor>('escolar_menu_comedor');
  const inscripcionesStorage = useStorage<InscripcionComedor>('escolar_inscripciones_comedor');

  const menus = computed(() => menuStorage.get());
  const inscripciones = computed(() => inscripcionesStorage.get());

  const getMenuSemana = (fecha: string): MenuComedor | undefined => {
    return menus.value.find(m => m.semana === fecha);
  };

  const getMenuActual = (): MenuComedor | undefined => {
    const hoy = new Date();
    const inicioSemana = format(new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 1)), 'yyyy-MM-dd');
    return getMenuSemana(inicioSemana);
  };

  const crearMenuSemanal = (semana: string, dias: MenuComedor['dias']): MenuComedor => {
    const menu: MenuComedor = {
      id: `menu_${Date.now()}`,
      semana,
      dias,
      activo: true,
    };

    menuStorage.add(menu);
    return menu;
  };

  const getInscripcionesActivas = (): InscripcionComedor[] => {
    return inscripciones.value.filter(i => i.activa);
  };

  const inscribirAlumno = (datos: Partial<InscripcionComedor>): InscripcionComedor => {
    const inscripcion: InscripcionComedor = {
      id: `insc_comedor_${Date.now()}`,
      alumnoId: datos.alumnoId || '',
      cicloId: datos.cicloId || '',
      dias: datos.dias || [],
      plan: datos.plan || 'completo',
      activa: true,
    };

    inscripcionesStorage.add(inscripcion);
    return inscripcion;
  };

  return {
    menus,
    inscripciones,
    getMenuSemana,
    getMenuActual,
    crearMenuSemanal,
    getInscripcionesActivas,
    inscribirAlumno,
  };
});
