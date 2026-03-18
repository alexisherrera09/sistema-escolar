import { UserRole } from '../types';

export function canAccessModule(role: UserRole, module: string): boolean {
  const permissions: Record<string, UserRole[]> = {
    alumnos: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
    grupos: [UserRole.DIRECTOR, UserRole.COORDINADOR],
    calificaciones: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
    asistencia: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
    boletas: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.PADRE],
    pagos: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
    cfdi: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
    comedor: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
    becas: [UserRole.DIRECTOR, UserRole.CAJERO, UserRole.PADRE],
    inscripciones: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.PADRE],
    entrada_salida: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO, UserRole.MAESTRO, UserRole.PADRE],
    expediente_medico: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
    comunicados: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.MAESTRO, UserRole.PADRE],
    reportes: [UserRole.DIRECTOR, UserRole.COORDINADOR, UserRole.CAJERO],
    configuracion: [UserRole.DIRECTOR],
  };

  return permissions[module]?.includes(role) || false;
}
