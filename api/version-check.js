cat > api/version-check.js << 'EOF'
module.exports = async function handler(req, res) {
  try {
    // Check what's actually installed without triggering constructor
    const fs = require('fs');
    const path = require('path');
    
    let packageInfo = 'unable to read';
    let actualMethods = [];
    
    try {
      // Get version from package.json
      const packagePath = require.resolve('google-spreadsheet');
      const moduleDir = path.dirname(packagePath);
      const packageJsonPath = path.join(moduleDir, '..', 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageInfo = pkg.version;
      }
      
      // Try to get methods safely
      const { GoogleSpreadsheet } = require('google-spreadsheet');
      
      // Check static methods and properties on the constructor
      const constructorProps = Object.getOwnPropertyNames(GoogleSpreadsheet);
      const prototypeProps = Object.getOwnPropertyNames(GoogleSpreadsheet.prototype || {});
      
      actualMethods = [...constructorProps, ...prototypeProps];
      
    } catch (e) {
      packageInfo = `error reading: ${e.message}`;
    }
    
    res.json({
      installedVersion: packageInfo,
      allProperties: actualMethods,
      hasUseServiceAccountAuth: actualMethods.includes('useServiceAccountAuth'),
      hasAuth: actualMethods.includes('auth'),
      nodeVersion: process.version,
      packageResolvePath: require.resolve('google-spreadsheet')
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
EOF
