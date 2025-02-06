import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (targetRef: HTMLElement | null, type: 'resume' | 'cover-letter' = 'resume') => {
  if (!targetRef) return;

  try {
    // Create a clone of the target element
    const clone = targetRef.cloneNode(true) as HTMLElement;
    const printContainer = document.createElement('div');
    printContainer.className = 'print-container';
    printContainer.appendChild(clone);
    document.body.appendChild(printContainer);

    // Apply print styles to ensure consistency
    clone.style.cssText = `
      width: 100%;
      min-height: 100%;
      padding: 0;
      margin: 0;
      background: white;
      box-shadow: none;
    `;

    // Configure html2canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 794, // A4 width in pixels at 96 DPI
      windowHeight: 1123, // A4 height in pixels at 96 DPI
      onclone: (document) => {
        const element = document.querySelector('#cover-letter-preview, #resume-preview') as HTMLElement;
        if (element) {
          element.style.transform = 'none';
          element.style.width = '100%';
          element.style.height = '100%';
          element.style.margin = '0';
          element.style.padding = '0';
        }
      }
    });

    // Remove the clone after capturing
    document.body.removeChild(printContainer);

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
      orientation: 'portrait'
    });

    // Calculate dimensions to fit A4 page
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to PDF
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
      'JPEG',
      0,
      0,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );

    // Set filename based on document type
    const filename = type === 'resume' ? 'resume.pdf' : 'cover-letter.pdf';
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};