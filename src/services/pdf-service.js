const PDFDocument = require('pdfkit');
const axios = require("axios");

exports.buildPDF = async (dataCallback, endCallback, assignment) => {
  const doc = new PDFDocument({ bufferPages: true, size: "A4", margin: 50 });

  if (dataCallback != undefined && endCallback != undefined) {
    doc.on('data', dataCallback);
    doc.on('end', endCallback);
  }

  const url = "https://www.organisatielotus.nl/wp-content/uploads/2018/10/LOTUS_Logo_10_2018-e1543227820406.jpg"

  async function fetchImage(src) {
    const image = await axios
      .get(src, {
          responseType: 'arraybuffer'
      })
    return image.data;
  }

  const logo = await fetchImage(url);

  generateHeader(doc, logo);
  generateAssignmentInfo(doc, assignment);
  generateBillingData(doc, assignment);
  generateTable(doc, assignment);
  doc.end();

  return doc;
}

function generateHeader(doc, logo) {
	doc
    .image(logo, 170, 45, { width: 50 })
		.fontSize(16)
    .font("Helvetica")
		.text("LOTUS-Kring Here We Go", 230, 65)
		.moveDown();
}

function generateAssignmentInfo(doc, assignment) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Opdrachtgegevens", 50, 160);

  generateHr(doc, 185);

  const assignmentDataInfo = 200;

  if (assignment.makeUpHouseNumber || assignment.makeUpHouseNumberAddition || assignment.makeUpPostalCode || assignment.makeUpTown) {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Speelplaats adres: ", 50, assignmentDataInfo)
      .font("Helvetica")
      .text(assignment.playgroundStreet + " " + assignment.playgroundHouseNumber + assignment.playgroundHouseNumberAddition + ", " + assignment.playgroundPostalCode + " " + assignment.playgroundTown.toUpperCase(), 200, assignmentDataInfo )
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Grimeer adres: ", 50, assignmentDataInfo + 15)
      .font("Helvetica")
      .text(assignment.makeUpStreet + " " + assignment.makeUpHouseNumber + assignment.makeUpHouseNumberAddition + ", " + assignment.makeUpPostalCode + " " + assignment.makeUpTown.toUpperCase(), 200, assignmentDataInfo + 15)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Begindatum/tijd: ", 50, assignmentDataInfo + 30)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.dateTime)), 200, assignmentDataInfo + 30)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Einddatum/tijd: ", 50, assignmentDataInfo + 45)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.endTime)), 200, assignmentDataInfo + 45)
      doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Opdrachtgever: ", 50, assignmentDataInfo + 60)
      .font("Helvetica")
      .text(assignment.firstName + " " + assignment.lastName, 200, assignmentDataInfo + 60)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Telefoonnummer: ", 50, assignmentDataInfo + 75)
      .font("Helvetica")
      .text(assignment.phoneNumber, 200, assignmentDataInfo + 75)
      .moveDown()
  } else {
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Speelplaats adres: ", 50, assignmentDataInfo)
      .font("Helvetica")
      .text(assignment.playgroundStreet + " " + assignment.playgroundHouseNumber + assignment.playgroundHouseNumberAddition + ", " + assignment.playgroundPostalCode + " " + assignment.playgroundTown.toUpperCase(), 200, assignmentDataInfo)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Datum/tijd: ", 50, assignmentDataInfo + 15)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.dateTime)), 200, assignmentDataInfo + 15)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Einddatum/tijd: ", 50, assignmentDataInfo + 30)
      .font("Helvetica")
      .text(formatDate(new Date(assignment.endTime)), 200, assignmentDataInfo + 30)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Opdrachtgever: ", 50, assignmentDataInfo + 45)
      .font("Helvetica")
      .text(assignment.firstName + " " + assignment.lastName, 200, assignmentDataInfo + 45)
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Telefoonnummer: ", 50, assignmentDataInfo + 60)
      .font("Helvetica")
      .text(assignment.phoneNumber, 200, assignmentDataInfo + 60)
      .moveDown()
  }
}

function generateBillingData(doc, assignment) {
  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Factuurgegevens", 50, 320);

  generateHr(doc, 345);

  const extraBillingInfo = 360;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("E-mailadres: ", 50, extraBillingInfo)
    .font("Helvetica")
    .text(assignment.billingEmailAddress, 200, extraBillingInfo)
}

function generateTable(doc, assignment) {
  let i;

  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Inschrijvingen", 50, 405);

  generateHr(doc, 430);

  const table = 445;
  let tableAfterFor;
    
  doc.font("Helvetica-Bold");

  generateTableRow(
      doc,
      table,
      "Volledige naam",
      "Aantal gereden kilometers"
  );  

  generateTableHr(doc, table + 20);

  for (i = 0; i < assignment.participatingLotusVictims.length; i++) {
    const participant = assignment.participatingLotusVictims[i];
    const position = table + (i + 1) * 30;
    tableAfterFor = position;
    doc.font("Helvetica");
    generateTableRow(
      doc,
      position,
      participant.firstName + " " + participant.lastName,
      "_______________________"
    );
    generateTableHr(doc, position + 20);
  }

  generateExtraData(doc, assignment, tableAfterFor)
}

function generateExtraData(doc, assignment, tableAfterFor) {
  let tableAfter = tableAfterFor;

  if((tableAfter + 50) > 650) {
    doc.addPage();
    tableAfter = 0;
  }

  doc
    .fillColor("#444444")
    .fontSize(14)
    .text("Overige", 50, tableAfter + 50);

  generateHr(doc, tableAfter + 75);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Opmerkingen: ", 50, tableAfter + 90)
    .font("Helvetica")
    .text("__________________________________________________________________________________________________________________________________________________________________________________________", 200, tableAfter + 90)
    .moveDown();

  generateFooter(doc, assignment, tableAfter)
}

function generateFooter(doc, assignment, tableAfterFor) {
  let tableAfter = tableAfterFor;

  if((tableAfter + 160) > 650) {
    doc.addPage();
    tableAfter = 0;
  }

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Handtekening opdrachtgever/instructeur:", 50, tableAfter + 160)
    .font("Helvetica")
    .text("___________________________________", 50, tableAfter + 195)
    .font("Helvetica-Oblique")
    .text(assignment.firstName + " " + assignment.lastName, 50, tableAfter + 215)
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function generateTableHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(.2)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function generateTableRow(doc, y, participant, countKM) {
  doc
    .fontSize(10)
    .text(participant, 50, y)
    .text(countKM, 400, y)
}

function formatDate(inputDate) {
  let date, month, year, hour, minute;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();
  hour = inputDate.getHours();
  minute = inputDate.getMinutes();

  date = date.toString().padStart(2, "0");

  month = month.toString().padStart(2, "0");

  if(minute < 10) {
    minute = "0" + minute;
  }

  return `${date}/${month}/${year} ${hour}:${minute}`;
}