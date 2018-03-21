<template>
  <div id="app">
    <form ref="addressForm" is="HcAddressParcelForm" @submit="formSearch"></form>

    <div ref="errorAlerts" is="HcErrorAlerts"></div>

    <div v-if="provider || schedule" class="card mb-3">
      <h6 class="card-header bg-secondary text-white">
        Results for:
        <strong>{{ formResult.parcelData.address }}</strong>
      </h6>

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

import SharedHaulerEndpoint from '@/models/SharedHaulerEndpoint'
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
      this.$refs.errorAlerts.clearAlerts()

      promise.then(result => {
        this.formResult = result
        this.formResult.errors.forEach(err => { throw err })
        return SharedHaulerEndpoint.queryByFolio(result.parcelData.folio).then(attributes => {
          this.provider = new Provider(attributes)
          this.schedule = new Schedule(attributes)
        })
      }).catch(err => {
        this.$refs.errorAlerts.addAlert(err)
      }).then(() => {
        this.errors = this.$refs.errorAlerts.errorLog
        this.$refs.addressForm.isSearching = false
        this.log(this.$data)
      })
    }
  }
}
</script>
