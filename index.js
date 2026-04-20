require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected.');

    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
};

start();
