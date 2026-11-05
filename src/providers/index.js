import { createOsmProvider } from './osmProvider.js';
import { createDatabaseProvider } from './databaseProvider.js';
import * as repository from '../repositories/poiRepository.js';

export function createPoiProvider(config, dependencies) {
  const osmProvider = createOsmProvider(config, dependencies);
  return createDatabaseProvider({ osmProvider, repository });
}