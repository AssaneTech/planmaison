//Database MongoDB 
module.exports = ({ env }) => ({
  connection: {
    client: 'mongo',
    connection: {
      host: env('DATABASE_HOST', '  localhost'),
      port: env.int('DATABASE_PORT', 27017),
      database: env('DATABASE_NAME', 'planmaison'),
      username: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', 'password'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
}); 