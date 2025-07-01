cat > api/version-check.js << 'EOF'
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async function handler(req, res) {
  try {
    // Get all available methods/properties
    const testDoc = new GoogleSpreadsheet('test');
    
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(testDoc))
      .filter(name => typeof testDoc[name] === 'function');
    
    // Check what's in node_modules
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
      hasServiceAccountAuth: methods.includes('serviceAccountAuth'),
      hasAuth: methods.includes('auth'),
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
EOF
