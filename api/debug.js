// /api/debug.js
export default function handler(req, res) {
  try {
    // Don't try to access package.json directly - use alternative methods
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    
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
      // Try to parse env var
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
    res.json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
