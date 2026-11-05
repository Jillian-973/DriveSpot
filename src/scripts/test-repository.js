import * as repository from '../repositories/poiRepository.js';
const count = await repository.countPois();
// console.log('Nombre de POIs enregistrés :', count);

const center = {
    latitude: 45.7501,
    longitude: 4.8502
}
const findSearch = await repository.findSearch(center);
console.log('Recherche trouvée :', findSearch);

const pois = await repository.findPois(findSearch.id);
console.log('Nombre de POI récupérés :', pois.length);
console.log('Détail des POI :', pois);