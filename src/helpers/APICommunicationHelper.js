import BlockchainAPIError from '../errors/BlockchainAPIError'
import axios from 'axios'
import LoggingService from '../services/LoggingService'
import DeviceStore from '../stores/DeviceStore'
import AppConfig from '../AppConfig'

/**
 * This method will post data to a specified URL.
 *
 * @param {string} url to post to
 * @param {string} data must be JSON.stringify data ready to be sent
 * @param {number} timeoutMS default to 10000ms, set to desired timeout
 */
const post = async (url, data, timeoutMS = AppConfig.API_DEFAULT_TIMEOUT_MS) => {
  let retriesLeft = AppConfig.API_MAX_RETRIES
  return new Promise(async function(resolve, reject){
    const once = async () => {
      try {
        // don't make requests if the device is offline
        if (!DeviceStore.online()) {
          LoggingService.debug(`Device offline. Can't POST to ${url}`)
          resolve()
        }
        LoggingService.debug('APICommunicationHelper.post', {url:url,data:data})
        const response = await axios.post(url, data, { timeoutMS })
        LoggingService.debug(
          `${url} response: ${JSON.stringify(response.data, null, 2)}`
        )
        resolve(response.data)
      } catch (error) {
        const safeStatus = error && error.response ? error.response.status : null
        LoggingService.debug('APICommunicationHelper.post', {
          status: safeStatus,
          url: url,
          response: JSON.stringify(error.response)
        })
        if (safeStatus >= 500 && retriesLeft) {
          retriesLeft--
          setTimeout(once, AppConfig.API_RETRY_DELAY_MS)
        } else {
          reject( new BlockchainAPIError({err: error, status:safeStatus}))
        }
      }
    }
    once()
  })
}

/**
 * This method will perform a GET to a specified URL.
 *
 * @param {string} url to GET
 * @param {number} timeoutMS default to DEFAULT_TIMEOUT_MS, set to desired timeout
 */
const get = async (url, timeoutMS = AppConfig.API_DEFAULT_TIMEOUT_MS) => {
  let retriesLeft = AppConfig.API_MAX_RETRIES
  return new Promise(async function(resolve, reject){
    const once = async () => {
      try {
        // don't make requests if the device is offline
        if (!DeviceStore.online()) {
          LoggingService.debug(`Device offline. Can't GET ${url}`)
          resolve()
        }
        LoggingService.debug('APICommunicationHelper.get', {url:url})
        const response = await axios.get(url, { timeoutMS })

        LoggingService.debug({
          url : JSON.stringify(response, null, 2)
        })
        resolve(response.data)
      } catch (error) {
        const safeStatus = error && error.response ? error.response.status : null
        LoggingService.debug('APICommunicationHelper.get', {
          status: safeStatus,
          url: url,
          response: JSON.stringify(error.response)
        })
        if (safeStatus >= 500 && retriesLeft) {
          retriesLeft--
          setTimeout(once, AppConfig.API_RETRY_DELAY_MS)
        } else {
          reject( new BlockchainAPIError({err: error, status:safeStatus}))
        }
      }
    }
    once()
  })

}

export default {
  post,
  get
}
