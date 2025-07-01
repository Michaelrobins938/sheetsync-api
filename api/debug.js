cat > api/debug.js << 'EOF'
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async function handler(req, res) {
  try {
    const hasEnvVar = !!process.env.SERVICE_ACCOUNT_KEY;
    const envVarLength = process.env.SERVICE_ACCOUNT_KEY?.length || 0;
    
    // Test if GoogleSpreadsheet constructor works
    let constructorWorks = false;
    let hasUseServiceAccountAuth = false;
    
    try {
      const testDoc = new GoogleSpreadsheet('test-id');
      constructorWorks = true;
      hasUseServiceAccountAuth = typeof testDoc.useServiceAccountAuth === 'function';
    } catch (e) {
      constructorWorks = false;
    }
    
    res.json({
      constructorWorks,
      hasUseServiceAccountAuth,
      hasServiceAccountKey: hasEnvVar,
      serviceAccountKeyLength: envVarLength,
      nodeVersion: process.version,
      serviceAccountKeyValid: hasEnvVar ? (() => {
        try {
          JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
          return true;
        } catch {
          return false;
        }
      })() : false
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
EOF
