import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // CORS desteği ekledik

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname yerine, ES Module için uygun bir çözüm:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS middleware'ini kullanıyoruz
app.use(cors());

// Public klasörünü statik olarak sun
app.use(express.static(path.join(__dirname, "../public")));

// Proxy endpoint
app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "url parametresi gerekli" });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "İstek başarısız", detay: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
