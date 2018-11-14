import { loadModules } from 'esri-loader'
import _ from 'underscore'

export default class CityProvider {
  constructor (attributes) {
    return _.find(CityProvider.all(), p => _.contains(p.ids, attributes.NAME))
  }

  // esri settings
  static get esri () {
    return {
      url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/MaintStar/MapServiceBaseMap_20150801_Production_1/MapServer/80',
      fields: ['NAME']
    }
  }

  // returns promise
  static findByLocation (locationData) {
    return loadModules([
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query'
    ]).then(([QueryTask, Query]) => {
      var queryTask = new QueryTask({
        url: CityProvider.esri.url
      })

      var query = new Query()
      query.geometry = locationData

      query.returnGeometry = false
      query.outFields = CityProvider.esri.fields

      return queryTask.execute(query).then(response => {
        if (response.features.length) {
          return new CityProvider(response.features[0].attributes)
        } else {
          return null
        }
      })
    })
  }

  // this is bad practice, consider moving these features to their own endpoint
  static all () {
    return [{
      ids: ['CITY OF TAMPA'],
      name: 'City of Tampa',
      // address: '',
      phone: '8132748811',
      // fax: '',
      // email: '',
      website: 'https://www.tampagov.net/solid-waste/programs'
    },
    {
      ids: ['TEMPLE TERRACE'],
      name: 'City of Temple Terrace',
      // address: '',
      phone: '8135066570',
      // fax: '',
      email: 'pwcustservice@templeterrace.com',
      website: 'http://templeterrace.com/188/Sanitation/'
    },
    {
      ids: ['CITY OF PLANT CITY'],
      name: 'City of Plant City',
      address: '1802 Spooner Drive, Plant City, FL 33563',
      phone: '8137579208',
      fax: '8137579049',
      email: 'jsessions@plantcitygov.com',
      website: 'https://www.plantcitygov.com/64/Solid-Waste'
    }]
  }
}
