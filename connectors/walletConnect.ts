import { initializeConnector } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { toWeb3Connector } from './utils'

export function isWalletConnect(connector: Connector) {
  return connector instanceof WalletConnect
}

const connector = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect(
      actions,
      {
        rpc: { 1: "https://cloudflare-eth.com/" },
      },
      false
    )
)
export default toWeb3Connector(connector)
