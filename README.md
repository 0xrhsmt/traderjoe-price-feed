# Trader Joe Price Feed API

## Overview

This repository is for implementing the Price Feed API to participate in the [Price Feed API Bounty](https://docs.google.com/document/d/10t4IbY06jZ1WUZxO4qbVpklPC69Rnh_gdifLgFZ1lis/). <br>
Below, you will find details about the API specifications and implementation methods.

## API Interface

### Request and Response

<table>
<tr>
<td> URL path </td> <td> Request </td>  <td> Response </td>
</tr>
<tr>
<td> GET /v1/prices/:base/:quote </td>

<td>

```
URL path params:
{
    "base": Address,
    "quote": Address
}
```

</td>

<td>

```json
{
    "pair_address": Address,
    "base_address": Address,
    "quote_address": Address,
    "price": Number
}
```

</td>
</tr>
<tr>
<td> POST /v1/batch-prices </td>

<td>

```
body:
[
    Address,
]
```

</td>

<td>

```json
[
    {
        "pair_address": Address,
        "base_address": Address,
        "quote_address": Address,
        "price": Number
    },
]
```

</td>

</tr>

<tr>
<td> GET /v2/prices/:base/:quote/:binstep </td>

<td>

```
URL path params:
{
    "base": Address,
    "quote": Address,
    "binstep": Number,
}
```

</td>

<td>

```json
{
    "pair_address": Address,
    "base_address": Address,
    "quote_address": Address,
    "binstep": Number,
    "price": Number
}
```

</td>
</tr>
<tr>
<td> POST /v2/batch-prices </td>

<td>

```
body:
[
    Address,
]
```

</td>

<td>

```json
[
    {
        "pair_address": Address,
        "base_address": Address,
        "quote_address": Address,
        "binstep": Number,
        "price": Number
    },
]
```

</td>

</tr>

<tr>
<td> GET /v2_1/prices/:base/:quote/:binstep </td>

<td>

```
URL path params:
{
    "base": Address,
    "quote": Address,
    "binstep": Number,
}
```

</td>

<td>

```json
{
    "pair_address": Address,
    "base_address": Address,
    "quote_address": Address,
    "binstep": Number,
    "price": Number
}
```

</td>
</tr>
<tr>
<td> POST /v2_1/batch-prices </td>

<td>

```
body:
[
    Address,
]
```

</td>

<td>

```json
[
    {
        "pair_address": Address,
        "base_address": Address,
        "quote_address": Address,
        "binstep": Number,
        "price": Number
    },
]
```

</td>

</tr>

</table>

### Client Errors

<table>
<tr>
<td> Name </td> <td> HTTP Status Code </td> <td> Client Error Code </td> <td> Response </td>  <td> Description </td>
</tr>
<tr>
<td> RequestInputValidationError </td>
<td> 400 </td>
<td> 100 </td>

<td>

```json
{
    "code": 100,
    "reason": "Bad Request",
    "validationErrors": {
        "formErrors": [],
        "fieldErrors": {
            "params": [
                {
                    "path": [String],
                    "reason": String,
                    "code": String (ValidationErrorCode)
                }
            ]
        }
    }
}
```

</td>

<td>

Returned this error in case of validation errors on URL path parameters or request body.

</td>
</tr>

<tr>
<td> NotFoundError </td>
<td> 404 </td>
<td> 101 </td>

<td>

```json
{
  "code": 101,
  "reason": "Not Found"
}
```

</td>
<td>
</td>
</tr>

<tr>
<td> RequestTimeoutError </td>
<td> 408 </td>
<td> 102 </td>

<td>

```json
{
  "code": 102,
  "reason": "Request Timeout"
}
```

</td>
<td>
Returned this error in case of a timeout.<br />
Default timeout is 5 seconds.

</td>
</tr>

<tr>
<td> TooManyRequestsError </td>
<td> 429 </td>
<td> 103 </td>

<td>

```json
{
  "code": 103,
  "reason": "Too many requests, please try again later"
}
```

</td>
<td>
Returned this error when rate limit is exceeded.
</td>
</tr>

<tr>
<td> PairNoLiquidityError </td>
<td> 400 </td>
<td> 104 </td>

<td>

```json
{
  "code": 104,
  "reason": "Pair no liquidity"
}
```

</td>
<td>
Returned this error when there is no liquidity for a Liquidity Book Pair.
</td>
</tr>

<tr>
<td> TokenInfoFetchError </td>
<td> 400 </td>
<td> 105 </td>

<td>

```json
{
  "code": 105,
  "reason": "Failed to fetch token information..."
}
```

</td>
<td>
Returned this error when the requested token does not exist.
</td>
</tr>

<tr>
<td> PairInfoFetchError </td>
<td> 400 </td>
<td> 106 </td>

<td>

```json
{
  "code": 106,
  "reason": "Failed to fetch pair information..."
}
```

</td>
<td>
Returned this error when the requested Liquidity Book Pair Contract does not exist.
</td>
</tr>

</table>

## Design

### Philosophy

- Minimize network requests
  - [Calculate Pair addresses on the local side](https://github.com/0xrhsmt/traderjoe-price-feed/blob/1c221a9cfd3642996e35efc960057cdf5d1a1acc/src/entities/v1/Pair.ts#L6-L25)
  - Use [batch JSON-RPC requests](https://github.com/0xrhsmt/traderjoe-price-feed/blob/1c221a9cfd3642996e35efc960057cdf5d1a1acc/src/config/chainClient.ts#L14-L15)
  - [Maximizing Cache Utilization](https://github.com/search?q=repo%3A0xrhsmt%2Ftraderjoe-price-feed%20withCache&type=code)
- Avoid reinventing the wheel
  - Refer extensively to Trader JOE SDKs

### Cache

- Price information is cached until a new block is generated. [Cache expiration varies per chain](https://github.com/0xrhsmt/traderjoe-price-feed/blob/1c221a9cfd3642996e35efc960057cdf5d1a1acc/src/config/cache.ts#L6-L22).
- Immutable information in Token and Pair details is cached. Cache has no expiration.

### Other Features

- Request rate limiting
- Timeout limiting
- Beauty logging using pino-logger

## Development and Production Environments

### Prerequisites

- [nodejs v18.x.x](https://nodejs.org/en)
- [pnpm v8.x.x](https://pnpm.io/)
- [foundry](https://book.getfoundry.sh/getting-started/installation)

### Development Environment

#### Local Launch

```bash
$cp .env.development.example .env.development.local
# And Replace $JSON_RPC_URL value with your own Avalanche node URL

$pnpm run start:dev
```

#### Testing

```bash
$cp .env.test.example .env.test.local
# And Replace $ANVIL_FORK_URL value with your own Avalanche "archive" node URL

$pnpm run test:anvil
$pnpm run test
$pnpm run test:watch
```

### Production

#### Build & Launch

```bash
$pnpm run build
$node dist/src/index.js | pnpm exec pino-pretty
```

## References

- [Trader Joe Docs](https://docs.traderjoexyz.com/)
- [Trader Joe SDKs](https://github.com/traderjoe-xyz/joe-sdks)
