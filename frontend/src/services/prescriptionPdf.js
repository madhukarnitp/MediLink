const hasItems = (items) => Array.isArray(items) && items.length > 0;

const toText = (value, fallback = "-") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

export const formatPrescriptionDate = (value, fallback = "-") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const imageUrlToDataUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generatePrescriptionPdf = async ({
  rx,
  docName,
  patName,
  statusText,
  verificationUrl,
  qrCodeUrl,
  logoUrl,
  userRole,
}) => {
  const [{ jsPDF }, QRCode] = await Promise.all([
    import("jspdf"),
    import("qrcode").then((module) => module.default),
  ]);
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const right = pageWidth - margin;
  const bottom = pageHeight - 12;
  const contentWidth = pageWidth - margin * 2;
  const infoCardWidth = (contentWidth - 6) / 2;
  const logoDataUrl = await imageUrlToDataUrl(logoUrl).catch(() => "");
  const pdfQrCodeUrl =
    qrCodeUrl ||
    (await QRCode.toDataURL(verificationUrl, {
      width: 180,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }));
  const issuedDate = formatPrescriptionDate(rx.createdAt);
  const expiresDate = formatPrescriptionDate(rx.expiresAt);
  const rxDisplayId = toText(rx.rxId || rx._id, "MediLink Rx");
  const doctorQualification = toText(rx.createdBy?.qualification, "");
  const doctorRegNo = toText(rx.createdBy?.regNo, "-");
  const patientAge = rx.createdFor?.age ? `Age: ${rx.createdFor.age}` : "";
  let y = margin;

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight <= bottom) return false;
    doc.addPage();
    y = margin;
    return true;
  };

  const drawSectionTitle = (title) => {
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(17, 77, 110);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(205, 225, 236);
    doc.line(margin, y + 1.8, right, y + 1.8);
    y += 5.5;
  };

  const drawInfoCard = (x, title, primary, lines) => {
    doc.setDrawColor(219, 232, 239);
    doc.setFillColor(250, 253, 255);
    doc.roundedRect(x, y, infoCardWidth, 24, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(91, 119, 132);
    doc.text(title.toUpperCase(), x + 4, y + 5.2);
    doc.setFontSize(10.5);
    doc.setTextColor(20, 40, 50);
    doc.text(toText(primary), x + 4, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.4);
    doc.setTextColor(78, 99, 111);
    const detailLines = lines.filter(Boolean).map((line) => toText(line));
    if (detailLines.length) {
      doc.text(detailLines.slice(0, 2), x + 4, y + 17);
    }
  };

  const drawTextBlock = (title, value) => {
    const lines = doc.splitTextToSize(toText(value), contentWidth - 8);
    const height = Math.max(13, 8.5 + lines.length * 3.6);
    ensureSpace(height + 2.5);
    doc.setDrawColor(219, 232, 239);
    doc.setFillColor(252, 254, 255);
    doc.roundedRect(margin, y, contentWidth, height, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.8);
    doc.setTextColor(17, 77, 110);
    doc.text(title, margin + 4, y + 5.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(38, 58, 68);
    doc.text(lines, margin + 4, y + 9.5);
    y += height + 2.5;
  };

  doc.setFillColor(245, 250, 252);
  doc.rect(0, 0, pageWidth, 47, "F");
  doc.setDrawColor(215, 230, 238);
  doc.roundedRect(margin, 8, contentWidth, 31, 2.5, 2.5, "S");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin + 4, 14, 10, 10);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(12, 63, 87);
  doc.text("MediLink", margin + 18, 17.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(84, 111, 123);
  doc.text("Digital prescription", margin + 18, 22.5);
  doc.text("Verified medical document", margin + 18, 27.2);

  const headerQrSize = 18;
  const headerQrX = right - headerQrSize - 4;
  const headerTextX = headerQrX - 62;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(22, 44, 55);
  doc.text("PRESCRIPTION", headerTextX, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(81, 101, 112);
  doc.text(`ID: ${rxDisplayId}`, headerTextX, 23, { maxWidth: 56 });
  doc.text(`Issued: ${issuedDate}`, headerTextX, 28);
  doc.text(`Expires: ${expiresDate}`, headerTextX, 33);

  doc.addImage(pdfQrCodeUrl, "PNG", headerQrX, 13, headerQrSize, headerQrSize);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(17, 77, 110);
  doc.text("Scan to verify", headerQrX + headerQrSize / 2, 34.8, {
    align: "center",
  });

  y = 52;
  drawSectionTitle("Patient and Doctor");
  drawInfoCard(margin, "Prescribed by", docName, [
    doctorQualification,
    `Reg. No: ${doctorRegNo}`,
  ]);
  drawInfoCard(margin + infoCardWidth + 6, "Patient", patName, [patientAge]);
  y += 28;

  ensureSpace(16);
  doc.setFillColor(236, 248, 252);
  doc.setDrawColor(197, 224, 235);
  doc.roundedRect(margin, y, contentWidth, 13, 2, 2, "FD");
  const validityItems = [
    ["Issued", issuedDate],
    ["Expires", expiresDate],
    ["Status", statusText],
  ];
  validityItems.forEach(([label, value], index) => {
    const x = margin + 7 + index * (contentWidth / 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.6);
    doc.setTextColor(84, 111, 123);
    doc.text(label.toUpperCase(), x, y + 4.6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.4);
    doc.setTextColor(20, 70, 92);
    doc.text(value, x, y + 10);
  });
  y += 17;

  drawSectionTitle("Clinical Details");
  drawTextBlock("Diagnosis", rx.diagnosis);
  if (hasItems(rx.symptoms)) {
    drawTextBlock("Symptoms", rx.symptoms.join(", "));
  }

  drawSectionTitle("Medicines");
  const columns = [
    { label: "Medicine", x: margin, width: 45 },
    { label: "Dosage", x: margin + 45, width: 28 },
    { label: "Frequency", x: margin + 73, width: 34 },
    { label: "Duration", x: margin + 107, width: 28 },
    { label: "Instructions", x: margin + 135, width: 55 },
  ];
  const drawTableHeader = () => {
    doc.setFillColor(16, 93, 126);
    doc.roundedRect(margin, y, contentWidth, 6.5, 1.2, 1.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    columns.forEach((column) => {
      doc.text(column.label, column.x + 1.6, y + 4.4);
    });
    y += 6.5;
  };

  drawTableHeader();
  const medicines = hasItems(rx.medicines)
    ? rx.medicines
    : [{ name: "No medicines listed" }];
  medicines.forEach((medicine) => {
    const cells = [
      medicine.name,
      medicine.dosage,
      medicine.frequency,
      medicine.duration,
      medicine.instructions,
    ];
    const cellLines = cells.map((cell, index) =>
      doc.splitTextToSize(toText(cell), columns[index].width - 3.2),
    );
    const rowHeight = Math.max(
      7.6,
      Math.max(...cellLines.map((lines) => lines.length)) * 3.3 + 3.8,
    );
    if (ensureSpace(rowHeight + 8)) {
      drawTableHeader();
    }
    doc.setDrawColor(223, 233, 238);
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, y, contentWidth, rowHeight, "FD");
    columns.slice(1).forEach((column) => {
      doc.line(column.x, y, column.x, y + rowHeight);
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(37, 55, 64);
    cellLines.forEach((lines, index) => {
      doc.text(lines, columns[index].x + 1.6, y + 4.8);
    });
    y += rowHeight;
  });
  y += 2.5;

  if (hasItems(rx.labTests)) {
    drawTextBlock("Recommended Lab Tests", rx.labTests.join(", "));
  }
  if (rx.advice) {
    drawTextBlock("Doctor instructions", rx.advice);
  }
  if (rx.followUpDate) {
    drawTextBlock("Follow-up", formatPrescriptionDate(rx.followUpDate));
  }
  if (rx.notes && userRole === "doctor") {
    drawTextBlock("Doctor Notes", rx.notes);
  }

  if (y + 16 <= bottom) {
    doc.setDrawColor(211, 226, 233);
    doc.line(margin, y, right, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(17, 77, 110);
    doc.text("Verification", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(73, 96, 108);
    const verificationLines = doc.splitTextToSize(
      `Scan the QR code or visit: ${verificationUrl}`,
      contentWidth,
    );
    doc.text(verificationLines.slice(0, 2), margin, y + 4.5);
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(226, 235, 240);
    doc.line(margin, pageHeight - 9.5, right, pageHeight - 9.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(94, 116, 126);
    doc.text(`MediLink verification: ${rxDisplayId}`, margin, pageHeight - 6);
    doc.text(`Page ${page} of ${pageCount}`, right, pageHeight - 6, {
      align: "right",
    });
  }

  const safeFileName = rxDisplayId.replace(/[^\w.-]+/g, "_");
  doc.save(`Prescription_${safeFileName}.pdf`);
};
