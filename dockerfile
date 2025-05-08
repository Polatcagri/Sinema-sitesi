# 1. Aşama: Temel Node.js imajını belirtiyoruz.
FROM node:18-alpine

# 2. Aşama: Konteyner içinde bir çalışma dizini oluşturuyoruz.
WORKDIR /app

# 3. Aşama: `Nodejs_server` klasöründeki `package.json` ve `package-lock.json` dosyalarını çalışma dizinine kopyalıyoruz.
COPY Nodejs_server/package*.json ./

# 4. Aşama: PATH'i açıkça belirtin ve bağımlılıkları yükleyin.
ENV PATH="/usr/local/bin:${PATH}"
RUN npm install --omit=dev

# 5. Aşama: Projenin geri kalanını çalışma dizinine kopyalıyoruz.
COPY . .

# 6. Aşama: Uygulamamızın kullanacağı portu belirtiyoruz.
EXPOSE 3000

# 7. Aşama: Konteyner başlatıldığında `Nodejs_server` klasöründe `npm start` komutunu çalıştırıyoruz.
WORKDIR /app/Nodejs_server
CMD ["npm", "start"]