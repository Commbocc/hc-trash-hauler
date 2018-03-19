<template lang="html">
  <div class="card-body">

    <h4 class="card-title mb-0">{{ provider.name }}</h4>

    <p v-text="provider.address"></p>

    <ul class="list-unstyled mb-0">
      <li>
        <span class="fa fa-fw fa-phone" aria-hidden="true"></span> <span class="sr-only">Phone:</span>
        <a :href="`tel:${provider.phone}`">
          {{ formatPhone(provider.phone) }}
        </a>
      </li>
      <li>
        <span class="fa fa-fw fa-fax" aria-hidden="true"></span> <span class="sr-only">Fax:</span>
        <a :href="`fax:${provider.fax}`">
          {{ formatPhone(provider.fax) }}
        </a>
      </li>
      <li>
        <span class="fa fa-fw fa-envelope" aria-hidden="true"></span> <span class="sr-only">Email:</span>
        <a :href="'mailto:'+provider.email" v-text="provider.email"></a><br>
      </li>
      <li>
        <span class="fa fa-fw fa-globe" aria-hidden="true"></span> <span class="sr-only">Web:</span>
        <a :href="provider.website" target="_blank">Website</a>
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
