const config = {
  password: Deno.env.get("PW"),
  port: Deno.env.get("PORT") || 4231,
  database: Deno.env.get("DATABASE") || './local.db',
  hostname: Deno.env.get("HOSTNAME") || 'localhost'
}

export default config;