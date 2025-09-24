FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/api/src ./src
COPY apps/api/prisma ./prisma
COPY apps/api/tsconfig.json ./
COPY apps/api/nest-cli.json ./

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
