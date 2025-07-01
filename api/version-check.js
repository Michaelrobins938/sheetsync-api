// /api/version-check.js
export default function handler(req, res) {
  try {
    // Get all available methods/properties
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const testDoc = new GoogleSpreadsheet('test');
    
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(testDoc))
      .filter(name => typeof testDoc[name] === 'function');
    
    // Check what's in node_modules (alternative approach)
    const fs = require('fs');
    const path = require('path');
    
    let packageInfo = 'unable to read';
    try {
      const packagePath = require.resolve('google-spreadsheet');
      const moduleDir = path.dirname(packagePath);
      const packageJsonPath = path.join(moduleDir, '..', 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageInfo = pkg.version;
      }
    } catch (e) {
      packageInfo = `error: ${e.message}`;
    }
    
    res.json({
      installedVersion: packageInfo,
      availableMethods: methods,
      hasUseServiceAccountAuth: methods.includes('useServiceAccountAuth'),
      hasServiceAccountAuth: methods.includes('serviceAccountAuth'), // older versions
      hasAuth: methods.includes('auth') // check for other auth methods
    });
  } catch (error) {
    res.json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
