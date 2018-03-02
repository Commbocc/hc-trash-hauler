<template lang="html">
  <div v-if="provider">
    <!-- <details><pre>{{ $store.state.hauler }}</pre></details> -->

    <table class="table table-striped table-">
      <thead>
        <tr class="bg-secondary text-white">
          <td colspan="2">
            Results for:
            <strong>{{ address }}</strong>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dateBlock in dateBlocks" :key="dateBlock.title">
          <td>
            <strong>{{ dateBlock.title }}</strong><br>
            Next Pickup(s)
          </td>
          <td>
            <strong>{{ dateBlock.days }}</strong>
            <ul class="list-unstyled">
              <li v-for="date in dateBlock.dates" class="my-1 p-1" :key="date.title" :class="(isHoliday(date, dateBlock.isRecycling)) ? 'bg-warning text-white' : 'bg-info text-white'">

                <span class="fa fa-fw fa-calendar" aria-hidden="true"></span>

                <strike v-if="isHoliday(date, dateBlock.isRecycling)">{{ date.format('dddd MMMM Do') }}</strike>
                <template v-else>{{ date.format('dddd MMMM Do') }}</template>

                <strong v-if="isHoliday(date, dateBlock.isRecycling)" class="badge badge-danger text-white">
                  No Pickup on Holiday
                </strong>

              </li>
            </ul>
          </td>
        </tr>

        <tr>
          <td>
            <strong>Provider</strong>
          </td>
          <td>
            <div is="Provider" :provider="provider"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Provider from '@/components/results/Provider'

export default {
  components: {
    Provider
  },
  computed: {
    ...mapState({
      provider: state => state.hauler.provider,
      address: state => state.address.parcel.address
    }),
    ...mapGetters([
      'isHoliday'
    ]),
    dateBlocks () {
      return [{
        title: 'Garbage Days',
        days: this.provider.garbageDays,
        dates: this.provider.garbageDates,
        isRecycling: false
      },
      {
        title: 'Recycle Days',
        days: this.provider.recycleDays,
        dates: this.provider.recycleDates,
        isRecycling: true
      },
      {
        title: 'Yard Waste Days',
        days: this.provider.yardDays,
        dates: this.provider.yardDates,
        isRecycling: false
      }]
    }
  }
}
</script>
