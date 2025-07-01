cat > api/debug.js << 'EOF'
module.exports = async function handler(req, res) {
  try {
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    
    const hasEnvVar = !!process.env.SERVICE_ACCOUNT_KEY;
    const envVarLength = process.env.SERVICE_ACCOUNT_KEY?.length || 0;
    
    // Check methods without creating instance
    const prototype = GoogleSpreadsheet.prototype;
    const hasUseServiceAccountAuth = typeof prototype.useServiceAccountAuth === 'function';
    
    res.json({
      constructorWorks: typeof GoogleSpreadsheet === 'function',
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
