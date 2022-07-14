import axios from 'axios'
import { pickIgnoringCase } from './pickIgnoringCase'
/**
 * Make a request to CMR and return the promise.
 * @param {Object} params
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {Object} params.headers Headers to send to CMR.
 */
export const getAcl = ({
  headers,
  aclUrl
}
) => {
  // Default headers
   const defaultHeaders = {}
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
  console.log('This is the ACL-Url being passed into the getAcl function', aclUrl)
  permittedHeaders['Authorization'] = 'mock-echo-system-token'
  const { 'Authorization': authorization } = permittedHeaders
  const requestConfiguration = {
    headers: permittedHeaders,
    method: 'GET',
    url: aclUrl
  }
  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors
  //returns function call response
  return instance.request(requestConfiguration)
}
