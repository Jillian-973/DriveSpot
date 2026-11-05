import pool from '../db/connection.js'; 

async function main() {
  try {
    const result = await pool.query('SELECT * FROM pois');
    console.log('Connexion BDD réussie');
    console.log('Résultats :', result.rows);
  } catch (err) {
    console.error('Échec de la connexion BDD :', err.message);
  } finally {
    await pool.end();
  }
}
 
main();