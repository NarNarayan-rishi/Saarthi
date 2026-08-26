import { jsPDF } from 'jspdf';
import { StudentProfile, JourneyStage, StageAchievement, CareerGoalRole } from '../types';

export interface ResumePdfOptions {
  theme?: 'indigo' | 'slate' | 'navy' | 'emerald';
  includeMilestones?: boolean;
  includeCertifications?: boolean;
  includeProjects?: boolean;
  includeInternships?: boolean;
}

export const generateDigitalResumePdf = (
  profile: StudentProfile,
  careerGoal: CareerGoalRole,
  journeyStages: JourneyStage[],
  stageAchievements: StageAchievement[],
  userExp: number,
  options: ResumePdfOptions = {}
): jsPDF => {
  const {
    theme = 'indigo',
    includeMilestones = true,
    includeCertifications = true,
    includeProjects = true,
    includeInternships = true,
  } = options;

  // Initialize jsPDF document (standard A4: 210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Color Palettes
  const colors = {
    indigo: { primary: [79, 70, 229], secondary: [99, 102, 241], dark: [30, 27, 75], light: [238, 242, 255] },
    slate: { primary: [51, 65, 85], secondary: [100, 116, 139], dark: [15, 23, 42], light: [241, 245, 249] },
    navy: { primary: [15, 76, 129], secondary: [43, 108, 176], dark: [10, 37, 64], light: [235, 244, 255] },
    emerald: { primary: [5, 150, 105], secondary: [16, 185, 129], dark: [6, 78, 59], light: [236, 253, 245] },
  }[theme];

  let currentY = margin;

  // Helper: check page break
  const ensureSpace = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      // Add page header accent
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(margin, margin, contentWidth, 1.5, 'F');
      currentY += 5;
    }
  };

  // 1. TOP HEADER BANNER
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  // Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(profile.name || 'Student Candidate', margin + 6, currentY + 8);

  // Target Role & Headline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const headline = `${profile.headline || 'Aspiring Professional'} • Target Role: ${careerGoal}`;
  doc.text(headline.slice(0, 85), margin + 6, currentY + 14);

  // Verified Platform Pill
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 48, currentY + 4, 42, 6.5, 1.5, 1.5, 'F');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SAARTHI VERIFIED', pageWidth - margin - 45, currentY + 8.5);

  // Contact Strip under header
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.rect(margin, currentY + 24, contentWidth, 7.5, 'F');
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  const contactText = `${profile.email}   |   ${profile.phone}   |   ${profile.location}`;
  doc.text(contactText, margin + 4, currentY + 29);

  currentY += 36;

  // Helper for Section Titles
  const drawSectionHeader = (title: string, iconSymbol: string = '') => {
    ensureSpace(12);
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(margin, currentY, 3, 6, 'F');

    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`${iconSymbol} ${title}`.trim(), margin + 5, currentY + 4.5);

    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin + 5, currentY + 6.5, margin + contentWidth, currentY + 6.5);

    currentY += 9.5;
  };

  // 2. PROFESSIONAL SUMMARY
  if (profile.bio) {
    drawSectionHeader('PROFESSIONAL SUMMARY', '•');
    doc.setTextColor(60, 64, 70);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const splitBio = doc.splitTextToSize(profile.bio, contentWidth - 4);
    doc.text(splitBio, margin + 2, currentY);
    currentY += splitBio.length * 4.2 + 3;
  }

  // 3. EDUCATION
  drawSectionHeader('EDUCATION', '•');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text(profile.institution, margin + 2, currentY);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(`CGPA: ${profile.cgpa}`, pageWidth - margin - 25, currentY);

  currentY += 4.2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`${profile.degree} in ${profile.branch}`, margin + 2, currentY);
  doc.text(`Graduation: ${profile.expectedGraduation} (${profile.currentYear})`, pageWidth - margin - 48, currentY);
  currentY += 6;

  // 4. VERIFIED INTERNSHIPS & EXPERIENCE
  if (includeInternships && profile.internships && profile.internships.length > 0) {
    drawSectionHeader('VERIFIED INTERNSHIPS & PRACTICAL EXPERIENCE', '•');
    profile.internships.forEach((exp) => {
      ensureSpace(18);
      // Role & Company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      doc.text(exp.role, margin + 2, currentY);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(exp.company, margin + 50, currentY);

      // Duration & Verified Tag
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`${exp.duration} [Verified]`, pageWidth - margin - 45, currentY);

      currentY += 4;
      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 64, 70);
      const splitDesc = doc.splitTextToSize(exp.description, contentWidth - 4);
      doc.text(splitDesc, margin + 2, currentY);
      currentY += splitDesc.length * 3.8;

      // Tech tags
      if (exp.technologies && exp.technologies.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 100, 120);
        doc.text(`Technologies: ${exp.technologies.join(', ')}`, margin + 2, currentY);
        currentY += 4.5;
      } else {
        currentY += 2;
      }
    });
  }

  // 5. SKILL INVENTORY
  drawSectionHeader('VERIFIED SKILL INVENTORY & PROFICIENCY MATRIX', '•');
  ensureSpace(24);

  // Group skills into 2 columns
  const skillsList = profile.skills || [];
  const colWidth = (contentWidth - 6) / 2;
  const half = Math.ceil(skillsList.length / 2);

  const leftSkills = skillsList.slice(0, half);
  const rightSkills = skillsList.slice(half);

  const startSkillsY = currentY;
  let maxSkillY = currentY;

  // Left Column
  let leftY = startSkillsY;
  leftSkills.forEach((sk) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    const verifiedMark = sk.verified ? ' [Verified]' : '';
    doc.text(`${sk.name}${verifiedMark}`, margin + 2, leftY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(`${sk.proficiency}%`, margin + colWidth - 12, leftY);

    // Mini progress bar
    doc.setFillColor(230, 235, 245);
    doc.rect(margin + 2, leftY + 1.2, colWidth - 16, 1.5, 'F');
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(margin + 2, leftY + 1.2, ((colWidth - 16) * sk.proficiency) / 100, 1.5, 'F');

    leftY += 5.5;
  });

  // Right Column
  let rightY = startSkillsY;
  rightSkills.forEach((sk) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    const verifiedMark = sk.verified ? ' [Verified]' : '';
    doc.text(`${sk.name}${verifiedMark}`, margin + colWidth + 4, rightY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(`${sk.proficiency}%`, margin + contentWidth - 12, rightY);

    // Mini progress bar
    doc.setFillColor(230, 235, 245);
    doc.rect(margin + colWidth + 4, rightY + 1.2, colWidth - 16, 1.5, 'F');
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(margin + colWidth + 4, rightY + 1.2, ((colWidth - 16) * sk.proficiency) / 100, 1.5, 'F');

    rightY += 5.5;
  });

  maxSkillY = Math.max(leftY, rightY);
  currentY = maxSkillY + 3;

  // 6. COMPLETED MILESTONES & CAREER PATHWAY PROGRESS
  if (includeMilestones) {
    drawSectionHeader('COMPLETED CAREER READINESS MILESTONES & STAGES', '•');
    ensureSpace(20);

    const completedStages = journeyStages.filter((s) => s.progress > 0);
    const stagesToRender = completedStages.length > 0 ? completedStages : journeyStages.slice(0, 5);

    // 2-column milestone grid
    const mColWidth = (contentWidth - 6) / 2;
    let mLeftY = currentY;
    let mRightY = currentY;

    stagesToRender.forEach((st, idx) => {
      const isLeft = idx % 2 === 0;
      const targetX = isLeft ? margin + 2 : margin + mColWidth + 4;
      const currentTargetY = isLeft ? mLeftY : mRightY;

      // Status indicator
      const isComplete = st.status === 'Completed' || st.progress === 100;
      doc.setFillColor(isComplete ? 240 : 248, isComplete ? 253 : 249, isComplete ? 244 : 250);
      doc.roundedRect(targetX, currentTargetY - 3, mColWidth - 4, 7, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(isComplete ? 22 : 70, isComplete ? 101 : 70, isComplete ? 52 : 70);
      const symbol = isComplete ? '[Completed]' : `[${st.progress}%]`;
      doc.text(`Stage ${st.stageNumber}: ${st.title} ${symbol}`, targetX + 2, currentTargetY + 1.5);

      if (isLeft) {
        mLeftY += 8.5;
      } else {
        mRightY += 8.5;
      }
    });

    currentY = Math.max(mLeftY, mRightY) + 2;

    // Gamification Summary Pill
    ensureSpace(8);
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.roundedRect(margin + 2, currentY, contentWidth - 4, 6.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    const unlockedCount = stageAchievements.filter((a) => a.isUnlocked).length;
    doc.text(
      `Total Experience: ${userExp} EXP   |   Unlocked Badges: ${unlockedCount}/${stageAchievements.length}   |   Verified Pipeline: Stages 1-8 Complete`,
      margin + 6,
      currentY + 4.2
    );
    currentY += 10;
  }

  // 7. KEY PROJECTS
  if (includeProjects && profile.projects && profile.projects.length > 0) {
    drawSectionHeader('FEATURED TECHNICAL PROJECTS', '•');
    profile.projects.slice(0, 3).forEach((proj) => {
      ensureSpace(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 20, 20);
      doc.text(proj.title, margin + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text(proj.date || '', pageWidth - margin - 28, currentY);

      currentY += 3.8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(60, 64, 70);
      const splitDesc = doc.splitTextToSize(proj.description, contentWidth - 4);
      doc.text(splitDesc, margin + 2, currentY);
      currentY += splitDesc.length * 3.5;

      if (proj.technologies && proj.technologies.length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(`Stack: ${proj.technologies.join(', ')}`, margin + 2, currentY);
        currentY += 4.5;
      }
    });
  }

  // 8. CERTIFICATIONS & CREDENTIALS
  if (includeCertifications && profile.certifications && profile.certifications.length > 0) {
    drawSectionHeader('VERIFIED CERTIFICATIONS & LICENSES', '•');
    profile.certifications.forEach((c) => {
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(20, 20, 20);
      doc.text(`• ${c.title}`, margin + 2, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`${c.issuer} (${c.issueDate})`, pageWidth - margin - 45, currentY);
      currentY += 4.5;
    });
  }

  // FOOTER (Page number & Authenticity watermark on all pages)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10, margin + contentWidth, pageHeight - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 130, 140);
    doc.text(
      'Compiled via Saarthi Career Readiness Platform • Verified Student Resume',
      margin + 2,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 6);
  }

  return doc;
};


/**
 * Generates an ATS-friendly Resume (No columns, Times New Roman, simple standard sections)
 */
export const generateAtsResumePdf = (resumeData: any): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 25.4; // 1 inch margin
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // Set font to standard Times
  doc.setFont('times', 'normal');

  const addLine = (y: number) => {
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    return y + 2;
  };

  const addText = (text: string, size: number, style: 'normal' | 'bold' | 'italic', align: 'left' | 'center' | 'right', y: number) => {
    doc.setFont('times', style);
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
    const textWidth = doc.getStringUnitWidth(text) * size / doc.internal.scaleFactor;
    
    let x = margin;
    if (align === 'center') x = (pageWidth - textWidth) / 2;
    if (align === 'right') x = pageWidth - margin - textWidth;
    
    doc.text(text, x, y);
    return y + (size * 0.35); // Approx height + spacing
  };

  const addSectionHeader = (title: string, y: number) => {
    y = addText(title.toUpperCase(), 12, 'bold', 'left', y + 5);
    y = addLine(y + 1);
    return y + 4;
  };

  // 1. HEADER (Contact Info)
  currentY = addText(resumeData.name || 'Your Name', 18, 'bold', 'center', currentY);
  
  const contacts = [
    resumeData.email,
    resumeData.phone,
    resumeData.location,
    resumeData.linkedinUrl,
    resumeData.githubUrl
  ].filter(Boolean).join(' | ');
  
  currentY = addText(contacts, 10, 'normal', 'center', currentY);
  currentY += 8;

  // 2. PROFESSIONAL SUMMARY
  if (resumeData.summary) {
    currentY = addSectionHeader('Professional Summary', currentY);
    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    const splitSummary = doc.splitTextToSize(resumeData.summary, contentWidth);
    doc.text(splitSummary, margin, currentY);
    currentY += splitSummary.length * 5 + 4;
  }

  // 3. SKILLS
  if (resumeData.skills && resumeData.skills.length > 0) {
    currentY = addSectionHeader('Skills & Core Competencies', currentY);
    const skillsText = resumeData.skills.join(', ');
    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    const splitSkills = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(splitSkills, margin, currentY);
    currentY += splitSkills.length * 5 + 4;
  }

  // 4. EXPERIENCE
  if (resumeData.experience && resumeData.experience.length > 0) {
    currentY = addSectionHeader('Experience', currentY);
    resumeData.experience.forEach((exp: any) => {
      // Check page break
      if (currentY > 260) { doc.addPage(); currentY = margin; }
      
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(exp.title || 'Role', margin, currentY);
      
      doc.setFont('times', 'bold');
      const dateText = exp.duration || 'Dates';
      const dateWidth = doc.getStringUnitWidth(dateText) * 11 / doc.internal.scaleFactor;
      doc.text(dateText, pageWidth - margin - dateWidth, currentY);
      currentY += 5;
      
      doc.setFont('times', 'italic');
      doc.text(exp.company || 'Company', margin, currentY);
      currentY += 5;

      if (exp.bullets && exp.bullets.length > 0) {
        doc.setFont('times', 'normal');
        doc.setFontSize(10.5);
        exp.bullets.forEach((bullet: string) => {
          const bText = doc.splitTextToSize(`• ${bullet}`, contentWidth - 5);
          doc.text(bText, margin + 5, currentY);
          currentY += bText.length * 4.5 + 1;
        });
      }
      currentY += 3;
    });
  }

  // 5. PROJECTS
  if (resumeData.projects && resumeData.projects.length > 0) {
    currentY = addSectionHeader('Projects', currentY);
    resumeData.projects.forEach((proj: any) => {
      if (currentY > 260) { doc.addPage(); currentY = margin; }
      
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text(proj.title || 'Project Name', margin, currentY);
      
      if (proj.date) {
        doc.setFont('times', 'bold');
        const dateWidth = doc.getStringUnitWidth(proj.date) * 11 / doc.internal.scaleFactor;
        doc.text(proj.date, pageWidth - margin - dateWidth, currentY);
      }
      currentY += 5;
      
      if (proj.description) {
        doc.setFont('times', 'normal');
        doc.setFontSize(10.5);
        const splitDesc = doc.splitTextToSize(`• ${proj.description}`, contentWidth - 5);
        doc.text(splitDesc, margin + 5, currentY);
        currentY += splitDesc.length * 4.5 + 2;
      }
    });
  }

  // 6. EDUCATION
  if (resumeData.education) {
    currentY = addSectionHeader('Education', currentY);
    if (currentY > 260) { doc.addPage(); currentY = margin; }
    
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(resumeData.education.institution || 'University', margin, currentY);
    
    if (resumeData.education.date) {
      doc.setFont('times', 'bold');
      const dWidth = doc.getStringUnitWidth(resumeData.education.date) * 11 / doc.internal.scaleFactor;
      doc.text(resumeData.education.date, pageWidth - margin - dWidth, currentY);
    }
    currentY += 5;

    doc.setFont('times', 'normal');
    doc.setFontSize(10.5);
    doc.text(`${resumeData.education.degree} in ${resumeData.education.branch}`, margin, currentY);
    currentY += 5;
    
    if (resumeData.education.cgpa) {
      doc.text(`CGPA: ${resumeData.education.cgpa}`, margin, currentY);
    }
  }

  return doc;
};
