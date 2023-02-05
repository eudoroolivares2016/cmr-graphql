import camelcaseKeys from 'camelcase-keys'

import Concept from './concept'

export default class Service extends Concept {
  /**
   * Instantiates a Service object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params, parentCollectionConceptId) {
    super('services', headers, requestInfo, params)
    console.log('grandparent in the constructor ', parentCollectionConceptId)
    this.parentCollectionConceptId = parentCollectionConceptId
    console.log('instance objs parent col ', this.parentCollectionConceptId)
  }

  /**
   * Set a value in the result set that a query has not requested but is necessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialJsonValues(id, item) {
    super.setEssentialJsonValues(id, item)
    // so if we add the collectionConcept-id here and in the other spot we ought to be able to pass along the grandparent col con id
    const { association_details: associationDetails } = item
    // console.log('all of the items in the service response', item)

    const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

    // Associations on services are used to retrieve order-options
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }
    // add the parent collection concept-id and pass it to the child queries from this service
    if (this.parentCollectionConceptId) {
      console.log('passing the parent collection to source', this.parentCollectionConceptId)
      this.setItemValue(id, 'parentCollectionConceptId', this.parentCollectionConceptId)
    }
    // TODO This should end up in teh source of the service
    // yes this does set the source so we ought to be able to pass things along here
    // this.setItemValue(id, 'longName', longName)
    // console.log('all of the items in the service concept obj constructor', item)
  }

  /**
     * Set a value in the result set that a query has not requested but is necessary for other functionality
     * @param {String} id Concept ID to set a value for within the result set
     * @param {Object} item The item returned from the CMR json endpoint
     */
  setEssentialUmmValues(id, item) {
    super.setEssentialUmmValues(id, item)

    const { meta } = item
    const { 'association-details': associationDetails } = meta

    const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

    //  Associations on services are used to retrieve order-options
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }

    if (this.parentCollectionConceptId) {
      console.log('umm_json passing the parent collection to source', this.parentCollectionConceptId)
      this.setItemValue(id, 'parentCollectionConceptId', this.parentCollectionConceptId)
    }
  }

  /**
 * Returns an array of keys representing supported search params for the json endpoint
 */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'type'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'type'
    ]
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   */
  parseJsonBody(jsonResponse) {
    const { data } = jsonResponse

    const { items } = data

    return items
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummServiceVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }
}
