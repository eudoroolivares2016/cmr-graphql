import axios from 'axios'
import { pickIgnoringCase } from './pickIgnoringCase'
/**
 * Make a request to CMR and return the promise.
 * @param {Object} params
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {Object} params.headers Headers to send to CMR.
 */
export const cmrAccessLists = ({
  headers
}
) => {
  // Default headers
  const defaultHeaders = {}
  // console.log(query)
  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Client-Id',
    'CMR-Request-Id',
    'Authorization'
  ])
  console.log('Running the Access Control List simulated function')
  const { 'Authorization': authorization } = permittedHeaders
  const requestConfiguration = {
    headers: headers,
    method: 'GET',
    url: `https://cmr.earthdata.nasa.gov/access-control/acls/`
  }
  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors
  return instance.request(requestConfiguration)
}

