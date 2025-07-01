// /api/index.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  try {
    if (!process.env.SERVICE_ACCOUNT_KEY) {
      throw new Error('SERVICE_ACCOUNT_KEY environment variable not found');
    }

    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

    // 🧾 Your real Google Sheet ID (yes, we’re live)
    const SHEET_ID = '1XzqsHkpsE3SvD6taZqIeTJWHZA_dh34W-9IjYNo1gnY';

    const doc = new GoogleSpreadsheet(SHEET_ID);

    console.log('useServiceAccountAuth exists:', typeof doc.useServiceAccountAuth);
    if (typeof doc.useServiceAccountAuth !== 'function') {
      throw new Error(`useServiceAccountAuth is not a function. Type: ${typeof doc.useServiceAccountAuth}`);
    }

    await doc.useServiceAccountAuth(serviceAccountKey);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      'timestamp': new Date().toISOString(),
      'message': 'API test successful'
    });

    res.status(200).json({
      success: true,
      sheetTitle: doc.title,
      message: 'Row added successfully'
    });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
