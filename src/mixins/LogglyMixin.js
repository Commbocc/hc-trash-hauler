export default {
  methods: {
    loggly (...objects) {
      var logUrl = 'http://logs-01.loggly.com/inputs/ff424bed-98df-4ab6-ac0e-49dc5d9ae378/tag/hc-trash-hauler/'
      var logObj = Object.assign({}, ...objects)
      if (process.env.NODE_ENV === 'production') {
        this.$http.post(logUrl, JSON.stringify(logObj), {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      } else {
        console.log('Loggly', logObj)
      }
    }
  }
}
