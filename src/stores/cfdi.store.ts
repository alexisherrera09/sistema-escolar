import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import { generarPDFCFDI, generarXMLCFDI } from '../utils/cfdi-generator';
import type { CFDI, Pago, Tutor } from '../types';
import { useAlumnosStore } from './alumnos.store';
import { useSingleStorage } from '../composables/useStorage';
import type { ConfiguracionEscolar } from '../types';

export const useCFDIStore = defineStore('cfdi', () => {
  const cfdiStorage = useStorage<CFDI>('escolar_cfdi');
  const pagosStorage = useStorage<Pago>('escolar_pagos');
  const alumnosStore = useAlumnosStore();
  const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');

  const cfdis = computed(() => cfdiStorage.get());

  const getCFDIPorPago = (pagoId: string): CFDI | undefined => {
    return cfdis.value.find(c => c.pagoId === pagoId);
  };

  const getCFDIsPorTutor = (rfc: string): CFDI[] => {
    return cfdis.value.filter(c => c.rfc === rfc);
  };

  const generarCFDI = (pago: Pago): CFDI => {
    const config = configStorage.get();
    const alumno = alumnosStore.getAlumno(pago.alumnoId);
    const tutor = alumno ? alumnosStore.getTutor(alumno.tutorPrincipalId) : null;

    if (!tutor || !tutor.rfc) {
      throw new Error('El tutor no tiene RFC registrado');
    }

    if (!config) {
      throw new Error('Configuración no encontrada');
    }

    const cargos = pagosStorage.get().find(p => p.id === pago.id)?.cargosIds || [];
    const conceptos = cargos.map(id => {
      // Obtener descripción del cargo
      return `Colegiatura`;
    });

    const cfdi: CFDI = {
      id: `cfdi_${Date.now()}`,
      pagoId: pago.id,
      folio: `A-${String(cfdis.value.length + 1).padStart(6, '0')}`,
      rfc: tutor.rfc,
      razonSocial: tutor.nombre,
      monto: pago.montoTotal,
      conceptos: conceptos.length > 0 ? conceptos : ['Servicios educativos'],
      usoCFDI: 'D10',
      metodoPagoSAT: 'PUE',
      regimenFiscal: tutor.regimenFiscal || config.regimenFiscal,
      fecha: pago.fecha,
    };

    // Generar PDF y XML
    cfdi.pdfBase64 = generarPDFCFDI(cfdi);
    cfdi.xml = generarXMLCFDI(cfdi, config);

    cfdiStorage.add(cfdi);
    return cfdi;
  };

  const descargarPDF = (cfdiId: string): void => {
    const cfdi = cfdiStorage.findById(cfdiId);
    if (!cfdi || !cfdi.pdfBase64) return;

    const link = document.createElement('a');
    link.href = cfdi.pdfBase64;
    link.download = `CFDI_${cfdi.folio}.pdf`;
    link.click();
  };

  const descargarXML = (cfdiId: string): void => {
    const cfdi = cfdiStorage.findById(cfdiId);
    if (!cfdi || !cfdi.xml) return;

    const blob = new Blob([cfdi.xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CFDI_${cfdi.folio}.xml`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    cfdis,
    getCFDIPorPago,
    getCFDIsPorTutor,
    generarCFDI,
    descargarPDF,
    descargarXML,
  };
});
