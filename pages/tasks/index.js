const app = getApp()

Page({
  data: {
    currentDate: '',
    tasks: [
      { id: 1, content: '', completed: false, time: '' },
      { id: 2, content: '', completed: false, time: '' },
      { id: 3, content: '', completed: false, time: '' }
    ],
    motivationText: 'Important + Urgent'
  },

  onLoad: function() {
    this.setCurrentDate()
    this.loadTasks()
  },

  onShow: function() {
    this.loadTasks()
  },

  // 设置当前日期
  setCurrentDate: function() {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    this.setData({
      currentDate: `${year}年${month}月${day}日 星期${weekDay}`
    })
  },

  // 加载任务
  loadTasks: function() {
    const tasks = wx.getStorageSync(`tasks_${this.getTodayDate()}`)
    if (tasks) {
      this.setData({ tasks })
    }
  },

  // 切换任务完成状态
  toggleTask: function(e) {
    const { id } = e.currentTarget.dataset
    const tasks = this.data.tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    this.setData({ tasks })
    this.saveTasks()
  },

  // 编辑任务
  editTask: function(e) {
    const { id } = e.currentTarget.dataset
    const task = this.data.tasks.find(t => t.id === id)
    
    wx.showModal({
      title: '编辑任务',
      content: task.content || '',
      editable: true,
      placeholderText: '请输入任务内容',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const tasks = this.data.tasks.map(t => {
            if (t.id === id) {
              return { 
                ...t, 
                content: res.content.trim(),
                time: this.getCurrentTime()
              }
            }
            return t
          })
          this.setData({ tasks })
          this.saveTasks()
        }
      }
    })
  },

  // 保存任务
  saveTasks: function() {
    const key = `tasks_${this.getTodayDate()}`
    wx.setStorage({
      key,
      data: this.data.tasks
    })
  },

  // 获取当前日期字符串
  getTodayDate: function() {
    const date = new Date()
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  },

  // 获取当前时间
  getCurrentTime: function() {
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }
})
