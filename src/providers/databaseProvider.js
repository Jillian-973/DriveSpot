// Fournisseur "cache" : lit la BDD si la recherche existe, sinon interroge OSM puis enregistre.
const DB_SOURCE = 'BDD';

export function createDatabaseProvider({ osmProvider, repository }) {
  let lastSource = osmProvider.source;

  return {
    // search.js lit `poiProvider.source` après fetchPois : la valeur est donc à jour.
    get source() {
      return lastSource;
    },

    async fetchPois({ center, bounds, signal }) {
      // Adresse connue : lecture BDD, aucun appel Overpass.
      const existingSearch = await repository.findSearch(center);
      if (existingSearch) {
        const pois = await repository.findPois(existingSearch.id);
        lastSource = DB_SOURCE;
        return pois;
      }

      // Adresse inconnue : Overpass, puis enregistrement (transaction dans saveSearch).
      const pois = await osmProvider.fetchPois({ center, bounds, signal });
      await repository.saveSearch(center, pois);
      lastSource = osmProvider.source;
      return pois;
    },
  };
}