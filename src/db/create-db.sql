CREATE TABLE IF NOT EXISTS searches (
    id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    adresse TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pois (
    osm_type VARCHAR(4) NOT NULL,
    osm_id BIGINT NOT NULL,
    name TEXT,
    category VARCHAR(255) NOT NULL,
    category_label VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    source VARCHAR(255) NOT NULL,
    tags JSONB,
    PRIMARY KEY (osm_type, osm_id)
);

CREATE TABLE IF NOT EXISTS search_pois (
    search_id INT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
    osm_type VARCHAR(4) NOT NULL,
    osm_id BIGINT NOT NULL,
    PRIMARY KEY (search_id, osm_type, osm_id),
    FOREIGN KEY (osm_type, osm_id) REFERENCES pois(osm_type, osm_id) ON DELETE CASCADE
);

INSERT INTO pois (osm_type, osm_id, name, category, category_label, latitude, longitude, source, tags)
VALUES (
    'node',
    123456,
    'Passage piéton',
    'passage_pieton',
    'Passage piéton',
    45.7501,
    4.8502,
    'OpenStreetMap',
    '{"button_operated": "no", "crossing": "traffic_signals", "crossing:markings": "zebra", "highway": "crossing", "tactile_paving": "no", "traffic_signals:sound": "yes", "traffic_signals:vibration": "no"}'::jsonb
)
ON CONFLICT (osm_type, osm_id) DO NOTHING;

INSERT INTO searches (latitude, longitude, adresse)
VALUES (45.7501, 4.8502, '79 Rue du Dauphiné, 69003 Lyon');

INSERT INTO search_pois (search_id, osm_type, osm_id)
VALUES (
    (SELECT id FROM searches WHERE latitude = 45.7501 AND longitude = 4.8502 ORDER BY id DESC LIMIT 1),
    'node',
    123456
)
ON CONFLICT (search_id, osm_type, osm_id) DO NOTHING;