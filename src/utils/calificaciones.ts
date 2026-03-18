export function calcularPromedio(evaluaciones: number[]): number {
  if (evaluaciones.length === 0) return 0;
  const suma = evaluaciones.reduce((acc, val) => acc + val, 0);
  const promedio = suma / evaluaciones.length;
  return Math.round(promedio * 10) / 10; // Redondear a 1 decimal
}

export function calcularPromedioGeneral(calificaciones: { promedio: number }[]): number {
  if (calificaciones.length === 0) return 0;
  const suma = calificaciones.reduce((acc, cal) => acc + cal.promedio, 0);
  const promedio = suma / calificaciones.length;
  return Math.round(promedio * 10) / 10;
}

export function esReprobatoria(calificacion: number): boolean {
  return calificacion < 6.0;
}
