/**
 * device detect from user-agent
 * ライブラリ使うことも検討したが、どうせPC/SP判別だけなのでプラグインを作って対応
 * Client -> this.$device.isDesktop
 * Server -> app.$device.isDesktop
 */

const isIos = (a) => {
  return /iPad|iPhone|iPod/.test(a)
}
const isWindows = (a) => {
  return /Windows/.test(a)
}
const isMacOS = (a) => {
  return /Mac OS X/.test(a)
}
const isMobile = (a) => {
  return /iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone/.test(a)
}

// ブラウザ判定、とりあえず問題児のIEとSafariだけ
const isIE = (a) => {
  return /msie|trident\/7/i.test(a)
}
const isSafari = (a) => {
  return /^(?!.*Chrome).+(Safari).+$/i.test(a)
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36'

export default function(ctx, inject) {
  let userAgent = ''
  if (typeof ctx.req !== 'undefined') {
    userAgent = ctx.req.headers['user-agent']
  } else if (typeof window.navigator !== 'undefined') {
    userAgent = window.navigator.userAgent
  } else {
    // 一応どちらにも当てはまらなかった場合はデフォルトを返す
    userAgent = DEFAULT_USER_AGENT
  }
  inject('device', {
    isMobile: isMobile(userAgent),
    isDesktop: !isMobile(userAgent),
    isIos: isIos(userAgent),
    isWindows: isWindows(userAgent),
    isMacOS: isMacOS(userAgent),
    isIE: isIE(userAgent),
    isSafari: isSafari(userAgent)
  })
}
