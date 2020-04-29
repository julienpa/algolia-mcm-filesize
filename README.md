# Algolia MCM File Size

![npm](https://img.shields.io/npm/dm/algolia-mcm-filesize)
![node-lts](https://img.shields.io/node/v-lts/algolia-mcm-filesize)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

**Important note:** in Algolia's context, **file size** and **index size**
are interchangeable.
The index size represents the space used in RAM, whereas data size is the raw
JSON data stored on disk and used as a backup for e.g. doing a full reindex.

## What is it?

This package is a simple script that helps you compute the index size
(per cluster and total for an app) when using Algolia's
[MCM](https://www.algolia.com/doc/guides/scaling/managing-multiple-clusters-mcm/)
architecture.

## How to use it?

Regular install through npm or yarn:

```bash
npm i algolia-mcm-filesize
# or
yarn add algolia-mcm-filesize
```

It has been designed for manual use in a shell or to pipe it to another
system, so it returns JSON instead of a pure JS object.
Here is a quick usage suggestion:

### index.js
```javascript
const mcmFileSize = require('algolia-mcm-filesize')

mcmFileSize('APPID', 'ADMIN_APIKEY').then(res => console.log(res))
```

Optionally, you can pass a custom domain (default is `algolia.net`)

```javascript
const mcmFileSize = require('algolia-mcm-filesize')

mcmFileSize('APPID', 'ADMIN_APIKEY', 'algolianet.com').then(res => console.log(res))
```

### shell

Using [jq](https://stedolan.github.io/jq/) for the sake of the example
```bach
node index.js | jq .
```

### output

Sample output (cluster names are usually prefixed with `d` or `v`)

```json
{
  "cluster-1": 91,
  "cluster-2": 83,
  "cluster-3": 95,
  "total": 269
}
```

Values are expressed in **gigabyte**
([GB, not GiB](https://en.wikipedia.org/wiki/Gigabyte))

Standard limit is 100 GB per cluster

## Technical details

The only dependency is the [JS API client](https://www.algolia.com/doc/api-client/getting-started/what-is-the-api-client/javascript/) (v4)

You need to use the [Admin API key](https://www.algolia.com/doc/guides/security/api-keys/#admin-api-key)
(required for all MCM endpoints)

Under the hood, the package uses the following endpoints:
- [List Clusters](https://www.algolia.com/doc/api-reference/api-methods/list-clusters/)
- [List Indices](https://www.algolia.com/doc/api-reference/api-methods/list-indices/)

## Disclaimer

This package is not officially supported by [Algolia](https://www.algolia.com/),
so it cannot be held responsible for any use in production. If you need support,
use GitHub issues or the [community forum](https://discourse.algolia.com/), but
**not** Algolia email support.
