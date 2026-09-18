const app = require('./app');
const env = require('./config/env');
const database = require('./config/database');

database.connect();

app.listen(env.port, () => {
  console.log(`Server chạy tại port ${env.port}`);
});
