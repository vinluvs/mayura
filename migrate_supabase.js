const { Client } = require('pg');

async function migrate() {
  let connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('Error: POSTGRES_URL_NON_POOLING or POSTGRES_URL environment variable is required.');
    process.exit(1);
  }

  // Remove sslmode parameter so our custom ssl config is respected
  connectionString = connectionString.replace(/\?sslmode=.*/, '');

  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected successfully. Executing schema migrations...');

    // Add gender column to products table if it doesn't exist
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS gender text;
    `);
    console.log('Successfully ensured gender column exists on products table.');

    // Add gender column to looks table if it doesn't exist
    await client.query(`
      ALTER TABLE looks ADD COLUMN IF NOT EXISTS gender text;
    `);
    console.log('Successfully ensured gender column exists on looks table.');

    // Let's also update the schema cache for PostgREST by notifying pgrst
    // Supabase PostgREST automatically reloads schema when NOTIFY pgrst is sent
    try {
      await client.query(`NOTIFY pgrst, 'reload schema'`);
      console.log('Sent reload schema notification to PostgREST cache.');
    } catch (notifyErr) {
      console.warn('Note: Could not send NOTIFY pgrst, PostgREST schema cache will refresh automatically or upon access.');
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
