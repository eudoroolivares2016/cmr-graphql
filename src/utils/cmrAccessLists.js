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
  console.log('Running cmrAccessLists to get all permitted Acls')
  // This Authorization field is altered for local development
  permittedHeaders['Authorization'] = 'mock-echo-system-token'
  console.log('Header after changing it to mock echo for local dev', permittedHeaders)
  const { 'Authorization': authorization } = permittedHeaders
  const requestConfiguration = {
    headers: permittedHeaders,
    method: 'GET',
    url: `http://localhost:3011/acls?identity_type=catalog_item`
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

