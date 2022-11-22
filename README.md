
# Build the Bear Market

<img src="https://www.buildthebear.market/img/favicon.ico" alt="Logo" width="100"/>

Site contents for www.buildthebear.market

## Local Deployment

Clone the repository:

```bash
    $ gh repo clone Build-the-Bear/Market
```

Install dependencies:

```bash
    $ npm ci
```

Build and serve the app:

```bash
    $ npm build && npm start
```
## Environment Variables

Uniswap's SwapWidget takes a `JSON_RPC_URL`; you will need to supply your own.

Build the Bear uses Infura's RPC.

```
    // Defined in a file named 'constants.ts'
    export const JSON_RPC_URL = 'https://mainnet.infura.io/v3/YOUR_PROJECT_KEY'

    // On the pages where 'JSON_RPC_URL' is needed
    import {JSON_RPC_URL} from '../constants'
```


[![MIT License](https://img.shields.io/badge/License-GNU%20General%20Public%20License%20v3.0-orange)](https://choosealicense.com/licenses/gpl-3.0/)


## Contributing

*Contribution requirements coming soon*