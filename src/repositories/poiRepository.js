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
  const result = await pool.query(
    `SELECT p.osm_type, p.osm_id, p.name, p.category, p.category_label,
            p.latitude, p.longitude, p.source, p.tags
     FROM pois p
     INNER JOIN search_pois sp ON p.osm_type = sp.osm_type AND p.osm_id = sp.osm_id
     WHERE sp.search_id = $1;`,
    [searchId],
  );
  return result.rows.map((row) => ({
    id: `${row.osm_type}/${row.osm_id}`,
    osmType: row.osm_type,
    osmId: Number(row.osm_id), // BIGINT renvoyé en chaîne par pg
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    latitude: row.latitude,
    longitude: row.longitude,
    source: row.source,
    tags: row.tags,
  }));
}

export async function savePois(pois, db = pool) {
  if (pois.length === 0) return 0;

  const result = await db.query(
    `INSERT INTO pois (osm_type, osm_id, name, category, category_label,
                       latitude, longitude, source, tags)
     SELECT * FROM UNNEST(
       $1::text[], $2::bigint[], $3::text[], $4::text[], $5::text[],
       $6::float8[], $7::float8[], $8::text[], $9::jsonb[]
     )
     ON CONFLICT (osm_type, osm_id) DO UPDATE SET
       name = EXCLUDED.name,
       category = EXCLUDED.category,
       category_label = EXCLUDED.category_label,
       latitude = EXCLUDED.latitude,
       longitude = EXCLUDED.longitude,
       tags = EXCLUDED.tags`,
    [
      pois.map((p) => p.osmType),
      pois.map((p) => p.osmId),
      pois.map((p) => p.name),
      pois.map((p) => p.category),
      pois.map((p) => p.categoryLabel),
      pois.map((p) => p.latitude),
      pois.map((p) => p.longitude),
      pois.map((p) => p.source),
      pois.map((p) => JSON.stringify(p.tags)),
    ],
  );
  return result.rowCount;
}

export async function saveSearch(center, pois) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: [search] } = await client.query(
      'INSERT INTO searches (latitude, longitude, adresse) VALUES ($1, $2, $3) RETURNING id',
      [center.latitude, center.longitude, center.label],
    );

    await savePois(pois, client);

    await client.query(
      `INSERT INTO search_pois (search_id, osm_type, osm_id)
       SELECT $1::int, * FROM UNNEST($2::text[], $3::bigint[])
       ON CONFLICT DO NOTHING`,
      [search.id, pois.map((p) => p.osmType), pois.map((p) => p.osmId)],
    );

    await client.query('COMMIT');
    return search.id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}