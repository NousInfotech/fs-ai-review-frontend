import api from '@/lib/api';

/**
 * Triggers the download of the audit report PDF from the backend.
 * 
 * @param reviewId The ID of the review/upload
 * @param filename Optional filename for the downloaded file
 */
export const downloadAuditReport = async (reviewId: string, filename?: string) => {
  try {
    const response = await api.get(`/api/v1/reviews/${reviewId}/download-pdf`, {
      responseType: 'blob',
    });

    // Create a blob URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename
    const finalFilename = filename || `Audit_Report_${reviewId}.pdf`;
    link.setAttribute('download', finalFilename);
    
    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download PDF:', error);
    throw error;
  }
};
