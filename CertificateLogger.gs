/**
 * Google Apps Script — Certificate Download Logger
 *
 * Logs every certificate download to a Google Sheet for proof of download.
 *
 * HOW TO DEPLOY:
 * 1. Create a Google Sheet, copy its URL from the address bar.
 * 2. Go to https://script.google.com → New project, paste this file in.
 * 3. Paste the sheet URL into SHEET_URL below.
 * 4. Deploy → New deployment → Web app
 *    "Execute as" = "me" , "Who has access" = "Anyone"
 * 5. Copy the Web App URL → paste into app.js as SHEET_SCRIPT_URL.
 * 6. Done — every download logs a row to your sheet.
 */

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/15IjK-omGDNDVQuIqvcDtPveOpWXPjOYgBiauO8VWy1k/edit?usp=sharing';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getActiveSheet();

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Student Name', 'Certificate Name', 'Year', 'Verification ID']);
    }

    sheet.appendRow([
      new Date().toISOString(),
      data.name,
      data.certificateName,
      data.year,
      data.id
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Certificate Logger is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
