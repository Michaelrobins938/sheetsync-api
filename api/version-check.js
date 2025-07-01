cat > api/version-check.js << 'EOF'
module.exports = async function handler(req, res) {
  try {
    // Check what's actually installed without triggering any getters
    const fs = require('fs');
    const path = require('path');
    
    let packageInfo = 'unable to read';
    let methodsList = [];
    
    try {
      // Get version from package.json
      const packagePath = require.resolve('google-spreadsheet');
      const moduleDir = path.dirname(packagePath);
      const packageJsonPath = path.join(moduleDir, '..', 'package.json');
      
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageInfo = pkg.version;
      }
      
      // Safely check methods without triggering getters
      const { GoogleSpreadsheet } = require('google-spreadsheet');
      
      // Get method names safely using descriptors to avoid getters
      const prototype = GoogleSpreadsheet.prototype;
      const descriptors = Object.getOwnPropertyDescriptors(prototype);
      
      methodsList = Object.keys(descriptors).filter(key => {
        const descriptor = descriptors[key];
        return descriptor.value && typeof descriptor.value === 'function';
      });
      
    } catch (e) {
      packageInfo = `error reading: ${e.message}`;
    }
    
    res.json({
      installedVersion: packageInfo,
      availableMethods: methodsList,
      hasUseServiceAccountAuth: methodsList.includes('useServiceAccountAuth'),
      hasServiceAccountAuth: methodsList.includes('serviceAccountAuth'),
      hasAuth: methodsList.includes('auth'),
      nodeVersion: process.version,
      packagePath: require.resolve('google-spreadsheet')
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
EOF
