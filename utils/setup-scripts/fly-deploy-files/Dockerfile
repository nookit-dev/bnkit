FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./

COPY index.ts ./

COPY ./src ./src

EXPOSE 80

EXPOSE 3000

RUN bun install

CMD ["bun", "run", "serve"]