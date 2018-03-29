import * as esriLoader from 'esri-loader'
import _ from 'underscore'

export default class Provider {
  constructor (attributes) {
    return _.find(Provider.all(), p => _.contains(p.ids, parseInt(attributes.TAG)))
  }

  // esri settings
  static get esri () {
    return {
      url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_FACILITIES/MapServer/1',
      fields: ['TAG']
    }
  }

  // returns promise
  static findByLocation (locationData) {
    if (locationData) {
      return esriLoader.loadModules([
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query'
      ]).then(([QueryTask, Query]) => {
        var queryTask = new QueryTask({
          url: Provider.esri.url
        })

        var query = new Query()
        query.geometry = locationData

        query.returnGeometry = false
        query.outFields = Provider.esri.fields

        return queryTask.execute(query).then(response => {
          if (response.features.length) {
            return new Provider(response.features[0].attributes)
          } else {
            throw new Error('A Solid Waste District could not be determined.')
          }
        })
      })
    } else {
      return Promise.resolve(null)
    }
  }

  // this is bad practice, consider moving these features to their own endpoint
  static all () {
    return [{
      ids: [1, 3],
      name: 'Republic Services',
      address: '5210 W Linebaugh Ave, Tampa, FL 33624',
      phone: '8132650292',
      fax: '8139613534',
      email: 'republicservicesCSR@repsrv.com',
      website: 'http://republicservices.com'
    },
    {
      ids: [2, 5],
      name: 'Waste Connections, Inc.',
      address: '5135 Madison Ave, Tampa, FL 33619',
      phone: '8132483802',
      fax: '8132483606',
      email: 'cs-tampa@progressivewaste.com',
      website: 'http://progressivewaste.com'
    },
    {
      ids: [4],
      name: 'Waste Management of Tampa',
      address: '3411 N 40th St, Tampa, FL 33605',
      phone: '8136213053',
      fax: '8137408210',
      email: 'CentralFloridaService@wm.com',
      website: 'http://wm.com'
    }]
  }
}
