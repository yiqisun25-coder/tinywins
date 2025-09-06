Page({
  data: {
    achievements: [],
    achievementsCount: 0,
    streakCount: 0
  },

  onLoad() {
    this.loadAchievements()
  },

  onShow() {
    // 每次页面显示时重新加载数据
    this.loadAchievements()
  },

  async loadAchievements() {
    try {
      wx.showLoading({
        title: '加载中'
      })

      const { result } = await wx.cloud.callFunction({
        name: 'getData',
        data: {
          type: 'achievements'
        }
      })

      if (result && result.data) {
        // 格式化日期
        const achievements = result.data.map(item => ({
          ...item,
          createTime: new Date(item.createTime).toLocaleDateString()
        }))

        this.setData({
          achievements,
          achievementsCount: achievements.length,
          // 计算连续天数（示例逻辑）
          streakCount: this.calculateStreak(achievements)
        })
      }
    } catch (err) {
      console.error('加载失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  calculateStreak(achievements) {
    // 简单的连续天数计算逻辑
    if (!achievements.length) return 0
    
    let streak = 1
    const today = new Date().toLocaleDateString()
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()
    
    // 检查是否有今天或昨天的成就
    const hasRecentAchievement = achievements.some(a => 
      a.createTime === today || a.createTime === yesterday
    )
    
    return hasRecentAchievement ? streak : 0
  },

  navigateToAdd() {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  }
})
