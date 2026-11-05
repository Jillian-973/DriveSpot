import * as repository from '../repositories/poiRepository.js';
const count = await repository.countPois();
console.log('POI enregistrés :', count);
