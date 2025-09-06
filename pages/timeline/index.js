const app = getApp()

Page({
  data: {
    currentDate: '',
    formattedDate: '',
    timelineItems: [],
    showModal: false,
    eventTypes: [
      { name: '工作', icon: '💼' },
      { name: '学习', icon: '📚' },
      { name: '运动', icon: '💪' },
      { name: '用餐', icon: '🍽️' },
      { name: '休息', icon: '😴' },
      { name: '社交', icon: '👥' },
      { name: '其他', icon: '⭐' }
    ],
    newEvent: {
      time: '',
      typeIndex: 0,
      content: ''
    }
  },

  onLoad() {
    this.setCurrentDate()
  },

  onShow() {
    this.loadTimelineItems()
  },
    
  showTimeModal() {
    // 设置默认时间为当前时间
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const defaultTime = `${hours}:${minutes}`
    
    this.setData({
      'newEvent.time': defaultTime,
      'newEvent.content': '',
      'newEvent.typeIndex': 0,
      showModal: true
    })
  },

  setCurrentDate() {
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[now.getDay()]
    
    this.setData({
      currentDate,
      formattedDate: `${year}年${month}月${day}日 星期${weekDay}`
    })
  },

  onDateChange(e) {
    const date = new Date(e.detail.value)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    const weekDay = weekDays[date.getDay()]
    
    this.setData({
      currentDate: e.detail.value,
      formattedDate: `${year}年${month}月${day}日 星期${weekDay}`
    })
    this.loadTimelineItems()
  },

  loadTimelineItems() {
    const items = wx.getStorageSync(`timeline_${this.data.currentDate}`) || []
    items.sort((a, b) => a.time.localeCompare(b.time))
    this.setData({ timelineItems: items })
  },

  showAddModal() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    this.setData({
      showModal: true,
      newEvent: {
        time: `${hours}:${minutes}`,
        typeIndex: 0,
        content: ''
      }
    })
  },

  hideModal() {
    this.setData({ showModal: false })
  },

  onTimeChange(e) {
    this.setData({
      'newEvent.time': e.detail.value
    })
  },

  onTypeChange(e) {
    this.setData({
      'newEvent.typeIndex': Number(e.detail.value)
    })
  },

  onContentInput(e) {
    this.setData({
      'newEvent.content': e.detail.value
    })
  },

  addEvent() {
    const { time, typeIndex, content } = this.data.newEvent
    if (!time || !content.trim()) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const eventType = this.data.eventTypes[typeIndex]
    const newItem = {
      id: Date.now(),
      time,
      content: content.trim(),
      typeIndex,
      typeName: eventType.name,
      icon: eventType.icon,
      completed: false
    }

    const items = [...this.data.timelineItems, newItem]
    items.sort((a, b) => a.time.localeCompare(b.time))
    
    this.setData({ timelineItems: items })
    wx.setStorageSync(`timeline_${this.data.currentDate}`, items)
    
    this.hideModal()
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },

  toggleComplete(e) {
    const { id } = e.currentTarget.dataset
    const items = this.data.timelineItems.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed }
      }
      return item
    })
    
    this.setData({ timelineItems: items })
    wx.setStorageSync(`timeline_${this.data.currentDate}`, items)
  },

  deleteEvent(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个事项吗？',
      success: (res) => {
        if (res.confirm) {
          const items = this.data.timelineItems.filter(item => item.id !== id)
          this.setData({ timelineItems: items })
          wx.setStorageSync(`timeline_${this.data.currentDate}`, items)
        }
      }
    })
  }
})