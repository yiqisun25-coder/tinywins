App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-7gx4c1sy905c2fa7',
        traceUser: true
      })
    }
  },
  globalData: {
    userInfo: null,
    appId: 'wx5e05a86b88a190d7'
  }
})
