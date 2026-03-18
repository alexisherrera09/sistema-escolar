import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '../composables/useStorage';
import { generarMatricula } from '../utils/matricula';
import type { Alumno, Tutor, Cargo, Beca } from '../types';
import { AlumnoStatus, ConceptoPago, PagoStatus } from '../types';
import { useSingleStorage } from '../composables/useStorage';
import type { ConfiguracionEscolar, CicloEscolar } from '../types';

export const useAlumnosStore = defineStore('alumnos', () => {
  const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
  const tutoresStorage = useStorage<Tutor>('escolar_tutores');
  const cargosStorage = useStorage<Cargo>('escolar_cargos');
  const becasStorage = useStorage<Beca>('escolar_becas');
  const configStorage = useSingleStorage<ConfiguracionEscolar>('escolar_configuracion');
  const cicloStorage = useSingleStorage<CicloEscolar>('escolar_ciclo');

  const alumnos = computed(() => alumnosStorage.get());
  const tutores = computed(() => tutoresStorage.get());

  const getAlumno = (id: string): Alumno | undefined => {
    return alumnosStorage.findById(id);
  };

  const getTutor = (id: string): Tutor | undefined => {
    return tutoresStorage.findById(id);
  };

  const buscarAlumno = (query: string): Alumno[] => {
    const q = query.toLowerCase();
    return alumnos.value.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.apellidoPaterno.toLowerCase().includes(q) ||
      a.apellidoMaterno.toLowerCase().includes(q) ||
      a.matricula.toLowerCase().includes(q) ||
      a.curp.toLowerCase().includes(q)
    );
  };

  const crearAlumno = (datos: Partial<Alumno> & {
    tutor: Partial<Tutor>;
    beca?: { tipo: string; porcentaje: number };
  }): Alumno => {
    const config = configStorage.get();
    const ciclo = cicloStorage.get();
    
    if (!config || !ciclo) {
      throw new Error('Configuración o ciclo no encontrado');
    }

    // Generar matrícula
    const matricula = generarMatricula(ciclo.id);

    // Crear o buscar tutor
    let tutor: Tutor;
    const tutorExistente = tutores.value.find(t => t.correo === datos.tutor.correo);
    
    if (tutorExistente) {
      tutor = { ...tutorExistente, alumnosIds: [...tutorExistente.alumnosIds] };
    } else {
      tutor = {
        id: `t${Date.now()}`,
        nombre: datos.tutor.nombre || '',
        parentesco: datos.tutor.parentesco || 'Tutor',
        telefono: datos.tutor.telefono || '',
        correo: datos.tutor.correo || '',
        rfc: datos.tutor.rfc,
        direccion: datos.tutor.direccion,
        alumnosIds: [],
      };
      tutoresStorage.add(tutor);
    }

    // Crear alumno
    const alumno: Alumno = {
      id: `a${Date.now()}`,
      matricula,
      nombre: datos.nombre || '',
      apellidoPaterno: datos.apellidoPaterno || '',
      apellidoMaterno: datos.apellidoMaterno || '',
      curp: datos.curp || '',
      fechaNacimiento: datos.fechaNacimiento || '',
      sexo: datos.sexo || 'M',
      grupoId: datos.grupoId || '',
      cicloId: ciclo.id,
      tutorPrincipalId: tutor.id,
      personasAutorizadas: datos.personasAutorizadas || [],
      expedienteMedico: datos.expedienteMedico || {
        tipoSangre: '',
        alergias: [],
        medicamentos: [],
        condicionesEspeciales: '',
        seguroMedico: false,
        contactosEmergencia: [],
      },
      status: AlumnoStatus.ACTIVO,
      creadoEn: new Date().toISOString(),
    };

    alumnosStorage.add(alumno);
    tutor.alumnosIds.push(alumno.id);
    tutoresStorage.update(tutor.id, { alumnosIds: tutor.alumnosIds });

    // Aplicar beca si existe
    if (datos.beca) {
      const beca: Beca = {
        id: `beca${Date.now()}`,
        alumnoId: alumno.id,
        tipo: datos.beca.tipo,
        porcentaje: datos.beca.porcentaje,
        motivo: `Beca aplicada al inscribir`,
        cicloId: ciclo.id,
        aprobadoPor: 'sistema',
        fechaInicio: new Date().toISOString(),
        fechaFin: ciclo.fechaFin,
        activa: true,
      };
      becasStorage.add(beca);
    }

    // Generar cargos del ciclo
    generarCargosDelCiclo(alumno.id, ciclo.id, datos.beca?.porcentaje || 0);

    return alumno;
  };

  const generarCargosDelCiclo = (alumnoId: string, cicloId: string, descuentoBeca: number = 0) => {
    const config = configStorage.get();
    const ciclo = cicloStorage.get();
    
    if (!config || !ciclo) return;

    // Cargo de inscripción
    const montoInscripcion = config.montoInscripcionBase * (1 - descuentoBeca / 100);
    const cargoInscripcion: Cargo = {
      id: `cargo_insc_${alumnoId}_${Date.now()}`,
      alumnoId,
      concepto: ConceptoPago.INSCRIPCION,
      descripcion: `Inscripción ${ciclo.nombre}`,
      monto: montoInscripcion,
      montoOriginal: config.montoInscripcionBase,
      descuentoBeca,
      status: PagoStatus.PENDIENTE,
      fechaVencimiento: ciclo.fechaInicio,
      cicloId,
      creadoEn: new Date().toISOString(),
    };
    cargosStorage.add(cargoInscripcion);

    // Cargos de colegiatura (10 meses: agosto-mayo)
    const meses = [
      '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
      '2025-01', '2025-02', '2025-03', '2025-04', '2025-05'
    ];

    meses.forEach((mes, index) => {
      const montoColegiatura = config.montoColegiaturaBase * (1 - descuentoBeca / 100);
      const fechaVencimiento = new Date(`${mes}-${config.diaCorte}`);
      
      const cargo: Cargo = {
        id: `cargo_col_${alumnoId}_${mes}`,
        alumnoId,
        concepto: ConceptoPago.COLEGIATURA,
        descripcion: `Colegiatura ${getNombreMes(mes)}`,
        monto: montoColegiatura,
        montoOriginal: config.montoColegiaturaBase,
        descuentoBeca,
        status: PagoStatus.PENDIENTE,
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        cicloId,
        mesAplica: mes,
        creadoEn: new Date().toISOString(),
      };
      cargosStorage.add(cargo);
    });
  };

  const getNombreMes = (mes: string): string => {
    const meses: Record<string, string> = {
      '2024-08': 'Agosto 2024',
      '2024-09': 'Septiembre 2024',
      '2024-10': 'Octubre 2024',
      '2024-11': 'Noviembre 2024',
      '2024-12': 'Diciembre 2024',
      '2025-01': 'Enero 2025',
      '2025-02': 'Febrero 2025',
      '2025-03': 'Marzo 2025',
      '2025-04': 'Abril 2025',
      '2025-05': 'Mayo 2025',
    };
    return meses[mes] || mes;
  };

  const actualizarAlumno = (id: string, updates: Partial<Alumno>): void => {
    alumnosStorage.update(id, updates);
  };

  const eliminarAlumno = (id: string): void => {
    alumnosStorage.remove(id);
  };

  const getAlumnosPorGrupo = (grupoId: string): Alumno[] => {
    return alumnos.value.filter(a => a.grupoId === grupoId && a.status === AlumnoStatus.ACTIVO);
  };

  return {
    alumnos,
    tutores,
    getAlumno,
    getTutor,
    buscarAlumno,
    crearAlumno,
    actualizarAlumno,
    eliminarAlumno,
    getAlumnosPorGrupo,
  };
});
