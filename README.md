# Sinema Sitesi

Bu proje basit bir sinema ön yüzü ve Node.js/Express arka ucu içerir.

Özellikler
- Statik dosyalar `public/` klasöründen servis edilir.
- `data/info.json` film verilerini içerir (JSON dizisi).
- `/message` endpoint'i sunucu mesajı döner (JSON).
- `/proxy?url=` hedef URL'i proxy'ler; content-type kontrolü ile JSON veya metin iletir.
- `/health` sağlık kontrolü sağlar.

Başlatma (Windows PowerShell)

1. Bağımlılıkları yükleyin:

```powershell
cd 'C:\Users\polat\Desktop\Sinema Sitesi'
npm install
```

2. Sunucuyu başlatın (varsayılan 8080):

```powershell
$env:PORT=8080; npm start
```

veya geliştirme modunda (nodemon yüklüyse):

```powershell
npm run dev
```

Test uç noktaları
- http://localhost:8080/ -> `index.html`
- http://localhost:8080/message -> JSON mesaj
- http://localhost:8080/data/info.json -> film verileri
- http://localhost:8080/health -> sağlık bilgisi

Notlar
- `package.json` içinde `express` v5 kullanılıyor; kararlılık için `4.x` tercih edilebilir.
- Production için `cors()` ayarlarını sadece gerekli origin ile sınırlandırın.
- Render deploy: sizin sunduğunuz https://sinema-sitesi.onrender.com/ adresi zaten çalışıyordu; buradaki değişiklikler yerel geliştirmeyi kolaylaştırmak içindir.
