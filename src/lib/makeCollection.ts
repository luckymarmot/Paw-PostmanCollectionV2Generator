import Postman from '../types-paw-api/postman'
import Paw from '../types-paw-api/paw'


const makeCollection = (items: Postman.Item[], context: Paw.Context): Postman.Collection => {
  const pmCollectionInfo: Postman.CollectionInfo = {
    name: (context.document.name || 'Paw Export'),
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  }
  const pmCollection: Postman.Collection = {
    info: pmCollectionInfo,
    item: items,
  }
  return pmCollection
}

export default makeCollection
