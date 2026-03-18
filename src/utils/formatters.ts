import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
}

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function formatTime(time: string): string {
  // Convierte formato 24h a 12h con AM/PM
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function getEstadoPagoColor(status: string, fechaVencimiento?: string): { color: string; texto: string; icono: string } {
  const hoy = new Date();
  const vencimiento = fechaVencimiento ? new Date(fechaVencimiento) : null;

  if (status === 'pagado') {
    return { color: 'green', texto: 'Pagado', icono: '✅' };
  }

  if (status === 'vencido') {
    return { color: 'red', texto: 'Vencido', icono: '🔴' };
  }

  if (status === 'pendiente' && vencimiento && vencimiento < hoy) {
    return { color: 'red', texto: 'Vencido', icono: '🔴' };
  }

  if (status === 'pendiente') {
    return { color: 'yellow', texto: 'Pendiente', icono: '⚠️' };
  }

  return { color: 'gray', texto: status, icono: '⚪' };
}
