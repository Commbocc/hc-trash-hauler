import Vue from 'vue'
import Vuex from 'vuex'

import address from 'hc-address-parcel-form/src/store/modules/address'
import alerts from 'hc-error-alerts/src/store/modules/alerts'
import hauler from './modules/hauler'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    address,
    alerts,
    hauler
  }
})
