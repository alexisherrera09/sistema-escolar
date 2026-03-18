// ─── ENUMS ───────────────────────────────────────────────────────

export enum UserRole {
  DIRECTOR = 'director',
  COORDINADOR = 'coordinador',
  CAJERO = 'cajero',
  MAESTRO = 'maestro',
  PADRE = 'padre',
}

export enum AlumnoStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  BAJA = 'baja',
  EGRESADO = 'egresado',
}

export enum AsistenciaStatus {
  PRESENTE = 'presente',
  FALTA = 'falta',
  TARDANZA = 'tardanza',
  FALTA_JUSTIFICADA = 'falta_justificada',
}

export enum PagoStatus {
  PAGADO = 'pagado',
  PENDIENTE = 'pendiente',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado',
}

export enum ConceptoPago {
  COLEGIATURA = 'colegiatura',
  INSCRIPCION = 'inscripcion',
  COMEDOR = 'comedor',
  UNIFORME = 'uniforme',
  LIBRO = 'libro',
  ACTIVIDAD_EXTRACURRICULAR = 'actividad_extracurricular',
  OTRO = 'otro',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  CHEQUE = 'cheque',
  TARJETA = 'tarjeta',
  DEPOSITO = 'deposito',
}

export enum TipoComunicado {
  AVISO = 'aviso',
  TAREA = 'tarea',
  EVENTO = 'evento',
  CIRCULAR = 'circular',
  URGENTE = 'urgente',
}

export enum DestinatarioComunicado {
  TODOS = 'todos',
  GRADO = 'grado',
  GRUPO = 'grupo',
  ALUMNO = 'alumno',
}

export enum EstadoInscripcion {
  EN_REVISION = 'en_revision',
  PENDIENTE_PAGO = 'pendiente_pago',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  LISTA_ESPERA = 'lista_espera',
}

export enum PeriodoCalificaciones {
  PRIMER_BIMESTRE = '1er_bimestre',
  SEGUNDO_BIMESTRE = '2do_bimestre',
  TERCER_BIMESTRE = '3er_bimestre',
  CUARTO_BIMESTRE = '4to_bimestre',
  QUINTO_BIMESTRE = '5to_bimestre',
}

// ─── ENTIDADES PRINCIPALES ───────────────────────────────────────

export interface CicloEscolar {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  periodos: Periodo[];
}

export interface Periodo {
  id: string;
  cicloId: string;
  nombre: string;
  tipo: PeriodoCalificaciones;
  fechaInicio: string;
  fechaFin: string;
  calificacionesAbiertas: boolean;
  boletasPublicadas: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  usuario: string;
  passwordHash: string;
  correo: string;
  rol: UserRole;
  activo: boolean;
  intentosFallidos: number;
  bloqueadoHasta?: string;
  creadoEn: string;
}

export interface Grado {
  id: string;
  nombre: string;
  numero: number;
  materias: string[];
}

export interface Grupo {
  id: string;
  gradoId: string;
  nombre: string;
  cicloId: string;
  maestroTitularId: string;
  capacidadMaxima: number;
  turno: 'matutino' | 'vespertino';
  activo: boolean;
}

export interface Materia {
  id: string;
  nombre: string;
  gradoId: string;
  maestroId?: string;
  horasSemanales: number;
  obligatoria: boolean;
}

export interface PersonaAutorizada {
  nombre: string;
  parentesco: string;
  telefono: string;
  foto?: string;
}

export interface DatosmedAlumno {
  tipoSangre: string;
  medico?: string;
  telefonoMedico?: string;
  alergias: string[];
  medicamentos: string[];
  condicionesEspeciales: string;
  seguroMedico: boolean;
  polizaSeguro?: string;
  contactosEmergencia: PersonaAutorizada[];
}

export interface Alumno {
  id: string;
  matricula: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F';
  grupoId: string;
  cicloId: string;
  tutorPrincipalId: string;
  personasAutorizadas: PersonaAutorizada[];
  expedienteMedico: DatosmedAlumno;
  status: AlumnoStatus;
  foto?: string;
  creadoEn: string;
}

export interface Tutor {
  id: string;
  nombre: string;
  parentesco: string;
  telefono: string;
  correo: string;
  rfc?: string;
  razonSocial?: string;
  regimenFiscal?: string;
  direccion?: string;
  usuarioId?: string;
  alumnosIds: string[];
}

export interface Maestro {
  id: string;
  usuarioId: string;
  nombre: string;
  titulo: string;
  telefono: string;
  correo: string;
  grupoTitularId?: string;
  materiasIds: string[];
  activo: boolean;
  creadoEn: string;
}

export interface RegistroAsistencia {
  id: string;
  alumnoId: string;
  grupoId: string;
  fecha: string;
  status: AsistenciaStatus;
  horaEntrada?: string;
  justificacion?: string;
  maestroId: string;
  registradoEn: string;
}

export interface Calificacion {
  id: string;
  alumnoId: string;
  materiaId: string;
  periodoId: string;
  cicloId: string;
  evaluaciones: number[];
  promedio: number;
  observaciones?: string;
  finalizada: boolean;
  maestroId: string;
  actualizadoEn: string;
}

export interface Cargo {
  id: string;
  alumnoId: string;
  concepto: ConceptoPago;
  descripcion: string;
  monto: number;
  montoOriginal: number;
  descuentoBeca: number;
  status: PagoStatus;
  fechaVencimiento: string;
  cicloId: string;
  mesAplica?: string;
  creadoEn: string;
}

export interface Pago {
  id: string;
  cargosIds: string[];
  alumnoId: string;
  tutorId: string;
  montoTotal: number;
  metodo: MetodoPago;
  referencia?: string;
  cfdiGenerado: boolean;
  cfdiId?: string;
  recibo: string;
  cajeroId: string;
  fecha: string;
}

export interface CFDI {
  id: string;
  pagoId: string;
  folio: string;
  rfc: string;
  razonSocial: string;
  monto: number;
  conceptos: string[];
  usoCFDI: string;
  metodoPagoSAT: string;
  regimenFiscal: string;
  fecha: string;
  xml?: string;
  pdfBase64?: string;
}

export interface Beca {
  id: string;
  alumnoId: string;
  tipo: string;
  porcentaje: number;
  motivo: string;
  cicloId: string;
  aprobadoPor: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

export interface Comunicado {
  id: string;
  tipo: TipoComunicado;
  titulo: string;
  mensaje: string;
  destinatario: DestinatarioComunicado;
  destinatarioId?: string;
  fechaEvento?: string;
  adjunto?: string;
  urgente: boolean;
  publicadoPor: string;
  publicadoEn: string;
  leidoPor: string[];
}

export interface RegistroEntradaSalida {
  id: string;
  alumnoId: string;
  fecha: string;
  tipo: 'entrada' | 'salida';
  hora: string;
  tardanza: boolean;
  salida_anticipada: boolean;
  personaRecogeId?: string;
  personaRecogeNombre?: string;
  observaciones?: string;
  registradoPor: string;
}

export interface MenuComedor {
  id: string;
  semana: string;
  dias: DiaMenuComedor[];
  activo: boolean;
}

export interface DiaMenuComedor {
  dia: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';
  sopa: string;
  platilloPrincipal: string;
  guarnicion?: string;
  bebida: string;
  postre?: string;
}

export interface InscripcionComedor {
  id: string;
  alumnoId: string;
  cicloId: string;
  dias: ('lunes'|'martes'|'miercoles'|'jueves'|'viernes')[];
  plan: 'completo' | 'parcial';
  activa: boolean;
}

export interface Inscripcion {
  id: string;
  alumnoId?: string;
  tipo: 'nueva' | 'reinscripcion';
  cicloDestino: string;
  gradoDestino: string;
  grupoDestino?: string;
  status: EstadoInscripcion;
  documentos: DocumentoInscripcion[];
  pagado: boolean;
  solicitadoPor: string;
  fecha: string;
}

export interface DocumentoInscripcion {
  tipo: string;
  entregado: boolean;
  fechaEntrega?: string;
}

export interface ConfiguracionEscolar {
  id: string;
  nombrePlantel: string;
  cct: string;
  rfc: string;
  regimenFiscal: string;
  direccion: string;
  telefono: string;
  correo: string;
  logo?: string;
  horaEntrada: string;
  horaSalida: string;
  minutosTolerancia: number;
  diaCorte: number;
  montoColegiaturaBase: number;
  montoInscripcionBase: number;
  cicloActualId: string;
}
