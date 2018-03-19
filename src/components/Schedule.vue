<template lang="html">
  <table class="table table-striped table-bordered mb-0">
    <tbody>
      <tr v-for="key in scheduleKeys" :key="key">
        <th>
          {{ schedule[key].heading }}
          <p class="small mb-0">Next Pickup(s)</p>
        </th>
        <td>
          <strong>
            {{ schedule[key].weekdays }}
          </strong>
          <ul class="mb-0">
            <li v-for="(d, index) in schedule[key].nextDates" :key="index">
              <span v-if="d.isHoliday">
                <del>
                  {{ d.date.format('dddd MMMM Do') }}
                </del>
                <small class="ml-1 badge badge-pill badge-danger">
                  No pickup on holiday
                </small>
              </span>
              <template v-else>
                {{ d.date.format('dddd MMMM Do') }}
              </template>
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'schedule',
  props: ['schedule'],
  computed: {
    scheduleKeys () {
      return Object.keys(this.schedule)
    }
  }
}
</script>
