import * as esriLoader from 'esri-loader'

export default class SharedEndpoint {
  // esri settings
  static get esri () {
    return {
      url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_HAULER_DATA2/MapServer/1',
      fields: ['*'],
      fKey: 'Folio'
    }
  }

  // return promise
  static queryByFolio (folio) {
    return esriLoader.loadModules([
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query'
    ]).then(([QueryTask, Query]) => {
      var queryTask = new QueryTask({
        url: this.prototype.constructor.esri.url
      })

      var query = new Query()
      query.where = (folio) ? `${this.prototype.constructor.esri.fKey}=${folio}` : '1=0'

      query.returnGeometry = false
      query.outFields = this.prototype.constructor.esri.fields

      return queryTask.execute(query).then(response => {
        if (response.features.length) {
          return response.features[0].attributes
        } else {
          throw new Error('There is currently no Trash or Recycling information associated with that address.')
        }
      })
    })
  }
}
