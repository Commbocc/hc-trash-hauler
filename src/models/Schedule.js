import * as esriLoader from 'esri-loader'
import moment from 'moment'
import _ from 'underscore'

export default class Schedule {
  constructor (attributes) {
    var garbageDayInts = this.rawDbValToDayInts(attributes.Garbage)
    var recycleDayInts = this.rawDbValToDayInts(attributes.Recycling)
    var yardDayDowInts = this.rawDbValToDayInts(attributes.YardWaste)

    return {
      garbage: {
        heading: 'Garbage Days',
        weekdays: this.pluralWeekdaysFromInts(garbageDayInts),
        nextDates: this.nextPickupDates(garbageDayInts)
      },
      recycle: {
        heading: 'Recycling Days',
        weekdays: this.pluralWeekdaysFromInts(recycleDayInts),
        nextDates: this.nextPickupDates(recycleDayInts, true)
      },
      yard: {
        heading: 'Yard Waste Days',
        weekdays: this.pluralWeekdaysFromInts(yardDayDowInts),
        nextDates: this.nextPickupDates(yardDayDowInts)
      }
    }
  }

  // converts raw database string to array of day of week integers
  rawDbValToDayInts (string) {
    return _.chain(moment()._locale._weekdaysShort).map((dow, index) => {
      var strContainsDay = (string.toLowerCase().indexOf(dow.toLowerCase()) >= 0)
      return (strContainsDay) ? index : false
    }).compact().value()
  }

  // returns string of plural weekdays ('Mondays & Tuesdays') from day of week integers
  pluralWeekdaysFromInts (intsArr) {
    return intsArr.sort().map(i => {
      return moment()._locale._weekdays[i] + 's'
    }).join(' & ')
  }

  // returns array of next pickup dates from day of week integers, accounts for holidays
  nextPickupDates (intsArr, isRecycling = false) {
    var arr = []
    var date = null
    var isHoliday = false
    _.each(intsArr, (int, index) => {
      date = Schedule.nextDayOfWeek(int)
      isHoliday = Schedule.isHoliday(date, isRecycling)
      arr.push({ date, isHoliday })

      while (isHoliday) {
        int = (index + 1 === intsArr.length) ? intsArr[0] : intsArr[index + 1] // jump to next day in intsArr
        date = Schedule.nextDayOfWeek(int, date)
        isHoliday = Schedule.isHoliday(date, isRecycling)
        arr.push({ date, isHoliday })
      }
    })
    return _.chain(arr).sortBy(x => x.date.valueOf()).uniq(x => x.date.valueOf(), true).value()
  }

  // returns the next day of the week as a moment, offset by startDate
  static nextDayOfWeek (dayInt, startDate = null) {
    var date = (startDate) ? moment(startDate).add(1, 'days') : moment()
    // // test xmas 2014, a thursday or 4
    // date = (startDate) ? moment(startDate).add(1, 'days') : moment('12/25/2014', 'MM/DD/YYYY')

    if (date.isoWeekday() <= dayInt) {
      // return that week's day
      return date.isoWeekday(dayInt)
    } else {
      // return the following week's day
      return date.add(1, 'weeks').isoWeekday(dayInt)
    }
  }

  // is date a holiday
  static isHoliday (testDate, isRecycling = false) {
    testDate = moment(testDate.valueOf())
    const dateD = testDate.date()
    const dateM = testDate.month() + 1
    const dateW = testDate.day()
    const dateL = testDate.endOf('month').date()
    var dateWnum, dateStr

    // new years (except recycling), independence, christmas
    dateStr = [dateM, dateD].join('/')
    if (dateStr === '1/1' && isRecycling) {
      return false
    }
    if (dateStr === '1/1' || dateStr === '7/4' || dateStr === '12/25') {
      return true
    }

    // labor, thanksgiving
    dateWnum = Math.floor((dateD - 1) / 7) + 1
    dateStr = [dateM, dateWnum, dateW].join('/')
    if (dateStr === '9/1/1' || dateStr === '11/4/4') {
      return true
    }

    // memorial
    dateWnum = Math.floor((dateL - dateD - 1) / 7) + 1
    dateStr = [dateM, dateWnum, dateW].join('/')
    if (dateStr === '5/1/1') {
      return true
    }

    // else
    return false
  }

  // esri settings
  static get esri () {
    return {
      url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/InfoLayers/SW_HAULER_DATA2/MapServer/1',
      fields: ['*'],
      fKey: 'Folio'
    }
  }

  // returns promise
  static findByFolio (folio) {
    if (folio) {
      return esriLoader.loadModules([
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query'
      ]).then(([QueryTask, Query]) => {
        var queryTask = new QueryTask({
          url: Schedule.esri.url
        })

        var query = new Query()
        query.where = (folio) ? `${Schedule.esri.fKey}=${folio}` : '1=0'

        query.returnGeometry = false
        query.outFields = Schedule.esri.fields

        return queryTask.execute(query).then(response => {
          if (response.features.length) {
            return new Schedule(response.features[0].attributes)
          } else {
            return null
          }
        })
      })
    } else {
      return Promise.resolve(null)
    }
  }
}
