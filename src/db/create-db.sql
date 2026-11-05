CREATE TABLE IF NOT EXISTS searches (
    id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    adresse TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pois (
    PRIMARY KEY (osm_type, osm_id)
    osm_type VARCHAR(4) NOT NULL,
    name TEXT,
    category VARCHAR(255) NOT NULL,
    category_label VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    source VARCHAR(255) NOT NULL,
    tags JSONB,
);

CREATE TABLE IF NOT EXISTS search_pois (
    PRIMARY KEY (search_id, osm_type, osm_id),
    search_id INT NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
    osm_type VARCHAR(4) NOT NULL,
    osm_id BIGINT NOT NULL,
    FOREIGN KEY (osm_type, osm_id) REFERENCES pois(osm_type, osm_id) ON DELETE CASCADE
);

INSERT INTO pois (osm_id, osm_type, name, category, category_label, latitude, longitude, source, tags)
VALUES (123456, 'node', 'Passage piéton', 'passage_pieton', 'Passage piéton', 45.7501, 4.8502, 'OpenStreetMap', '{"button_operated": "no", "crossing": "traffic_signals", "crossing:markings": "zebra", "highway": "crossing", "tactile_paving": "no", "traffic_signals:sound": "yes", "traffic_signals:vibration": "no"}');