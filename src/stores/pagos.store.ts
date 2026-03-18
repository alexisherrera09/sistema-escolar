import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import { getEstadoPagoColor } from '../utils/formatters';
import type { Cargo, Pago, CFDI } from '../types';
import { PagoStatus, MetodoPago, ConceptoPago } from '../types';
import { useAuthStore } from './auth.store';
import { useSingleStorage } from '../composables/useStorage';
import type { ConfiguracionEscolar } from '../types';
import { useAlumnosStore } from './alumnos.store';

export const usePagosStore = defineStore('pagos', () => {
  const cargosStorage = useStorage<Cargo>('escolar_cargos');
  const pagosStorage = useStorage<Pago>('escolar_pagos');
  const cfdiStorage = useStorage<CFDI>('escolar_cfdi');
  const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');
  const authStore = useAuthStore();

  const cargos = computed(() => cargosStorage.get());
  const pagos = computed(() => pagosStorage.get());

  const getCargosPorAlumno = (alumnoId: string): Cargo[] => {
    return cargos.value.filter(c => c.alumnoId === alumnoId);
  };

  const getCargosPendientes = (alumnoId: string): Cargo[] => {
    return getCargosPorAlumno(alumnoId).filter(c => 
      c.status === PagoStatus.PENDIENTE || c.status === PagoStatus.VENCIDO
    );
  };

  const registrarPago = async (
    alumnoId: string,
    cargosIds: string[],
    metodo: MetodoPago,
    referencia?: string,
    emitirCFDI: boolean = false
  ): Promise<Pago> => {
    const cargosSeleccionados = cargosIds
      .map(id => cargosStorage.findById(id))
      .filter((c): c is Cargo => c !== undefined);

    const montoTotal = cargosSeleccionados.reduce((sum, c) => sum + c.monto, 0);

    // Generar número de recibo
    const recibo = `REC-${Date.now()}`;

    const pago: Pago = {
      id: `pago_${Date.now()}`,
      cargosIds,
      alumnoId,
      tutorId: '', // Se obtiene del alumno
      montoTotal,
      metodo,
      referencia,
      cfdiGenerado: false,
      cajeroId: authStore.currentUser?.id || '',
      fecha: new Date().toISOString().split('T')[0],
      recibo,
    };

    // Actualizar estado de cargos
    cargosIds.forEach(id => {
      cargosStorage.update(id, { status: PagoStatus.PAGADO });
    });

    // Generar CFDI si se solicita
    if (emitirCFDI) {
      try {
        const { useCFDIStore } = await import('./cfdi.store');
        const cfdiStore = useCFDIStore();
        const cfdi = cfdiStore.generarCFDI(pago);
        pago.cfdiId = cfdi.id;
        pago.cfdiGenerado = true;
      } catch (error) {
        console.error('Error al generar CFDI:', error);
        // Continuar sin CFDI
      }
    }

    pagosStorage.add(pago);
    return pago;
  };


  const getEstadoPagoAlumno = (alumnoId: string): { color: string; texto: string; icono: string } => {
    const cargosAlumno = getCargosPorAlumno(alumnoId);
    const vencidos = cargosAlumno.filter(c => {
      const estado = getEstadoPagoColor(c.status, c.fechaVencimiento);
      return estado.color === 'red';
    });

    if (vencidos.length > 0) {
      return { color: 'red', texto: 'Vencido', icono: '🔴' };
    }

    const pendientes = cargosAlumno.filter(c => c.status === PagoStatus.PENDIENTE);
    if (pendientes.length > 0) {
      return { color: 'yellow', texto: 'Pendiente', icono: '⚠️' };
    }

    return { color: 'green', texto: 'Al día', icono: '✅' };
  };

  const actualizarVencimientos = (): void => {
    const hoy = new Date();
    const config = configStorage.get();
    
    if (!config) return;

    cargos.value.forEach(cargo => {
      if (cargo.status === PagoStatus.PENDIENTE) {
        const vencimiento = new Date(cargo.fechaVencimiento);
        if (vencimiento < hoy) {
          cargosStorage.update(cargo.id, { status: PagoStatus.VENCIDO });
        }
      }
    });
  };

  return {
    cargos,
    pagos,
    getCargosPorAlumno,
    getCargosPendientes,
    registrarPago,
    getEstadoPagoAlumno,
    actualizarVencimientos,
  };
});
