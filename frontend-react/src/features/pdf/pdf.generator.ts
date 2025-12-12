import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definir colores de la universidad
export const UNIVERSITY_COLORS = {
  PRIMARY: '#013950', // Azul Oscuro
  SECONDARY: '#4ba3c3', // Azul Claro
  CORAL: '#ff5e5b',
  DECORATIVE: '#764134',
  TEXT: '#333333',
  LIGHT_BG: '#f6f6f6'
};

// Extender API.User para incluir campos opcionales que podrían venir de otras consultas
export interface ReportUser extends API.User {
  joinDate?: string;
  progress?: number;
  eventsAttended?: number;
  certificatesEarned?: number;
  // A veces el backend retorna 'status' o 'is_active', aseguramos acceso seguro
  status?: string; 
}

const addHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Fondo del encabezado
  doc.setFillColor(UNIVERSITY_COLORS.PRIMARY);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 25, { align: 'center' });
  
  // Fecha de generación
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });
  doc.text(`Generado el: ${dateStr}`, pageWidth - 15, 35, { align: 'right' });
};

const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  doc.setFillColor(UNIVERSITY_COLORS.SECONDARY);
  doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Sistema de Gestión de Eventos - Universidad', pageWidth / 2, pageHeight - 4, { align: 'center' });
};

/**
 * Genera un reporte PDF individual para un usuario
 */
export const generateUserReport = (user: ReportUser) => {
  const doc = new jsPDF();
  
  // 1. Encabezado
  addHeader(doc, 'Reporte Individual de Progreso');
  
  let yPos = 50;
  
  // 2. Información del Usuario
  doc.setTextColor(UNIVERSITY_COLORS.PRIMARY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Información del Usuario', 14, yPos);
  
  yPos += 10;
  
  doc.setDrawColor(UNIVERSITY_COLORS.SECONDARY);
  doc.setLineWidth(0.5);
  doc.line(14, yPos, 196, yPos);
  
  yPos += 10;
  
  // Detalles
  const userDetails = [
    ['Name:', user.name || 'N/A'],
    ['Email:', user.email || 'N/A'],
    ['Role:', user.role || 'N/A'],
    // status is likely present in the runtime object even if not in type
    ['Status:', user.status || 'N/A'],
    ['Join Date:', user.joinDate || format(new Date(), 'dd/MM/yyyy')], // Fallback if missing
  ];
  
  autoTable(doc, {
    startY: yPos,
    body: userDetails,
    theme: 'plain',
    styles: { fontSize: 12, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: UNIVERSITY_COLORS.PRIMARY, cellWidth: 50 },
      1: { textColor: UNIVERSITY_COLORS.TEXT }
    },
  });
  
  // @ts-expect-error - lastAutoTable is added by jspdf-autotable
  yPos = doc.lastAutoTable.finalY + 20;
  
  // 3. Métricas de Progreso
  doc.setTextColor(UNIVERSITY_COLORS.PRIMARY);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Métricas de Desempeño', 14, yPos);
  
  yPos += 10;
  doc.setDrawColor(UNIVERSITY_COLORS.SECONDARY);
  doc.line(14, yPos, 196, yPos);
  yPos += 10;
  
  const metrics = [
    ['Eventos Asistidos', user.eventsAttended?.toString() || '0'],
    ['Certificados Obtenidos', user.certificatesEarned?.toString() || '0'],
    // ['Progreso General', (user.progress ? `${user.progress}%` : '0%')],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Métrica', 'Valor']],
    body: metrics,
    theme: 'striped',
    headStyles: { fillColor: UNIVERSITY_COLORS.SECONDARY, textColor: 255 },
    styles: { fontSize: 12, cellPadding: 3 },
  });
  
  // Footer
  addFooter(doc);
  
  // Guardar PDF
  const filename = `Reporte_${user.name?.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(filename);
};

/**
 * Genera un reporte PDF con la lista completa de usuarios
 */
export const generateTotalReport = (users: ReportUser[]) => {
  const doc = new jsPDF();
  
  // 1. Encabezado
  addHeader(doc, 'Reporte General de Usuarios');
  
  let yPos = 50;
  
  // 2. Resumen
  doc.setTextColor(UNIVERSITY_COLORS.PRIMARY);
  doc.setFontSize(14);
  doc.text(`Total de Usuarios: ${users.length}`, 14, yPos);
  
  yPos += 10;
  
  // 3. Tabla de Usuarios
  const tableBody = users.map(user => [
    user.name || 'N/A',
    user.email || 'N/A',
    user.role || 'N/A',
    user.eventsAttended?.toString() || '0',
    user.certificatesEarned?.toString() || '0'
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Nombre', 'Email', 'Rol', 'Eventos', 'Certificados']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: UNIVERSITY_COLORS.PRIMARY, textColor: 255 },
    styles: { fontSize: 10 },
    alternateRowStyles: { fillColor: UNIVERSITY_COLORS.LIGHT_BG }
  });
  
  // Footer
  addFooter(doc);
  
  // Guardar PDF
  const filename = `Reporte_General_${format(new Date(), 'yyyyMMdd')}.pdf`;
  doc.save(filename);
};
