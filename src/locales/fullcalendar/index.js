
import esLocale from '@fullcalendar/core/locales/es'
import jaLocale from '@fullcalendar/core/locales/ja'
import zhCNLocale from '@fullcalendar/core/locales/zh-cn'
import zhTWLocale from '@fullcalendar/core/locales/zh-tw'

const localeMap = {
  'en': 'es',
  'ja': 'ja',
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw'
}

export default {
  locales: [esLocale, jaLocale, zhCNLocale, zhTWLocale],
  localeMap: localeMap
}
