const db = require('./db');
(async () => {
  try {
    const t = await db.query("select table_name from information_schema.tables where table_schema='public' order by table_name;");
    console.log('tables', t.rows);
    const u = await db.query("select column_name,data_type,udt_name,character_maximum_length from information_schema.columns where table_name='users';");
    console.log('users cols', u.rows);
    const i = await db.query("select column_name,data_type,udt_name from information_schema.columns where table_name='items';");
    console.log('items cols', i.rows);
    const fk = await db.query("select conname, conrelid::regclass as table_from, confrelid::regclass as table_to, pg_get_constraintdef(oid) as def from pg_constraint where conname='items_seller_id_fkey';");
    console.log('fk', fk.rows);
  } catch (e) {
    console.error('error', e.message);
  } finally {
    process.exit(0);
  }
})();
