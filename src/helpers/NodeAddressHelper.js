import AppConfig from '../AppConfig'
import ServiceDiscovery from '../api/ServiceDiscovery'

const PROTOCOL = 'https'

getNode = async () => {
  return await ServiceDiscovery.getServiceNodeURL()
}

getNodeAddress = async () => {
  const node = await getNode()
  return PROTOCOL + '://' + node
}

getAccountAPIAddress = async () => {
  return (await getNodeAddress()) + '/accounts'
}

getEaiPercentageAPIAddress = async () => {
  return (await getNodeAddress()) + '/eaipercentage'
}

getMarketPriceAPIAddress = async () => {
  return (await getNodeAddress()) + '/order/current'
}

getNodeStatusAPIAddress = async () => {
  return (await getNodeAddress()) + '/node/status'
}

export default {
  getAccountAPIAddress,
  getMarketPriceAPIAddress,
  getEaiPercentageAPIAddress,
  getNodeStatusAPIAddress
}
