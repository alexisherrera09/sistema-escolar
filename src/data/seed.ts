import type { Usuario, Alumno, Grupo, Tutor, ConfiguracionEscolar, CicloEscolar } from '../types';
import { UserRole, AlumnoStatus } from '../types';

export const configuracion: ConfiguracionEscolar = {
  id: 'cfg1',
  nombrePlantel: 'Colegio Veracruz',
  cct: '30PPR0123A',
  rfc: 'CVE200101AB1',
  regimenFiscal: '601 - General de Ley Personas Morales',
  direccion: 'Av. Insurgentes 250, Col. Centro, Veracruz, Ver. C.P. 91700',
  telefono: '229-555-0200',
  correo: 'admin@colegiovx.edu.mx',
  horaEntrada: '07:30',
  horaSalida: '13:30',
  minutosTolerancia: 10,
  diaCorte: 5,
  montoColegiaturaBase: 2500,
  montoInscripcionBase: 1500,
  cicloActualId: 'ciclo1',
};

export const cicloEscolar: CicloEscolar = {
  id: 'ciclo1',
  nombre: '2024-2025',
  fechaInicio: '2024-08-19',
  fechaFin: '2025-07-11',
  activo: true,
  periodos: [
    { id: 'p1', cicloId: 'ciclo1', nombre: '1er Bimestre', tipo: '1er_bimestre', fechaInicio: '2024-08-19', fechaFin: '2024-10-11', calificacionesAbiertas: false, boletasPublicadas: true },
    { id: 'p2', cicloId: 'ciclo1', nombre: '2do Bimestre', tipo: '2do_bimestre', fechaInicio: '2024-10-14', fechaFin: '2024-12-13', calificacionesAbiertas: false, boletasPublicadas: true },
    { id: 'p3', cicloId: 'ciclo1', nombre: '3er Bimestre', tipo: '3er_bimestre', fechaInicio: '2025-01-06', fechaFin: '2025-03-07', calificacionesAbiertas: true, boletasPublicadas: false },
    { id: 'p4', cicloId: 'ciclo1', nombre: '4to Bimestre', tipo: '4to_bimestre', fechaInicio: '2025-03-10', fechaFin: '2025-05-09', calificacionesAbiertas: false, boletasPublicadas: false },
    { id: 'p5', cicloId: 'ciclo1', nombre: '5to Bimestre', tipo: '5to_bimestre', fechaInicio: '2025-05-12', fechaFin: '2025-07-11', calificacionesAbiertas: false, boletasPublicadas: false },
  ],
};

export const usuarios: Usuario[] = [
  { id: 'u1', nombre: 'Director General', usuario: 'director', passwordHash: 'director123', correo: 'director@colegiovx.edu.mx', rol: UserRole.DIRECTOR, activo: true, intentosFallidos: 0, creadoEn: '2024-01-01' },
  { id: 'u2', nombre: 'Coordinadora Académica', usuario: 'coordinador', passwordHash: 'coord123', correo: 'coordinacion@colegiovx.edu.mx', rol: UserRole.COORDINADOR, activo: true, intentosFallidos: 0, creadoEn: '2024-01-01' },
  { id: 'u3', nombre: 'Cajera Principal', usuario: 'cajero', passwordHash: 'cajero123', correo: 'caja@colegiovx.edu.mx', rol: UserRole.CAJERO, activo: true, intentosFallidos: 0, creadoEn: '2024-01-01' },
  { id: 'u4', nombre: 'Mtro. Carlos Ramírez', usuario: 'maestro3a', passwordHash: 'maestro123', correo: 'cramirez@colegiovx.edu.mx', rol: UserRole.MAESTRO, activo: true, intentosFallidos: 0, creadoEn: '2024-01-01' },
  { id: 'u5', nombre: 'Mtra. Laura García', usuario: 'maestro1a', passwordHash: 'maestro123', correo: 'lgarcia@colegiovx.edu.mx', rol: UserRole.MAESTRO, activo: true, intentosFallidos: 0, creadoEn: '2024-01-01' },
  { id: 'u6', nombre: 'Patricia Martínez', usuario: 'padre001', passwordHash: 'padre123', correo: 'patricia@email.com', rol: UserRole.PADRE, activo: true, intentosFallidos: 0, creadoEn: '2024-08-01' },
];

export const grupos: Grupo[] = [
  { id: 'g1', gradoId: 'gr1', nombre: 'A', cicloId: 'ciclo1', maestroTitularId: 'maestro2', capacidadMaxima: 30, turno: 'matutino', activo: true },
  { id: 'g2', gradoId: 'gr1', nombre: 'B', cicloId: 'ciclo1', maestroTitularId: 'maestro2', capacidadMaxima: 30, turno: 'matutino', activo: true },
  { id: 'g3', gradoId: 'gr3', nombre: 'A', cicloId: 'ciclo1', maestroTitularId: 'maestro3', capacidadMaxima: 30, turno: 'matutino', activo: true },
  { id: 'g4', gradoId: 'gr4', nombre: 'A', cicloId: 'ciclo1', maestroTitularId: 'maestro4', capacidadMaxima: 30, turno: 'matutino', activo: true },
  { id: 'g5', gradoId: 'gr6', nombre: 'A', cicloId: 'ciclo1', maestroTitularId: 'maestro5', capacidadMaxima: 30, turno: 'matutino', activo: true },
];

export const tutores: Tutor[] = [
  { id: 't1', nombre: 'Patricia Martínez Rojas', parentesco: 'Mamá', telefono: '229-555-0101', correo: 'patricia@email.com', rfc: 'MARP850312AB1', alumnosIds: ['a1'], usuarioId: 'u6' },
  { id: 't2', nombre: 'Roberto López García', parentesco: 'Papá', telefono: '229-555-0201', correo: 'roberto@email.com', rfc: 'LOGR780415CD2', alumnosIds: ['a2'] },
  { id: 't3', nombre: 'Carmen Sánchez Vega', parentesco: 'Mamá', telefono: '229-555-0301', correo: 'carmen@email.com', alumnosIds: ['a3'] },
];

export const alumnos: Alumno[] = [
  {
    id: 'a1', matricula: '2024-001',
    nombre: 'Ana Sofía', apellidoPaterno: 'López', apellidoMaterno: 'Martínez',
    curp: 'LOMA180312MVZRTN06', fechaNacimiento: '2018-03-12', sexo: 'F',
    grupoId: 'g3', cicloId: 'ciclo1', tutorPrincipalId: 't1',
    personasAutorizadas: [
      { nombre: 'Patricia Martínez', parentesco: 'Mamá', telefono: '229-555-0101' },
      { nombre: 'Roberto López', parentesco: 'Papá', telefono: '229-555-0102' },
    ],
    expedienteMedico: {
      tipoSangre: 'O+', medico: 'Dr. Pérez', telefonoMedico: '229-555-9000',
      alergias: ['Penicilina - reacción severa', 'Cacahuate - erupción'],
      medicamentos: [], condicionesEspeciales: '',
      seguroMedico: false, contactosEmergencia: [
        { nombre: 'Patricia Martínez', parentesco: 'Mamá', telefono: '229-555-0101' }
      ]
    },
    status: AlumnoStatus.ACTIVO, creadoEn: '2024-08-01',
  },
  {
    id: 'a2', matricula: '2024-002',
    nombre: 'Juan Pablo', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Torres',
    curp: 'RATJ190520HVZRMN07', fechaNacimiento: '2019-05-20', sexo: 'M',
    grupoId: 'g3', cicloId: 'ciclo1', tutorPrincipalId: 't2',
    personasAutorizadas: [{ nombre: 'Roberto López', parentesco: 'Papá', telefono: '229-555-0201' }],
    expedienteMedico: { tipoSangre: 'A+', alergias: [], medicamentos: [], condicionesEspeciales: '', seguroMedico: false, contactosEmergencia: [] },
    status: AlumnoStatus.ACTIVO, creadoEn: '2024-08-01',
  },
  {
    id: 'a3', matricula: '2024-003',
    nombre: 'María Fernanda', apellidoPaterno: 'García', apellidoMaterno: 'Sánchez',
    curp: 'GASM200115MVZRCR08', fechaNacimiento: '2020-01-15', sexo: 'F',
    grupoId: 'g1', cicloId: 'ciclo1', tutorPrincipalId: 't3',
    personasAutorizadas: [{ nombre: 'Carmen Sánchez', parentesco: 'Mamá', telefono: '229-555-0301' }],
    expedienteMedico: { tipoSangre: 'B+', alergias: [], medicamentos: ['Salbutamol - para asma'], condicionesEspeciales: 'Asma leve', seguroMedico: true, polizaSeguro: 'GNP-12345678', contactosEmergencia: [] },
    status: AlumnoStatus.ACTIVO, creadoEn: '2024-08-01',
  },
];

export function initializeData(): void {
  if (!localStorage.getItem('escolar_initialized')) {
    localStorage.setItem('escolar_configuracion', JSON.stringify(configuracion));
    localStorage.setItem('escolar_ciclo', JSON.stringify(cicloEscolar));
    localStorage.setItem('escolar_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('escolar_grupos', JSON.stringify(grupos));
    localStorage.setItem('escolar_tutores', JSON.stringify(tutores));
    localStorage.setItem('escolar_alumnos', JSON.stringify(alumnos));
    localStorage.setItem('escolar_asistencia', JSON.stringify([]));
    localStorage.setItem('escolar_calificaciones', JSON.stringify([]));
    localStorage.setItem('escolar_cargos', JSON.stringify([]));
    localStorage.setItem('escolar_pagos', JSON.stringify([]));
    localStorage.setItem('escolar_cfdi', JSON.stringify([]));
    localStorage.setItem('escolar_comunicados', JSON.stringify([]));
    localStorage.setItem('escolar_becas', JSON.stringify([]));
    localStorage.setItem('escolar_inscripciones', JSON.stringify([]));
    localStorage.setItem('escolar_entradas_salidas', JSON.stringify([]));
    localStorage.setItem('escolar_maestros', JSON.stringify([
      { id: 'maestro1', usuarioId: 'u4', nombre: 'Mtro. Carlos Ramírez', titulo: 'Mtro.', telefono: '229-555-0401', correo: 'cramirez@colegiovx.edu.mx', grupoTitularId: 'g3', materiasIds: [], activo: true, creadoEn: '2024-01-01' },
      { id: 'maestro2', usuarioId: 'u5', nombre: 'Mtra. Laura García', titulo: 'Mtra.', telefono: '229-555-0402', correo: 'lgarcia@colegiovx.edu.mx', grupoTitularId: 'g1', materiasIds: [], activo: true, creadoEn: '2024-01-01' },
    ]));
    localStorage.setItem('escolar_initialized', 'true');
    console.log('✅ Datos semilla del sistema escolar inicializados');
  }
}
