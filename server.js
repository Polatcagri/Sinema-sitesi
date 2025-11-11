import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

// Basit request logger (her isteği konsola yaz)
app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.originalUrl} from ${req.ip}`);
    next();
});

// Public klasör doğru dizinde servis edilsin
app.use(express.static(path.join(__dirname, "public")));

// Sağlık kontrolü
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Sunucu mesajı için ayrı bir endpoint (kök rota statik dosyayı servis edecek)
app.get('/message', (req, res) => {
    res.json({ message: 'Bu mesaj Node.js server tarafından gönderilmiştir' });
});

// data/info.json dosyasını statik klasörün dışında tutmak isterseniz bu route ile servis edebilirsiniz
app.get('/data/info.json', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'info.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Dosya gönderilemedi:', err);
            res.status(500).json({ error: 'Dosya okunamadı' });
        }
    });
});

// Taurus Cinema API'sinden veri çeken proxy endpoint (CORS sorunu çözmek için)
app.get('/api/films', async (req, res) => {
    try {
        const response = await fetch('https://www.tauruscinemarine.com/control/json/info.json');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Taurus Cinema API hatası:', error);
        res.status(500).json({ error: 'API veri çekilemedi', details: error.message });
    }
});

app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: "url parametresi gerekli" });
    }

    try {
        const response = await fetch(targetUrl);

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            const data = await response.json();
            return res.json(data);
        }

        // JSON değilse metin olarak ilet
        const text = await response.text();
        res.type('text').send(text);
    } catch (err) {
        res.status(500).json({ error: "İstek başarısız", detay: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
