# Create the test files that are missing
cat > api/test-auth-only.js << 'EOF'
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async function handler(req, res) {
  try {
    // Test just the authentication part
    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    const SHEET_ID = '1XzqsHkpsE3SvD6taZqIeTJWHZA_dh34W-9IjYNo1gnY';
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    await doc.useServiceAccountAuth(serviceAccountKey);
    
    res.json({
      success: true,
      message: "Authentication successful - not touching sheet yet"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
EOF

cat > api/test-load-info.js << 'EOF'
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async function handler(req, res) {
  try {
    // Test authentication + loadInfo
    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
    const SHEET_ID = '1XzqsHkpsE3SvD6taZqIeTJWHZA_dh34W-9IjYNo1gnY';
    const doc = new GoogleSpreadsheet(SHEET_ID);
    
    await doc.useServiceAccountAuth(serviceAccountKey);
    await doc.loadInfo();
    
    res.json({
      success: true,
      sheetTitle: doc.title,
      numSheets: doc.sheetsByIndex.length,
      message: "LoadInfo successful"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
}
EOF

