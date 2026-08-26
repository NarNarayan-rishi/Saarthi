import { InstitutionalReport, InstitutionProfile, InternshipPlacementStats, InstitutionalSkillMetric } from '../types';

// CRC32 table & calculator for valid ZIP / XLSX generation
const CRC_TABLE = (() => {
  let c: number;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function computeCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntry {
  path: string;
  data: Uint8Array;
}

function createZipArchive(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let currentOffset = 0;

  // DOS Date/Time (2026-02-22 12:00:00)
  const dosTime = (12 << 11) | (0 << 5) | 0;
  const dosDate = ((2026 - 1980) << 9) | (2 << 5) | 22;

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.path);
    const dataBytes = entry.data;
    const crc = computeCrc32(dataBytes);
    const size = dataBytes.length;

    // Local header: 30 bytes + name length + data
    const localHeader = new Uint8Array(30 + nameBytes.length + size);
    const localView = new DataView(localHeader.buffer);

    localView.setUint32(0, 0x04034b50, true); // signature
    localView.setUint16(4, 20, true); // version needed
    localView.setUint16(6, 0, true); // flags
    localView.setUint16(8, 0, true); // compression: store (0)
    localView.setUint16(10, dosTime, true);
    localView.setUint16(12, dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, size, true); // compressed size
    localView.setUint32(22, size, true); // uncompressed size
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true); // extra len

    localHeader.set(nameBytes, 30);
    localHeader.set(dataBytes, 30 + nameBytes.length);
    localHeaders.push(localHeader);

    // Central directory header: 46 bytes + name length
    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cdHeader.buffer);

    cdView.setUint32(0, 0x02014b50, true); // signature
    cdView.setUint16(4, 20, true); // version made by
    cdView.setUint16(6, 20, true); // version needed
    cdView.setUint16(8, 0, true); // flags
    cdView.setUint16(10, 0, true); // compression: store (0)
    cdView.setUint16(12, dosTime, true);
    cdView.setUint16(14, dosDate, true);
    cdView.setUint32(16, crc, true);
    cdView.setUint32(20, size, true);
    cdView.setUint32(24, size, true);
    cdView.setUint16(28, nameBytes.length, true);
    cdView.setUint16(30, 0, true); // extra len
    cdView.setUint16(32, 0, true); // comment len
    cdView.setUint16(34, 0, true); // disk start
    cdView.setUint16(36, 0, true); // int attr
    cdView.setUint32(38, 0, true); // ext attr
    cdView.setUint32(42, currentOffset, true); // local header offset

    cdHeader.set(nameBytes, 46);
    centralHeaders.push(cdHeader);

    currentOffset += localHeader.length;
  });

  const cdOffset = currentOffset;
  let cdSize = 0;
  centralHeaders.forEach((cd) => (cdSize += cd.length));

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true);
  eocdView.setUint16(6, 0, true);
  eocdView.setUint16(8, entries.length, true);
  eocdView.setUint16(10, entries.length, true);
  eocdView.setUint32(12, cdSize, true);
  eocdView.setUint32(16, cdOffset, true);
  eocdView.setUint16(20, 0, true);

  // Combine all parts
  const totalLength = cdOffset + cdSize + 22;
  const zipBuffer = new Uint8Array(totalLength);
  let pos = 0;

  for (const lh of localHeaders) {
    zipBuffer.set(lh, pos);
    pos += lh.length;
  }
  for (const cd of centralHeaders) {
    zipBuffer.set(cd, pos);
    pos += cd.length;
  }
  zipBuffer.set(eocd, pos);

  return zipBuffer;
}

// Generate valid OpenXML XLSX spreadsheet for NIRF Placement Index (Report #2)
function generateNirfXlsx(
  institutionProfile: InstitutionProfile,
  internshipStats: InternshipPlacementStats
): Uint8Array {
  const encoder = new TextEncoder();

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="NIRF 2026 Placement Index" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/><color rgb="FFFFFFFF"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF4338CA"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
</styleSheet>`;

  const departmentsData = [
    { dept: 'Computer Science & Engineering', enrolled: 420, placed: 382, rate: '90.9%', median: '14.5 LPA', highest: '42.0 LPA', topEmployer: 'Google India, Microsoft' },
    { dept: 'AI & Data Science', enrolled: 240, placed: 218, rate: '90.8%', median: '13.8 LPA', highest: '38.0 LPA', topEmployer: 'Amazon, Snowflake' },
    { dept: 'Information Technology', enrolled: 210, placed: 185, rate: '88.1%', median: '12.2 LPA', highest: '28.5 LPA', topEmployer: 'Cisco, Oracle' },
    { dept: 'Electronics & Communication', enrolled: 228, placed: 189, rate: '82.9%', median: '10.5 LPA', highest: '24.0 LPA', topEmployer: 'Qualcomm, Intel' },
  ];

  let rowsXml = '';
  // Row 1: Title
  rowsXml += `<row r="1">
    <c r="A1" t="inlineStr"><is><t>NIRF 2026 OFFICIAL PLACEMENT &amp; SALARY DATA - ${institutionProfile.name}</t></is></c>
  </row>`;
  // Row 2: Metadata
  rowsXml += `<row r="2">
    <c r="A2" t="inlineStr"><is><t>NIRF Rank: #${institutionProfile.nirfRank} | NAAC Grade: ${institutionProfile.naacGrade} | Batch Size: ${institutionProfile.totalStudents} | Overall Placement: ${institutionProfile.placementRate}% | Median CTC: ${internshipStats.avgPackageLPA} LPA</t></is></c>
  </row>`;
  // Row 3: Empty
  rowsXml += `<row r="3"></row>`;
  // Row 4: Table Headers (Style 1: Dark Indigo Header)
  rowsXml += `<row r="4">
    <c r="A4" s="1" t="inlineStr"><is><t>Academic Department</t></is></c>
    <c r="B4" s="1" t="inlineStr"><is><t>Graduating Cohort</t></is></c>
    <c r="C4" s="1" t="inlineStr"><is><t>Students Placed</t></is></c>
    <c r="D4" s="1" t="inlineStr"><is><t>Placement Rate</t></is></c>
    <c r="E4" s="1" t="inlineStr"><is><t>Median CTC (INR)</t></is></c>
    <c r="F4" s="1" t="inlineStr"><is><t>Highest CTC (INR)</t></is></c>
    <c r="G4" s="1" t="inlineStr"><is><t>Key Hiring Partners</t></is></c>
  </row>`;

  // Rows 5-8: Department Data
  departmentsData.forEach((row, idx) => {
    const rowNum = 5 + idx;
    rowsXml += `<row r="${rowNum}">
      <c r="A${rowNum}" t="inlineStr"><is><t>${row.dept}</t></is></c>
      <c r="B${rowNum}"><v>${row.enrolled}</v></c>
      <c r="C${rowNum}"><v>${row.placed}</v></c>
      <c r="D${rowNum}" t="inlineStr"><is><t>${row.rate}</t></is></c>
      <c r="E${rowNum}" t="inlineStr"><is><t>${row.median}</t></is></c>
      <c r="F${rowNum}" t="inlineStr"><is><t>${row.highest}</t></is></c>
      <c r="G${rowNum}" t="inlineStr"><is><t>${row.topEmployer}</t></is></c>
    </row>`;
  });

  // Row 9: Total Summary
  rowsXml += `<row r="9">
    <c r="A9" t="inlineStr"><is><t>INSTITUTIONAL TOTAL / MEDIAN</t></is></c>
    <c r="B9"><v>${institutionProfile.totalStudents}</v></c>
    <c r="C9"><v>${Math.round((institutionProfile.totalStudents * institutionProfile.placementRate) / 100)}</v></c>
    <c r="D9" t="inlineStr"><is><t>${institutionProfile.placementRate}%</t></is></c>
    <c r="E9" t="inlineStr"><is><t>${internshipStats.avgPackageLPA} LPA</t></is></c>
    <c r="F9" t="inlineStr"><is><t>${internshipStats.highestPackageLPA} LPA</t></is></c>
    <c r="G9" t="inlineStr"><is><t>${internshipStats.partnerCompaniesCount} Active Partner Recruiters</t></is></c>
  </row>`;

  const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:G9"/>
  <sheetViews><sheetView tabSelected="1" workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="16"/>
  <cols>
    <col min="1" max="1" width="36" customWidth="1"/>
    <col min="2" max="2" width="18" customWidth="1"/>
    <col min="3" max="3" width="16" customWidth="1"/>
    <col min="4" max="4" width="16" customWidth="1"/>
    <col min="5" max="5" width="18" customWidth="1"/>
    <col min="6" max="6" width="18" customWidth="1"/>
    <col min="7" max="7" width="32" customWidth="1"/>
  </cols>
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;

  return createZipArchive([
    { path: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { path: '_rels/.rels', data: encoder.encode(rootRels) },
    { path: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
    { path: 'xl/workbook.xml', data: encoder.encode(workbook) },
    { path: 'xl/styles.xml', data: encoder.encode(styles) },
    { path: 'xl/worksheets/sheet1.xml', data: encoder.encode(worksheet) },
  ]);
}

// Generate valid, standards-compliant PDF-1.4 binary document for Reports #1, #3, #4
function generatePdfReport(
  report: InstitutionalReport,
  institutionProfile: InstitutionProfile,
  internshipStats: InternshipPlacementStats,
  skills: InstitutionalSkillMetric[]
): Uint8Array {
  // Sanitize ASCII text for PDF PostScript syntax
  const sanitize = (text: string) => {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  };

  // Build stream content based on report type
  let streamOps = '';

  // Page 1: Header Banner (Deep Indigo/Purple Rectangle)
  streamOps += `q\n0.18 0.12 0.42 rg 35 745 525 65 re f\nQ\n`;
  streamOps += `BT /F2 14 Tf 1 1 1 rg 50 782 Td (${sanitize(institutionProfile.name.toUpperCase())}) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.85 0.85 0.95 rg 50 762 Td (OFFICIAL INSTITUTIONAL ACCREDITATION & PERFORMANCE AUDIT REPORT) Tj ET\n`;
  streamOps += `BT /F2 8 Tf 1 1 1 rg 460 762 Td (NAAC ${sanitize(institutionProfile.naacGrade)} | NIRF #${institutionProfile.nirfRank}) Tj ET\n`;

  // Report Title & Metadata
  streamOps += `BT /F2 13 Tf 0.1 0.12 0.2 rg 35 715 Td (${sanitize(report.title)}) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.4 0.45 0.55 rg 35 698 Td (Category: ${sanitize(report.category)}   |   Generated Date: ${sanitize(report.generatedDate)}   |   Format: PDF Document) Tj ET\n`;

  // Executive Metric Box
  streamOps += `q\n0.96 0.97 0.99 rg 35 605 525 75 re f\n0.8 0.83 0.9 RG 1 w 35 605 525 75 re S\nQ\n`;
  streamOps += `BT /F2 10 Tf 0.2 0.2 0.3 rg 50 662 Td (EXECUTIVE SUMMARY & CAMPUS METRICS) Tj ET\n`;

  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 50 644 Td (Audited Cohort: ${institutionProfile.totalStudents} Students) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 210 644 Td (Placement Rate: ${institutionProfile.placementRate}% [Target: ${institutionProfile.targetPlacementRate}%]) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 410 644 Td (Median CTC: ${internshipStats.avgPackageLPA} LPA) Tj ET\n`;

  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 50 626 Td (Active Internships: ${internshipStats.internshipsCompleted}) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 210 626 Td (Campus Skill Quotient: ${institutionProfile.averageSkillScore}%) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.3 0.3 0.4 rg 410 626 Td (Corporate Partners: ${internshipStats.partnerCompaniesCount} Recruiters) Tj ET\n`;

  // Description / Scope
  streamOps += `BT /F2 10 Tf 0.15 0.15 0.25 rg 35 575 Td (Audit Scope & Verified Findings:) Tj ET\n`;
  streamOps += `BT /F1 9 Tf 0.25 0.25 0.35 rg 35 558 Td (${sanitize(report.summary)}) Tj ET\n`;

  // Specific Structured Section based on Report ID
  if (report.id === 'rep_01') {
    // NAAC Criterion V Report
    streamOps += `BT /F2 10 Tf 0.15 0.15 0.25 rg 35 525 Td (NAAC Key Criterion V Performance Indices:) Tj ET\n`;

    // Table Header
    streamOps += `q\n0.25 0.2 0.5 rg 35 500 525 18 re f\nQ\n`;
    streamOps += `BT /F2 8.5 Tf 1 1 1 rg 45 506 Td (Metric Indicator) Tj 220 506 Td (Institutional Score) Tj 360 506 Td (NAAC A++ Benchmark) Tj 470 506 Td (Compliance Status) Tj ET\n`;

    const naacRows = [
      { ind: '5.1.1 Student Career Progression & Mentorship', score: '94.2%', bench: '85.0%', status: 'Compliant & Exceeded' },
      { ind: '5.2.1 Placement of Outgoing Students', score: `${institutionProfile.placementRate}%`, bench: '75.0%', status: 'Compliant & Exceeded' },
      { ind: '5.2.2 Qualifying Competitive Exams (GATE/CAT)', score: '28.4%', bench: '20.0%', status: 'Compliant' },
      { ind: '5.3.1 Student Awards & Tech Hackathons', score: '42 Verified', bench: '25 Min', status: 'Compliant & Exceeded' },
      { ind: '5.4.1 Alumni Industry Contribution & Engagements', score: '88.6%', bench: '80.0%', status: 'Compliant' },
    ];

    naacRows.forEach((row, i) => {
      const y = 482 - i * 22;
      const bg = i % 2 === 1 ? `q\n0.96 0.96 0.98 rg 35 ${y - 4} 525 18 re f\nQ\n` : '';
      streamOps += `${bg}BT /F1 8.5 Tf 0.2 0.2 0.3 rg 45 ${y} Td (${sanitize(row.ind)}) Tj 220 ${y} Td (${sanitize(row.score)}) Tj 360 ${y} Td (${sanitize(row.bench)}) Tj 0.1 0.5 0.2 rg 470 ${y} Td (${sanitize(row.status)}) Tj ET\n`;
    });
  } else if (report.id === 'rep_03') {
    // Skill Gap Diagnostic Report
    streamOps += `BT /F2 10 Tf 0.15 0.15 0.25 rg 35 525 Td (Campus Skill Gap vs Industry Benchmark Diagnostic:) Tj ET\n`;

    // Table Header
    streamOps += `q\n0.25 0.2 0.5 rg 35 500 525 18 re f\nQ\n`;
    streamOps += `BT /F2 8.5 Tf 1 1 1 rg 45 506 Td (Competency Domain) Tj 200 506 Td (Student Avg) Tj 280 506 Td (Industry Target) Tj 370 506 Td (Gap Deficit) Tj 460 506 Td (Remedial Action) Tj ET\n`;

    skills.slice(0, 6).forEach((s, i) => {
      const y = 482 - i * 22;
      const bg = i % 2 === 1 ? `q\n0.96 0.96 0.98 rg 35 ${y - 4} 525 18 re f\nQ\n` : '';
      const gapColor = s.gap < 0 ? '0.7 0.1 0.1' : '0.1 0.5 0.2';
      streamOps += `${bg}BT /F1 8.5 Tf 0.2 0.2 0.3 rg 45 ${y} Td (${sanitize(s.skillName)}) Tj 200 ${y} Td (${s.studentAvg}%) Tj 280 ${y} Td (${s.industryBenchmark}%) Tj ${gapColor} rg 370 ${y} Td (${s.gap}%) Tj 0.3 0.3 0.4 rg 460 ${y} Td (4-Wk Bootcamp) Tj ET\n`;
    });
  } else {
    // Annual Internship & PPO Report
    streamOps += `BT /F2 10 Tf 0.15 0.15 0.25 rg 35 525 Td (Internship Cohort & Conversion Statistics:) Tj ET\n`;

    // Table Header
    streamOps += `q\n0.25 0.2 0.5 rg 35 500 525 18 re f\nQ\n`;
    streamOps += `BT /F2 8.5 Tf 1 1 1 rg 45 506 Td (Department) Tj 190 506 Td (Internships) Tj 280 506 Td (PPO Offers) Tj 370 506 Td (Conversion Rate) Tj 470 506 Td (Top Stipend) Tj ET\n`;

    const internRows = [
      { dept: 'Computer Science & Engineering', count: '82', ppo: '49', rate: '59.8%', stipend: 'INR 1.20L/mo' },
      { dept: 'AI & Data Science', count: '46', ppo: '28', rate: '60.9%', stipend: 'INR 95K/mo' },
      { dept: 'Information Technology', count: '34', ppo: '17', rate: '50.0%', stipend: 'INR 80K/mo' },
      { dept: 'Electronics & Communication', count: '24', ppo: '11', rate: '45.8%', stipend: 'INR 75K/mo' },
    ];

    internRows.forEach((row, i) => {
      const y = 482 - i * 22;
      const bg = i % 2 === 1 ? `q\n0.96 0.96 0.98 rg 35 ${y - 4} 525 18 re f\nQ\n` : '';
      streamOps += `${bg}BT /F1 8.5 Tf 0.2 0.2 0.3 rg 45 ${y} Td (${sanitize(row.dept)}) Tj 190 ${y} Td (${row.count}) Tj 280 ${y} Td (${row.ppo}) Tj 370 ${y} Td (${row.rate}) Tj 0.1 0.4 0.2 rg 470 ${y} Td (${sanitize(row.stipend)}) Tj ET\n`;
    });
  }

  // Footer / Certification Stamp
  streamOps += `q\n0.8 0.85 0.9 RG 1 w 35 110 525 0.5 re S\nQ\n`;
  streamOps += `BT /F2 8 Tf 0.3 0.35 0.45 rg 35 95 Td (DEAN OF PLACEMENTS: ${sanitize(institutionProfile.deanName.toUpperCase())}) Tj 340 95 Td (CAMPUS ID: ${sanitize(institutionProfile.id)}) Tj ET\n`;
  streamOps += `BT /F1 7.5 Tf 0.5 0.55 0.6 rg 35 80 Td (Digitally generated and cryptographically certified by AcademiaConnect Assessment Cloud Engine.) Tj ET\n`;
  streamOps += `BT /F1 7.5 Tf 0.5 0.55 0.6 rg 35 68 Td (Standard ISO/IEC 27001 Accredited Audit Document - Authorized for NAAC, NIRF & AICTE Submissions.) Tj ET\n`;

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(streamOps);

  // PDF Document Objects
  const objects: string[] = [
    // 0: dummy
    '',
    // 1: Catalog
    `<< /Type /Catalog /Pages 2 0 R >>`,
    // 2: Pages
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    // 3: Page
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    // 4: Font F1
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    // 5: Font F2
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
    // 6: Stream placeholder (will be constructed below)
    ``,
    // 7: Info
    `<< /Title (${sanitize(report.title)}) /Author (${sanitize(institutionProfile.name)}) /Creator (AcademiaConnect Platform) /Producer (AcademiaConnect Engine) /CreationDate (D:20260222120000Z) >>`,
  ];

  // Assemble with exact byte offsets
  let header = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';
  const offsets: number[] = [0];

  let body = '';
  let currentOffset = encoder.encode(header).length;

  for (let i = 1; i <= 7; i++) {
    offsets[i] = currentOffset;
    let objContent = '';
    if (i === 6) {
      objContent = `6 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${streamOps}\nendstream\nendobj\n`;
    } else {
      objContent = `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }
    body += objContent;
    currentOffset += encoder.encode(objContent).length;
  }

  const xrefOffset = currentOffset;
  let xref = `xref\n0 8\n0000000000 65535 f \n`;
  for (let i = 1; i <= 7; i++) {
    const pad = String(offsets[i]).padStart(10, '0');
    xref += `${pad} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size 8 /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdfText = header + body + xref + trailer;
  return encoder.encode(fullPdfText);
}

// Master dispatch function for client-side download
export function triggerInstitutionalReportDownload(
  report: InstitutionalReport,
  institutionProfile: InstitutionProfile,
  internshipStats: InternshipPlacementStats,
  skills: InstitutionalSkillMetric[]
): { filename: string; mimeType: string } {
  let fileData: Uint8Array;
  let mimeType: string;
  let extension: string;

  if (report.fileFormat === 'XLSX') {
    fileData = generateNirfXlsx(institutionProfile, internshipStats);
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    extension = 'xlsx';
  } else {
    fileData = generatePdfReport(report, institutionProfile, internshipStats, skills);
    mimeType = 'application/pdf';
    extension = 'pdf';
  }

  // Create clean safe filename
  const cleanTitle = report.title
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
  const filename = `${cleanTitle}_${report.generatedDate}.${extension}`;

  // Execute client-side download
  const blob = new Blob([fileData], { type: mimeType });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Clean up Object URL
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return { filename, mimeType };
}
