cat > api/index.js << 'EOF'
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get data from request body
    const { name, age } = req.body;
    
    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age are required' });
    }

    // Parse the service account key from environment variable
    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    
    // Initialize the sheet
    const SHEET_ID = '1XzqsHkpsE3SvD6taZqIeTJWHZA_dh34W-9IjYNo1gnY';
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    // Authenticate
    await doc.useServiceAccountAuth(serviceAccountKey);
    await doc.loadInfo();
    
    // Get the first sheet
    const sheet = doc.sheetsByIndex[0];
    
    // Add the row with dynamic data
    const row = await sheet.addRow({
      name: name,
      age: age
    });
    
    res.json({
      success: true,
      message: 'Data added to Google Sheet successfully!',
      rowData: row._rawData
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
EOF
