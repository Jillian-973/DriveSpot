import {pool} from '../db/connection.js';

export async function countPois() {
    const result = await pool.query('SELECT COUNT(*) FROM pois');
    return result;
}