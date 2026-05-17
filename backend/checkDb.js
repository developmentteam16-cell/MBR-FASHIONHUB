const prisma = require('./utils/prisma');

const getDatabaseInfo = () => {
  const value = process.env.DATABASE_URL;
  if (!value) return { host: 'missing', database: 'missing' };

  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      port: url.port || '3306',
      database: url.pathname.replace(/^\//, '') || 'missing',
    };
  } catch {
    return { host: 'invalid-url', database: 'invalid-url' };
  }
};

async function checkDatabase() {
  const info = getDatabaseInfo();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const [users, products, categories] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
    ]);

    console.log('Database connected successfully.');
    console.log(`Host: ${info.host}`);
    console.log(`Port: ${info.port}`);
    console.log(`Database: ${info.database}`);
    console.log(`Users: ${users}`);
    console.log(`Products: ${products}`);
    console.log(`Categories: ${categories}`);
  } catch (error) {
    console.error('Database connection failed.');
    console.error(`Host: ${info.host}`);
    console.error(`Port: ${info.port}`);
    console.error(`Database: ${info.database}`);
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
