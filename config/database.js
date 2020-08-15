module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: env('DATABASE_CLIENT', 'mysql'),
        uri: env('DATABASE_URL', ''),
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'cyberday'),
        username: env('DATABASE_USERNAME', 'root'),
        password: env('DATABASE_PASSWORD', ''),
        schema: 'public',
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {
        "debug": true
      }
    },
  },
});
