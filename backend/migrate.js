const fs = require('fs').promises;
const path = require('path');
const db = require('./db');

async function runMigrations(){
  // Ensure migrations table exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      run_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  let files = [];
  try{
    files = await fs.readdir(migrationsDir);
  }catch(err){
    console.warn('No migrations directory found:', err.message);
    return;
  }

  files = files.filter(f => f.endsWith('.sql')).sort();

  for(const file of files){
    const res = await db.query('SELECT 1 FROM migrations WHERE name=$1', [file]);
    if(res.rowCount > 0){
      console.log(`Skipping already-applied migration: ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    try{
      // run migration SQL; if it contains multiple statements, we execute as a single query
      await db.query(sql);
      await db.query('INSERT INTO migrations(name) VALUES($1)', [file]);
      console.log(`Applied migration: ${file}`);
    }catch(err){
      console.error(`Failed migration ${file}:`, err.message);
      throw err;
    }
  }
}

module.exports = runMigrations;
