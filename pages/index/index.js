Page({
  data: {
    motto: '记录每一个进步',
    categories: [
      { name: '工作', color: '#4CAF50' },
      { name: '学习', color: '#2196F3' },
      { name: '生活', color: '#FF9800' },
      { name: '健康', color: '#E91E63' },
      { name: '其他', color: '#9C27B0' }
    ],
    selectedCategory: 'all',
    achievements: [],
    filteredAchievements: [],
    searchQuery: '',
    todayCount: 0,
    weekCount: 0,
    totalCount: 0,
    streakCount: 0,
    page: 1,
    pageSize: 10,
    hasMore: true
  },

  onLoad() {
    this.loadAchievements()
  },

  onShow() {
    // 每次页面显示时重新加载数据
    this.loadAchievements()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true }, () => {
      this.loadAchievements()
    })
  },

  async loadAchievements() {
    if (!this.data.hasMore && this.data.page > 1) return

    try {
      wx.showLoading({
        title: '加载中'
      })

      const { result } = await wx.cloud.callFunction({
        name: 'getData',
        data: {
          type: 'achievements',
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      })

      if (result && result.data) {
        // 格式化日期和处理数据
        const achievements = result.data.map(item => ({
          ...item,
          createTime: this.formatDate(item.createTime),
          isLiked: false // 这里可以从服务器获取点赞状态
        }))

        // 更新成就列表
        if (this.data.page === 1) {
          this.setData({ achievements })
        } else {
          this.setData({
            achievements: [...this.data.achievements, ...achievements]
          })
        }

        // 更新统计数据
        this.updateStats(achievements)
        
        // 应用筛选
        this.filterAchievements()

        // 更新分页状态
        this.setData({
          hasMore: achievements.length === this.data.pageSize,
          page: this.data.page + 1
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
      wx.stopPullDownRefresh()
    }
  },

  updateStats(achievements) {
    const now = new Date()
    const today = this.formatDate(now)
    const weekStart = this.formatDate(new Date(now - now.getDay() * 24 * 3600 * 1000))

    const todayCount = achievements.filter(a => a.createTime === today).length
    const weekCount = achievements.filter(a => new Date(a.createTime) >= new Date(weekStart)).length

    this.setData({
      todayCount,
      weekCount,
      totalCount: achievements.length,
      streakCount: this.calculateStreak(achievements)
    })
  },

  calculateStreak(achievements) {
    if (!achievements.length) return 0
    
    let streak = 1
    const today = this.formatDate(new Date())
    const yesterday = this.formatDate(new Date(Date.now() - 86400000))
    
    const hasRecentAchievement = achievements.some(a => 
      a.createTime === today || a.createTime === yesterday
    )
    
    return hasRecentAchievement ? streak : 0
  },

  formatDate(date) {
    if (typeof date === 'string') date = new Date(date)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    }, () => {
      this.filterAchievements()
    })
  },

  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      selectedCategory: category
    }, () => {
      this.filterAchievements()
    })
  },

  filterAchievements() {
    let filtered = [...this.data.achievements]
    
    // 应用分类筛选
    if (this.data.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.data.selectedCategory)
    }
    
    // 应用搜索筛选
    if (this.data.searchQuery) {
      const query = this.data.searchQuery.toLowerCase()
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.description && item.description.toLowerCase().includes(query))
      )
    }
    
    this.setData({ filteredAchievements: filtered })
  },

  toggleLike(e) {
    const id = e.currentTarget.dataset.id
    const achievements = this.data.achievements.map(item => {
      if (item._id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.likes ? (item.isLiked ? item.likes - 1 : item.likes + 1) : 1
        }
      }
      return item
    })
    
    this.setData({ achievements }, () => {
      this.filterAchievements()
    })
  },

  showAchievementDetail(e) {
    const id = e.currentTarget.dataset.id
    // 可以跳转到详情页
    wx.showToast({
      title: '详情页开发中',
      icon: 'none'
    })
  },

  shareAchievement(e) {
    const id = e.currentTarget.dataset.id
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  showFilterOptions() {
    wx.showActionSheet({
      itemList: ['最新发布', '最多点赞', '仅显示今天'],
      success: (res) => {
        // 根据选择更新排序
        this.setData({ page: 1 }, () => {
          this.loadAchievements()
        })
      }
    })
  },

  loadMore() {
    if (this.data.hasMore) {
      this.loadAchievements()
    }
  }
})
