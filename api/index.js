import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { sheet_id, range, mode, data } = req.body;

  if (!sheet_id || !range || !mode) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

    const doc = new GoogleSpreadsheet(sheet_id);
    await doc.useServiceAccountAuth({
      client_email: serviceAccountKey.client_email,
      private_key: serviceAccountKey.private_key,
    });

    await doc.loadInfo();

    const sheetTitle = range.split('!')[0];
    const sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) return res.status(404).json({ error: 'Sheet not found' });

    if (mode === 'read') {
      const rows = await sheet.getRows();
      return res.status(200).json(rows.map(r => r._rawData));
    } else if (mode === 'write') {
      if (!data) return res.status(400).json({ error: 'Data required for write' });
      await sheet.addRows(data);
      return res.status(200).json({ message: 'Data written successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid mode' });
    }
  } catch (err) {
    console.error("🔥 Server exploded:", err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
