import { useStorage } from '../composables/useStorage';
import type { Alumno } from '../types';

export function generarMatricula(cicloId: string): string {
  const alumnosStorage = useStorage<Alumno>('escolar_alumnos');
  const alumnos = alumnosStorage.get();
  
  // Obtener año del ciclo (ej: "2024-2025" -> "2024")
  const año = cicloId.split('-')[0] || new Date().getFullYear().toString();
  
  // Buscar el último número de matrícula del año
  const matriculasDelAño = alumnos
    .filter(a => a.matricula.startsWith(año))
    .map(a => {
      const num = parseInt(a.matricula.split('-')[1] || '0');
      return num;
    });
  
  const siguienteNumero = matriculasDelAño.length > 0 
    ? Math.max(...matriculasDelAño) + 1 
    : 1;
  
  return `${año}-${String(siguienteNumero).padStart(3, '0')}`;
}
