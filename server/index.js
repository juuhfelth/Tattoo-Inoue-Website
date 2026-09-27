import { createApp } from './app.js';
import { config } from './config.js';
import { openUsers } from './database.js';
const users = openUsers(config.databasePath);
const server = createApp(users).listen(config.port, 'localhost', () => {
  console.log(`Site: http://localhost:${config.port}`);
  console.log(`Banco: ${config.databasePath}`);
});
server.on('error', error => { console.error(error.message); users.close(); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => { users.close(); process.exit(0); }));
