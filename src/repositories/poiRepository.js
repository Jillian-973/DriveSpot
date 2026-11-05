import pool from '../db/connection.js';

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
