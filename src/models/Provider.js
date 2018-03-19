import _ from 'underscore'

export default class Provider {
  constructor (attributes) {
    return _.find(Provider.all(), p => _.contains(p.ids, attributes.Provider))
  }

  // // returns promise
  // static findProviderByFolio (folio) {}

  // this is bad practice, consider moving these features to their own endpoint
  static all () {
    return [{
      ids: ['REPUBLIC WASTE'],
      name: 'Republic Services',
      address: '5210 W Linebaugh Ave, Tampa, FL 33624',
      phone: '8132650292',
      fax: '8139613534',
      email: 'republicservicesCSR@repsrv.com',
      website: 'http://republicservices.com'
    },
    {
      ids: ['WASTE CONNECTIONS', 'PROGRESSIVE WASTE SOLUTIONS'],
      name: 'Waste Connections, Inc.',
      address: '5135 Madison Ave, Tampa, FL 33619',
      phone: '8132483802',
      fax: '8132483606',
      email: 'cs-tampa@progressivewaste.com',
      website: 'http://progressivewaste.com'
    },
    {
      ids: ['WASTE MANAGEMENT', 'WASTE MANAGEMENT OF TAMPA'],
      name: 'Waste Management of Tampa',
      address: '3411 N 40th St, Tampa, FL 33605',
      phone: '8136213053',
      fax: '8137408210',
      email: 'CentralFloridaService@wm.com',
      website: 'http://wm.com'
    }]
  }
}
