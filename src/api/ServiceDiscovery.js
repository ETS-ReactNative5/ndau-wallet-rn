import ServiceDiscoveryError from '../errors/ServiceDiscoveryError'
import AsyncStorageHelper from '../model/AsyncStorageHelper'
import APICommunicationHelper from '../helpers/APICommunicationHelper'
import LoggingService from '../services/LoggingService'

const AWS_S3_SERVICE_JSON_PROD =
  'https://s3.us-east-2.amazonaws.com/ndau-json/services-prod.json'
const AWS_S3_SERVICE_JSON_TEST =
  'https://s3.us-east-2.amazonaws.com/ndau-json/services-test.json'
const AWS_S3_SERVICE_JSON_DEV =
  'https://s3.us-east-2.amazonaws.com/ndau-json/services-dev.json'

const getServiceNodeURL = async () => {
  let url = AWS_S3_SERVICE_JSON_PROD
  if ((await AsyncStorageHelper.isTestNet()) || __DEV__) {
    url = AWS_S3_SERVICE_JSON_TEST
  }
  LoggingService.debug(`Service Discovery URL: ${url}`)

  try {
    const response = await APICommunicationHelper.get(url)
    const apinodes = response.apinodes

    // return a random service for use
    return apinodes[Math.floor(Math.random() * apinodes.length)]
  } catch (error) {
    LoggingService.debug(error)
    throw new ServiceDiscoveryError()
  }
}

export default {
  getServiceNodeURL
}
