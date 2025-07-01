import { GoogleSpreadsheet } from 'google-spreadsheet';

export default function handler(req, res) {
  try {
    const hasEnvVar = !!process.env.SERVICE_ACCOUNT_KEY;
    const envVarLength = process.env.SERVICE_ACCOUNT_KEY?.length || 0;

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
    res.json({ error: error.message, stack: error.stack });
  }
}
