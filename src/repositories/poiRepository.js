import {pool} from '../db/connection.js';

export async function countPois() {
    const result = await pool.query("SELECT COUNT(*) FROM pois");
    return Number(result.rows[0].count);
}

export async function findSearch(center) {
  const result = await pool.query("SELECT id, latitude, longitude, adresse FROM searches WHERE latitude = $1 AND longitude = $2 LIMIT 1;", [center.latitude, center.longitude]);
  return result.rows[0];
}

export async function findPois(searchId) {
  const result = await pool.query("SELECT p.osm_type, p.osm_id, p.name, p.category, p.category_label, p.latitude, p.longitude, p.source, p.tags FROM pois p INNER JOIN search_pois sp ON p.osm_type = sp.osm_type AND p.osm_id = sp.osm_id WHERE sp.search_id = $1;", [searchId]);
  return result.rows;
}