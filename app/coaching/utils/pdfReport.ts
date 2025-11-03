import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

interface Stats {
  totalChildren: number;
  totalSessions: number;
  totalAttendanceRecords: number;
  attendanceRate: number;
}

// Extend jsPDF type definition to include autoTable plugin
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}

/**
 * Generates a professional PDF report of current coaching stats.
 */
export function generatePDFReport(stats: Stats): void {
  const doc = new jsPDF();

  // 🏷️ Title
  doc.setFontSize(18);
  doc.text("Coaching Programme Report", 14, 20);

  // 📊 Summary Section
  doc.setFontSize(12);
  doc.text("Summary Overview:", 14, 35);

  // Define table options safely with type support
  const tableOptions: UserOptions = {
    startY: 40,
    head: [["Metric", "Value"]],
    body: [
      ["Total Children", stats.totalChildren.toString()],
      ["Total Sessions", stats.totalSessions.toString()],
      ["Total Attendance Records", stats.totalAttendanceRecords.toString()],
      ["Attendance Rate (%)", `${stats.attendanceRate}%`],
    ],
  };

  autoTable(doc, tableOptions);

  // 🕓 Footer
  const currentDate = new Date().toLocaleDateString();
  const yPosition = doc.lastAutoTable?.finalY ?? 80;
  doc.text(`Generated on: ${currentDate}`, 14, yPosition + 10);

  // 💾 Save PDF
  doc.save(`Coaching_Report_${currentDate.replace(/\//g, "-")}.pdf`);
}
