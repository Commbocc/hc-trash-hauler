import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'findAddressAndParcel',
      'findHauler'
    ]),
    ...mapMutations([
      'clearAlerts',
      'addAlert',
      'setFormIsSearching',
      'setProvider'
    ])
  },
  computed: mapState({
    folio: state => state.address.parcel.folio
  })
}
