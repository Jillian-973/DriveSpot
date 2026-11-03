import pool from '../db/connection.js'; 
async function main() {
  try {
    await pool.query('SELECT 1');
    console.log('Connexion BDD réussie');
  } catch (err) {
    console.error('Échec de la connexion BDD :', err.message);
  } finally {
    await pool.end();
  }
}
 
main();