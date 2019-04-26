import BlockchainAPIError from '../errors/BlockchainAPIError'
import axios from 'axios'
import LoggingService from '../services/LoggingService'
import DeviceStore from '../stores/DeviceStore'

/**
 * This method will post data to a specified URL.
 *
 * @param {string} url to post to
 * @param {string} data must be JSON.stringify data ready to be sent
 * @param {number} timeout default to 10000ms, set to desired timeout
 */
const post = async (url, data, timeout = 10000) => {
  try {
    // don't make requests if the device is offline
    if (!DeviceStore.online()) {
      LoggingService.debug(`Device offline. Can't POST to ${url}`)
      return
    }
    LoggingService.debug('APICommunicationHelper.post',{url:url,data:data})
    const response = await axios.post(url, data, { timeout })
    LoggingService.debug(
      `${url} response: ${JSON.stringify(response.data, null, 2)}`
    )
    return response.data
  } catch (error) {
    const safeStatus = error && error.response ? error.response.status : null
    LoggingService.error('APICommunicationHelper.post', {
      status: safeStatus,
      url: url,
      response: JSON.stringify(error.response)
    })
    throw new BlockchainAPIError({msg:_getError(error), status:safeStatus})
  }

}

/**
 * This method will perform a GET to a specified URL.
 *
 * @param {string} url to GET
 * @param {number} timeout default to 10000ms, set to desired timeout
 */
const get = async (url, timeout = 10000) => {
  try {
    // don't make requests if the device is offline
    if (!DeviceStore.online()) {
      LoggingService.debug(`Device offline. Can't GET. ${url}`)
      return
    }
    LoggingService.debug('APICommunicationHelper.get', {url:url})
    const response = await axios.get(url, { timeout })

    LoggingService.debug({
      url : JSON.stringify(response, null, 2)
    })
    return response.data
  } catch (error) {
    LoggingService.error('APICommunicationHelper.get', {
      status: error.response.status,
      url: url,
      response: JSON.stringify(error.response)
    })
    throw new BlockchainAPIError({msg:_getError(error), status:error.response.status})
  }
}

// _getError tries to parse an axiosErr for BlockchainAPIError.
// It will first try to return an error, which is parseable by BlockChainAPIError
const _getError = axiosErr => {

  if (axiosErr && axiosErr.response && axiosErr.response.data) {
    const data = axiosErr.response.data
    if (data.err_code && data.err_code != -1) {
      return data.err_code // return a code, BlockchainAPIError's constructor will use it to look up a message
    } else {
      return data.err || data.msg || data
    }
  }
  return axiosErr
}

export default {
  post,
  get
}
