import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, UnderlineType, IBorderOptions, Packer } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from '../types/resume';

const borderOptions: IBorderOptions = {
  size: 1,
  color: "999999",
  space: 1
};

function stripHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

export async function generateWordDocument(formData: ResumeData) {
  const sections = [];

  // Header with contact info
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: formData.fullName,
          bold: true,
          size: 32,
        }),
      ],
      spacing: { after: 200 },
    })
  );

  if (formData.title) {
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: formData.title, size: 24 })],
        spacing: { after: 200 },
      })
    );
  }

  // Contact Information
  const contactInfo = [];
  if (formData.email) contactInfo.push(formData.email);
  if (formData.phone) contactInfo.push(formData.phone);
  if (formData.location) contactInfo.push(formData.location);

  sections.push(
    new Paragraph({
      children: [new TextRun({ text: contactInfo.join(' | ') })],
      spacing: { after: 400 },
    })
  );

  // About Me Section
  if (formData.about) {
    sections.push(
      new Paragraph({
        text: "About Me",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: stripHtml(formData.about) })],
        spacing: { after: 400 },
      })
    );
  }

  // Experience Section
  if (formData.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    formData.experience.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun({ text: " at " }),
            new TextRun({ text: exp.company, bold: true }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: exp.duration, italics: true })],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: stripHtml(exp.description) })],
          spacing: { after: 200 },
        })
      );
    });
  }

  // Education Section
  if (formData.education.length > 0) {
    sections.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    formData.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true }),
            new TextRun({ text: " - " + edu.year }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: edu.degree })],
          spacing: { after: 200 },
        })
      );
    });
  }

  // Skills Section
  if (formData.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: formData.skills.join(", ") })],
        spacing: { after: 400 },
      })
    );
  }

  // Custom Sections
  if (formData.customSections) {
    formData.customSections.forEach((section) => {
      if (section.title && section.content) {
        sections.push(
          new Paragraph({
            text: section.title,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: stripHtml(section.content) })],
            spacing: { after: 400 },
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: sections,
      },
    ],
  });

  // Generate and save document using Packer
  const blob = await Packer.toBlob(doc);
  const fileName = `${formData.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.docx`;
  saveAs(blob, fileName);
}