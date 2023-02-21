FROM node:16-slim as builder

WORKDIR /builder

COPY ./ ./

RUN npm i

RUN npx prisma generate
RUN npm run build:frontend
RUN npm run build:server

FROM node:16-slim as target

RUN apt update && \
        apt install nginx -y

WORKDIR /app

COPY --from=builder /builder/dist /app
COPY --from=builder /builder/package* /app
COPY --from=builder /builder/server/prisma /app/prisma
COPY ./nginx.conf /etc/nginx/nginx.conf

ENV LOG_ENABLED=true
ENV LOG_LEVEL=debug
ENV LOGGER_NAME=fridgy

RUN npm ci --omit dev
RUN npx prisma generate --schema=/app/prisma/schema.prisma
RUN nginx
# RUN npx dotenv -e ./.env -- node server

CMD ["npx", "dotenv", "-e /app/.env","--","node", "/app/server/index.js"]