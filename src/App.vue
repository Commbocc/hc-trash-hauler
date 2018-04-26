<template>
  <div id="app">
    <form ref="searchWidget" is="HcEsriSearchWidget" @submit="reset" @result="handleResult"></form>

    <div ref="errorAlerts" is="HcErrorAlerts"></div>

    <div v-if="provider || schedule" class="card mb-3">
      <strong class="card-header bg-secondary text-white">
        Results for:
        {{ searchResult.result.name }}
      </strong>

      <div v-if="provider" is="ProviderResult" :provider="provider" class="text-center"></div>

      <div v-if="schedule" is="ScheduleResult" :schedule="schedule"></div>
    </div>

    <details v-if="isDev" open><pre>{{ $data }}</pre></details>
  </div>
</template>

<script>
import HcErrorAlerts from 'hc-error-alerts'
import HcEsriSearchWidget, { Parcel } from 'hc-esri-search-widget'
import ProviderResult from '@/components/Provider'
import ScheduleResult from '@/components/Schedule'
import Provider from '@/models/Provider'
import Schedule from '@/models/Schedule'
import LogglyMixin from '@/mixins/LogglyMixin'

export default {
  name: 'App',
  components: {
    HcEsriSearchWidget,
    HcErrorAlerts,
    ProviderResult,
    ScheduleResult
  },
  mixins: [LogglyMixin],
  data () {
    return {
      searchResult: null,
      provider: null,
      schedule: null,
      errors: []
    }
  },
  methods: {
    reset () {
      this.$refs.searchWidget.isSearching = false
      this.searchResult = null
      this.provider = null
      this.parcel = null
      this.schedule = null
      this.errors = []
      this.$refs.errorAlerts.clearAlerts()
    },
    handleResult (result) {
      this.searchResult = result
      if (this.searchResult.error) {
        this.handleError(this.searchResult.error)
      } else if (this.searchResult.hasFeature()) {
        this.$refs.searchWidget.isSearching = true
        this.findProvider().then(this.findSchedule).then(() => {
          if (!this.provider && !this.schedule) {
            throw new Error('A Solid Waste Provider and Schedule could not be determined.')
          } else if (this.provider && !this.schedule) {
            throw new Error('We weren\'t able to find your trash and recycling schedule, but we know who your hauler is. Contact the provider listed below for your pickup schedule.')
          }
        }).catch(this.handleError).then(() => {
          this.$refs.searchWidget.status = null
          this.$refs.searchWidget.isSearching = false
          this.loggly(this.$data)
        })
      }
    },
    findProvider () {
      this.$refs.searchWidget.status = 'Finding Trash/Recycling Provider...'
      return Provider.findByLocation(this.searchResult.result.feature.geometry).then(provider => {
        this.provider = provider
      }).catch(this.handleError)
    },
    findSchedule () {
      this.$refs.searchWidget.status = 'Finding Parcel...'
      return this.$refs.searchWidget.queryFeatures(Parcel.esriSearchSource.featureLayer.url).then(feature => new Parcel(feature)).then(parcel => {
        this.$refs.searchWidget.status = 'Finding Trash/Recycling Schedule...'
        return Schedule.findByFolio(parcel.folio).then(schedule => {
          this.schedule = schedule
        })
      }).catch(this.handleError)
    },
    handleError (err) {
      console.warn(err)
      this.$refs.errorAlerts.addAlert(err)
      this.errors.push(err.message)
    }
  },
  computed: {
    isDev () {
      return process.env.NODE_ENV !== 'production'
    }
  }
}
</script>
