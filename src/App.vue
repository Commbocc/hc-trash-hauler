<template>
  <div id="HcHaulerApp">

    <!-- <details><pre>{{ $store.state }}</pre></details> -->

    <address-form v-on:search="search"></address-form>

    <hauler-results></hauler-results>

    <alert v-for="(alert, index) in $store.state.alerts.active" :alert="alert" :key="index"></alert>

    <!-- <router-view></router-view> -->

  </div>
</template>

<script>
import HaulerMixin from '@/mixins/HaulerMixin'
import LogMixin from '@/mixins/LogMixin'

import HaulerResults from '@/components/results/Hauler'
import AddressForm from 'hc-address-parcel-form/src/components/AddressForm'
import Alert from 'hc-error-alerts/src/components/Alert'

export default {
  name: 'App',
  mixins: [
    HaulerMixin,
    LogMixin
  ],
  components: {
    Alert,
    HaulerResults,
    AddressForm
  },
  methods: {
    search () {
      this.clearAlerts()
      this.setFormIsSearching(true)
      this.setProvider(null)
      this.findAddressAndParcel().then(() => {
        return this.findHauler(this.folio)
      }).catch(err => {
        this.addAlert(err)
      }).then(() => {
        this.setFormIsSearching(false)
        this.log()
      })
    }
  }
}
</script>
