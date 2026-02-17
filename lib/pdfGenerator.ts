import api from '@/lib/api';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReviewResult, ReconciliationTable } from "@/types/review";

/**
 * Triggers the download of the audit report PDF from the backend.
 */
export const downloadAuditReport = async (reviewId: string, filename?: string) => {
  try {
    const response = await api.get(`/api/v1/reviews/${reviewId}/download-pdf`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const finalFilename = filename || `Audit_Report_${reviewId}.pdf`;
    link.setAttribute('download', finalFilename);
    
    document.body.appendChild(link);
    link.click();
    
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download PDF:', error);
    throw error;
  }
};

/**
 * Utility to render small tables within the PDF sections.
 */
const renderMiniTable = (doc: jsPDF, title: string, tableData: ReconciliationTable, startY: number) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.text(title, 14, startY);

  autoTable(doc, {
    startY: startY + 4,
    head: [tableData.columns],
    body: tableData.rows,
    theme: "striped",
    headStyles: { 
      fillColor: [248, 250, 252], 
      textColor: [71, 85, 105], // Slate 600
      fontSize: 9, 
      fontStyle: 'bold',
      halign: 'left' // Explicitly set default, overridden in didParseCell
    },
    styles: { 
      fontSize: 9, 
      cellPadding: 3, 
      textColor: [30, 41, 59], // Slate 800
      valign: 'middle'
    },
    columnStyles: {
      0: { fontStyle: 'bold' } 
    },
    didParseCell: (data) => {
      // Force right alignment for all columns except the first one (Description)
      if (data.column.index > 0) {
        data.cell.styles.halign = 'right';
      }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  // @ts-ignore
  return doc.lastAutoTable.finalY + 12;
};

/**
 * Utility to fetch and convert image to base64 for PDF embedding
 */
const getImageData = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to fetch image for PDF:", error);
    return null;
  }
};

/**
 * Utility to get image dimensions
 */
const getImageDimensions = (base64: string): Promise<{ width: number, height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = base64;
  });
};

/**
 * Generates a PDF version of the financial status report client-side.
 */
export const generateFinancialStatusPDF = async (data: ReviewResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  let finalY = 0;

  // Helper to remove emojis
  const cleanText = (text: string) => {
    return (text || "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{2B50}\u{231A}-\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{25FD}\u{25FE}\uFE0F]/gu, '').trim();
  };

  // Add header with colored top bar
  const addPageHeader = (pageNum: number) => {
    doc.setFillColor(41, 98, 255); // Professional blue
    doc.rect(0, 0, pageWidth, 0.1, "F"); // Hairline top border
    
    if (pageNum > 1) {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Audit Review Results", 14, pageHeight - 10);
      doc.text(`Page ${pageNum}`, pageWidth - 14, pageHeight - 10, { align: "right" });
    }
  };

  // Page 1 Header
  addPageHeader(1);

  // Title
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont("helvetica", "bold");
  doc.text("Audit Review Results", 14, 22);

  // Date
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.setFont("helvetica", "normal");
  doc.text(`Report Generated: ${new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 14, 28);

  // --- SUMMARY STATISTICS CARDS ---
  const totalTests = (data.A.items?.length || 0) + (data.B.items?.length || 0) + (data.C.items?.length || 0);
  const stats = [
    { label: "TOTAL TESTS", value: totalTests, color: [59, 130, 246], bg: [239, 246, 255] }, // Blue
    { label: "CORRECT ITEMS", value: data.A.items?.length || 0, color: [22, 163, 74], bg: [240, 253, 244] }, // Green
    { label: "CRITICAL ERRORS", value: data.B.items?.length || 0, color: [220, 38, 38], bg: [254, 242, 242] }, // Red
    { label: "REG. BREACHES", value: data.C.items?.length || 0, color: [202, 138, 4], bg: [254, 252, 232] }, // Yellow/Gold
  ];

  const cardWidth = (pageWidth - 28 - 9) / 4;
  let cardX = 14;
  const cardY = 38;
  const cardHeight = 22;

  stats.forEach((stat) => {
    // Background
    doc.setFillColor(stat.bg[0], stat.bg[1], stat.bg[2]);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, "F");
    
    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(stat.label, cardX + cardWidth / 2, cardY + 8, { align: "center" });
    
    // Value
    doc.setFontSize(14);
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.text(stat.value.toString(), cardX + cardWidth / 2, cardY + 16, { align: "center" });
    
    cardX += cardWidth + 3;
  });

  // Verdict Section
  const verdictText = cleanText(data.E?.verdict || "N/A");
  const isFail = verdictText.toLowerCase().includes("not fit") || (data.B.items?.length || 0) > 0;
  finalY = cardY + cardHeight + 8;
  
  // Banner Background
  doc.setFillColor(isFail ? 254 : 240, isFail ? 242 : 253, isFail ? 242 : 244); 
  doc.setDrawColor(isFail ? 220 : 22, isFail ? 38 : 163, isFail ? 38 : 74);
  doc.setLineWidth(0.1); // Ultra-thin border
  doc.roundedRect(14, finalY, pageWidth - 28, 28, 2, 2, "FD");
  
  // Verdict Title
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(isFail ? 153 : 21, isFail ? 27 : 128, isFail ? 27 : 61);
  doc.text("VERDICT", 18, finalY + 7);
  
  // Verdict Value
  doc.setFontSize(12);
  doc.text(verdictText, 18, finalY + 13);

  // Executive Summary (smaller text below verdict)
  if (data.E?.executive_summary) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(71, 85, 105);
    const splitSummary = doc.splitTextToSize(data.E.executive_summary, pageWidth - 36);
    doc.text(splitSummary, 18, finalY + 18);
    finalY += 32;
  } else {
    finalY += 32;
  }

  finalY += 8;

  // Section A: Confirmed Correct Items
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 163, 74); // Green
  doc.text(`Confirmed Correct Items (${data.A.items?.length || 0})`, 14, finalY);
  
  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.1);
  doc.line(14, finalY + 2, 50, finalY + 2);

  finalY += 10;

  if (data.A.items && data.A.items.length > 0) {
    data.A.items.forEach((item) => {
      if (finalY > pageHeight - 35) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(`${item.test_id} — ${item.name}`, 14, finalY);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text("Description:", 14, finalY + 6);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const splitDesc = doc.splitTextToSize(item.description || "N/A", pageWidth - 35);
      doc.text(splitDesc, 14, finalY + 10);
      
      finalY += 14 + (splitDesc.length * 4);
    });
    finalY += 5;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("No items to display.", 14, finalY);
    finalY += 18;
  }

  /**
   * Helper to render annotated images below location details
   */
  const renderHighlights = async (loc: any, startY: number, color: number[]) => {
    if (!loc.url) return startY;

    const imgData = await getImageData(loc.url);
    if (!imgData) return startY;

    const dimensions = await getImageDimensions(imgData);
    if (dimensions.width === 0) return startY;

    const maxImgWidth = pageWidth - 40;
    const maxImgHeight = 80; // Limit height for PDF layout
    let drawWidth = maxImgWidth;
    let drawHeight = (dimensions.height / dimensions.width) * drawWidth;

    if (drawHeight > maxImgHeight) {
      drawHeight = maxImgHeight;
      drawWidth = (dimensions.width / dimensions.height) * drawHeight;
    }

    if (startY + drawHeight > pageHeight - 20) {
      doc.addPage();
      addPageHeader(doc.getNumberOfPages());
      startY = 20;
    }

    const drawX = (pageWidth - drawWidth) / 2;
    doc.addImage(imgData, "JPEG", drawX, startY, drawWidth, drawHeight);

    // DRAW ANNOTATIONS
    if (loc.annotation_data && loc.annotation_data.length > 0) {
      const scaleX = drawWidth / dimensions.width;
      const scaleY = drawHeight / dimensions.height;

      loc.annotation_data.filter((ann: any) => ann.bbox).forEach((ann: any) => {
        const { x, y, width, height } = ann.bbox;

        // Rectangle
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.5);
        doc.rect(drawX + x * scaleX, startY + y * scaleY, width * scaleX, height * scaleY, "D");
      });
    }

    return startY + drawHeight + 10;
  };

  // Section B: Critical Errors
  if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38); // Red
  doc.text(`Critical Errors (${data.B.items?.length || 0})`, 14, finalY);
  
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.1);
  doc.line(14, finalY + 2, 50, finalY + 2);
  
  finalY += 10;

  if (data.B.items && data.B.items.length > 0) {
    for (const item of data.B.items) {
      if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
      
      doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(185, 28, 28);
      doc.text(`${item.test_id} — ${item.name}`, 14, finalY);
      
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(80, 80, 80);
      doc.text("Description:", 14, finalY + 6);
      
      doc.setFont("helvetica", "normal").setTextColor(60, 60, 60);
      const splitDesc = doc.splitTextToSize(item.description || "No description provided", pageWidth - 35);
      doc.text(splitDesc, 14, finalY + 10);
      
      let nextY = finalY + 12 + (splitDesc.length * 4);
      
      if (item.result) {
        doc.setFont("helvetica", "bold").setTextColor(80, 80, 80).text("Result:", 14, nextY);
        doc.setFont("helvetica", "normal").setTextColor(60, 60, 60);
        const splitResult = doc.splitTextToSize(item.result, pageWidth - 35);
        doc.text(splitResult, 14, nextY + 4);
        nextY += (splitResult.length * 4) + 6;
      }

      // Add Location Details if present
      if (item.location && item.location.length > 0) {
        for (let i = 0; i < item.location.length; i++) {
          const loc = item.location[i];
          if (nextY > pageHeight - 30) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); nextY = 20; }
          
          doc.setFillColor(254, 242, 242); 
          doc.roundedRect(14, nextY - 1, pageWidth - 28, 12, 1, 1, "F");
          
          doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(185, 28, 28);
          doc.text(`LOCATION ${item.location.length > 1 ? i + 1 : ""}:`, 18, nextY + 3);
          
          doc.setFont("helvetica", "normal").setTextColor(107, 114, 128);
          let locText = `Page: ${loc.page_no || "N/A"}`;
          doc.text(locText, 18, nextY + 7);
          
          nextY += 15;
          nextY = await renderHighlights(loc, nextY, [220, 38, 38]);
        }
      }
      
      finalY = nextY + 4;
    }
    finalY += 5;
  } else {
    doc.setFont("helvetica", "italic").setFontSize(9).text("No critical errors found.", 14, finalY);
    finalY += 18;
  }

  // Section C: Disclosure & Regulatory Breaches
  if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }

  doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(234, 179, 8); // Yellow
  doc.text(`Disclosure & Regulatory Breaches (${data.C.items?.length || 0})`, 14, finalY);
  
  doc.setDrawColor(234, 179, 8).setLineWidth(0.1).line(14, finalY + 2, 60, finalY + 2);
  
  finalY += 10;

  if (data.C.items && data.C.items.length > 0) {
    for (const item of data.C.items) {
      if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
      
      doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(161, 98, 7);
      doc.text(`${item.test_id} — ${item.name}`, 14, finalY);
      
      doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(80, 80, 80).text("Description:", 14, finalY + 6);
      
      doc.setFont("helvetica", "normal").setTextColor(60, 60, 60);
      const splitDesc = doc.splitTextToSize(item.description || "No description provided", pageWidth - 35);
      doc.text(splitDesc, 14, finalY + 10);
      
      let nextY = finalY + 12 + (splitDesc.length * 4);
      
      if (item.result) {
        doc.setFont("helvetica", "bold").setTextColor(80, 80, 80).text("Result:", 14, nextY);
        doc.setFont("helvetica", "normal").setTextColor(60, 60, 60);
        const splitResult = doc.splitTextToSize(item.result, pageWidth - 35);
        doc.text(splitResult, 14, nextY + 4);
        nextY += (splitResult.length * 4) + 6;
      }

      // Add Location Details if present
      if (item.location && item.location.length > 0) {
        for (let i = 0; i < item.location.length; i++) {
          const loc = item.location[i];
          if (nextY > pageHeight - 30) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); nextY = 20; }
          
          doc.setFillColor(254, 252, 232); 
          doc.roundedRect(14, nextY - 1, pageWidth - 28, 12, 1, 1, "F");
          
          doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(161, 98, 7);
          doc.text(`LOCATION ${item.location.length > 1 ? i + 1 : ""}:`, 18, nextY + 3);
          
          doc.setFont("helvetica", "normal").setTextColor(107, 114, 128);
          let locText = `Page: ${loc.page_no || "N/A"}`;
          doc.text(locText, 18, nextY + 7);
          
          nextY += 15;
          nextY = await renderHighlights(loc, nextY, [202, 138, 4]);
        }
      }
      
      finalY = nextY + 4;
    }
    finalY += 5;
  } else {
    doc.setFont("helvetica", "italic").setFontSize(9).text("No disclosure breaches found.", 14, finalY);
    finalY += 18;
  }

  // Section D: Reconciliation Tables
  if (data.D && data.D.tables) {
    if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
    
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(34, 197, 94);
    const sectionTitle = cleanText(data.D.title || "Reconciliation Tables");
    doc.text(sectionTitle, 14, finalY);
    
    doc.setDrawColor(34, 197, 94).setLineWidth(0.1).line(14, finalY + 2, 14 + doc.getTextWidth(sectionTitle), finalY + 2);
    
    finalY += 10;

    for (const [key, table] of Object.entries(data.D.tables)) {
      const title = table.title || key.split('_').join(' ').toUpperCase();
      if (finalY > pageHeight - 40) { doc.addPage(); addPageHeader(doc.getNumberOfPages()); finalY = 20; }
      finalY = renderMiniTable(doc, title, table, finalY);
    }
  }

  // Save/Download
  const dateStr = new Date().toLocaleDateString('en-GB').split('/').join('-');
  doc.save(`Financial_Status_Report_${dateStr}.pdf`);
};
