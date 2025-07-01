import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  try {
    const pkg = require('google-spreadsheet/package.json');
    const dummyDoc = new GoogleSpreadsheet("DUMMY_ID");

    res.status(200).json({
      googleSpreadsheetVersion: pkg.version,
      useServiceAccountAuthExists: typeof dummyDoc.useServiceAccountAuth === 'function',
      hasServiceAccountKey: !!process.env.SERVICE_ACCOUNT_KEY,
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
