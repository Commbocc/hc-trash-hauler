<template lang="html">
  <div>
    <strong>{{ provider.details.name }}</strong>
    <p v-text="provider.details.address"></p>
    <ul class="list-unstyled mb-0">
      <li>
        <span class="fa fa-fw fa-phone" aria-hidden="true"></span> <span class="sr-only">Phone:</span>
        <a :href="`tel:${provider.details.phone}`">
          {{ formatPhone(provider.details.phone) }}
        </a>
      </li>
      <li>
        <span class="fa fa-fw fa-fax" aria-hidden="true"></span> <span class="sr-only">Fax:</span>
        <a :href="`fax:${provider.details.fax}`">
          {{ formatPhone(provider.details.fax) }}
        </a>
      </li>
      <li>
        <span class="fa fa-fw fa-envelope" aria-hidden="true"></span> <span class="sr-only">Email:</span>
        <a :href="'mailto:'+provider.details.email" v-text="provider.details.email"></a><br>
      </li>
      <li>
        <span class="fa fa-fw fa-globe" aria-hidden="true"></span> <span class="sr-only">Web:</span>
        <a :href="provider.details.website" target="_blank">Website</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'provider',
  props: ['provider'],
  methods: {
    formatPhone (n) {
      return `(${n.substring(0, 3)}) ${n.substring(3, 6)}-${n.substring(6, 10)}`
    }
  }
}
</script>
