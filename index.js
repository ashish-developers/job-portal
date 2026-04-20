require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
const { seed: seedPermissions } = require('./src/seeders/permissions.seeder');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connected.');

    await sequelize.sync({ alter: false });
    console.log('[DB] Models synced.');

    await seedPermissions();

    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
};

start();
