FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src src
COPY public public
ENV DB_PATH=/data/solocheck.db PORT=8080
VOLUME /data
EXPOSE 8080
CMD ["node", "--no-warnings", "src/main.js"]
