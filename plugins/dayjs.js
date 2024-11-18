import dayjs from 'dayjs'
import 'dayjs/locale/pt-br' 
import weekday from 'dayjs/plugin/weekday'
import relativeTime from 'dayjs/plugin/relativeTime'

export default defineNuxtPlugin(nuxtApp => {
  dayjs.locale('pt-br')
  dayjs.extend(weekday)
  dayjs.extend(relativeTime)

  nuxtApp.provide('dayjs', dayjs)
})
