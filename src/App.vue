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

import HaulerResults from '@/components/results/Hauler'
import AddressForm from 'hc-address-parcel-form/src/components/AddressForm'
import Alert from 'hc-error-alerts/src/components/Alert'

export default {
  name: 'App',
  mixins: [
    HaulerMixin
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
    },
    log () {
      var logUrl = 'http://logs-01.loggly.com/inputs/ff424bed-98df-4ab6-ac0e-49dc5d9ae378/tag/hc-trash-hauler/'
      this.$http.post(logUrl, JSON.stringify(this.$store.state), {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    }
  }
}
</script>
