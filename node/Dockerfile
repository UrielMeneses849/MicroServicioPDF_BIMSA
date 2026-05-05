FROM node:18-bullseye

WORKDIR /app

# Instalar Chromium (para Puppeteer)
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libnss3 \
  libatk-bridge2.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libcups2 \
  libxshmfence1 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/output

EXPOSE 3000

CMD ["node", "server.js"]