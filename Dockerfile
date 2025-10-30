# Stage 1: Build
FROM node:20-alpine AS builder 

WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin sisa source code
COPY . .

# Build aplikasi
RUN npm run build

# Stage 2: Production
FROM node:20-slim 
WORKDIR /app

# Salin hanya artefak yang diperlukan dari stage builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Jalankan aplikasi
CMD ["node", "dist/main.js"]