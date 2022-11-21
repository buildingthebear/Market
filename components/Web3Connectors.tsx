import { connectors, getConnectorName, Web3Connector } from '../connectors'
import { useCallback } from 'react'
import Image from 'next/image'

function Connector({ web3Connector }: { web3Connector: Web3Connector }) {
  const [connector, hooks] = web3Connector
  const isActive = hooks.useIsActive()
  const onClick = useCallback(() => {
    if (isActive) {
      connector.deactivate()
    } else {
      connectors.forEach(([connector]) => connector.deactivate())
      connector.activate()
    }
  }, [connector, isActive])
  const connectorName = getConnectorName(connector)
  const srcPath = "/img/" + connectorName + "Logo.png"
  const altText = connectorName + " Logo"

  return (
      <div className={"walletConnector"}>
        <button onClick={onClick}>
          <Image src={srcPath} alt={altText} width={"20px"} height={"20px"}/>
          <span className={"connectorLabel"}>{isActive ? ' Disconnect ': '  ' + connectorName + ' '}</span>
        </button>
      </div>
  )
}

export default function Connectors() {
  return (
      <div>
        {connectors.map((web3Connector, index) => (
            <Connector key={index} web3Connector={web3Connector} />
        ))}
      </div>
  )
}
