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