const algoliasearch = require('algoliasearch')
const CallEnum = require('@algolia/transporter').CallEnum

const bytesToGB = (bytesNumber) => Math.round(bytesNumber / 1000 / 1000 / 1000)

const getHosts = (clusterName, domain) => {
  // https://www.algolia.com/doc/api-client/getting-started/upgrade-guides/javascript/#the-hosts-parameter
  return [1, 2, 3].map(n => `${clusterName}-${n}.${domain}`).map(host => {
    return {
      protocol: 'https',
      url: host,
      accept: CallEnum.Read // CallEnum.Any or CallEnum.Write
    }
  })
}

const mcmFileSize = (appId, adminKey, domain = 'algolia.net') => {
  return algoliasearch(appId, adminKey).listClusters().then(({ clusters }) => {
    const clusterNames = clusters.map(cluster => cluster.clusterName)

    const indexLists = clusters.map(cluster => {
      const hosts = getHosts(cluster.clusterName, domain)
      const client = algoliasearch(appId, adminKey, { hosts })
      return client.listIndices()
    })

    return Promise.all(indexLists)
      .then(indices => {
        const report = {}
        let total = 0
        clusterNames.forEach((clusterName, i) => {
          const clusterFileSize = indices[i].items.reduce(
            (fileSize, index) => fileSize + bytesToGB(index.fileSize),
            0
          )
          total += clusterFileSize
          report[clusterName] = clusterFileSize
        })
        return JSON.stringify({ ...report, total })
      })
      .catch(err => {
        throw err
      })
  })
}

module.exports = mcmFileSize
