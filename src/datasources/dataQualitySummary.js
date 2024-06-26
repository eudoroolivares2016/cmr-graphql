import { parseRequestedFields } from '../utils/parseRequestedFields'

import dataQualitySummaryKeyMap from '../utils/umm/dataQualitySummaryKeyMap.json'

import DataQualitySummary from '../cmr/concepts/dataQualitySummary'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, dataQualitySummaryKeyMap, 'dataQualitySummary')

  const dataQualitySummary = new DataQualitySummary(headers, requestInfo, params)

  // Query CMR
  dataQualitySummary.fetch(params)

  // Parse the response from CMR
  await dataQualitySummary.parse(requestInfo)

  // Return a formatted JSON response
  return dataQualitySummary.getFormattedResponse()
}
