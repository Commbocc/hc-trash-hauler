export default {
  methods: {
    log () {
      if (process.env.NODE_ENV === 'production') {
        var logUrl = 'http://logs-01.loggly.com/inputs/ff424bed-98df-4ab6-ac0e-49dc5d9ae378/tag/hc-trash-hauler/'
        this.$http.post(logUrl, JSON.stringify(this.$store.state), {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      }
    }
  }
}
