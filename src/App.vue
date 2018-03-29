<template>
  <div id="app">
    <form ref="addressForm" is="HcAddressParcelForm" @submit="formSearch"></form>

    <div ref="errorAlerts" is="HcErrorAlerts"></div>

    <div v-if="provider || schedule" class="card mb-3">
      <strong class="card-header bg-secondary text-white">
        Results for:
        {{ formResult.inputAddress }}
      </strong>

      <div v-if="provider" is="ProviderResult" :provider="provider" class="text-center"></div>

      <div v-if="schedule" is="ScheduleResult" :schedule="schedule"></div>
    </div>

    <!-- <details open><pre>{{ $data }}</pre></details> -->
  </div>
</template>

<script>
import HcErrorAlerts from 'hc-error-alerts'
import HcAddressParcelForm from 'hc-address-parcel-form'
import ProviderResult from '@/components/Provider'
import ScheduleResult from '@/components/Schedule'

import Provider from '@/models/Provider'
import Schedule from '@/models/Schedule'

import LogMixin from '@/mixins/LogMixin'

export default {
  name: 'App',
  components: {
    HcAddressParcelForm,
    HcErrorAlerts,
    ProviderResult,
    ScheduleResult
  },
  mixins: [LogMixin],
  data () {
    return {
      formResult: {},
      provider: null,
      schedule: null,
      errors: []
    }
  },
  methods: {
    formSearch (promise) {
      this.$refs.addressForm.isSearching = true
      this.formResult = null
      this.provider = null
      this.schedule = null
      this.errors = []
      this.$refs.errorAlerts.clearAlerts()

      promise.then(result => {
        this.formResult = result
        this.errors = this.formResult.errors
      }).then(() => {
        return Provider.findByLocation(this.formResult.locationData).then(provider => {
          this.provider = provider
        })
      }).then(() => {
        var folio = (this.formResult.parcelData) ? this.formResult.parcelData.folio : null
        return Schedule.findByFolio(folio).then(schedule => {
          this.schedule = schedule
        })
      }).catch(err => {
        this.errors.push(err)
      }).then(() => {
        this.errors.forEach(err => {
          this.$refs.errorAlerts.addAlert(err)
        })
        this.$refs.addressForm.isSearching = false
        this.log(this.$data)
      })
    }
  }
}
</script>
