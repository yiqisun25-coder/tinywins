Page({
  data: {
    goals: [
      {
        id: 1,
        title: '长期愿景',
        items: []
      },
      {
        id: 2,
        title: '年度目标',
        items: []
      },
      {
        id: 3,
        title: '季度目标',
        items: []
      }
    ]
  },

  onLoad: function() {
    this.loadGoals()
  },

  loadGoals: function() {
    const goals = wx.getStorageSync('goals') || this.data.goals
    this.setData({ goals })
  },

  editProgress: function(e) {
    const { sectionId, goalId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '更新进度',
      content: '',
      editable: true,
      placeholderText: '输入完成百分比（0-100）',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const progress = parseInt(res.content)
          if (isNaN(progress) || progress < 0 || progress > 100) {
            wx.showToast({
              title: '请输入0-100的数字',
              icon: 'none'
            })
            return
          }
          
          const goals = this.data.goals.map(section => {
            if (section.id === sectionId) {
              const items = section.items.map(item => {
                if (item.id === goalId) {
                  return { ...item, progress }
                }
                return item
              })
              return { ...section, items }
            }
            return section
          })
          
          this.setData({ goals })
          wx.setStorageSync('goals', goals)
          
          wx.showToast({
            title: '进度已更新',
            icon: 'success'
          })
        }
      }
    })
  },

  addGoalItem: function(e) {
    const { sectionId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '添加目标',
      content: '',
      editable: true,
      placeholderText: '输入你的目标',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const goals = this.data.goals.map(section => {
            if (section.id === sectionId) {
              const newItem = {
                id: Date.now(),
                content: res.content.trim(),
                progress: 0
              }
              return {
                ...section,
                items: [...section.items, newItem]
              }
            }
            return section
          })
          this.setData({ goals })
          wx.setStorageSync('goals', goals)
        }
      }
    })
  },

  deleteGoalItem: function(e) {
    const { sectionId, goalId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '删除目标',
      content: '确定要删除这个目标吗？',
      success: (res) => {
        if (res.confirm) {
          const goals = this.data.goals.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                items: section.items.filter(item => item.id !== goalId)
              }
            }
            return section
          })
          
          this.setData({ goals })
          wx.setStorageSync('goals', goals)
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
        }
      }
    })
  }
})
