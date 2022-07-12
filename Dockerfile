FROM denoland/deno:1.23.1
WORKDIR /app
COPY . .
run deno cache main.ts
CMD ["deno", "task", "start"]