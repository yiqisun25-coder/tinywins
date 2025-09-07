const app = getApp()

Page({
  data: {
    currentDate: '',
    formattedDate: '',
    tasks: [
      { id: 1, content: '', completed: false, time: '', goalId: null },
      { id: 2, content: '', completed: false, time: '', goalId: null },
      { id: 3, content: '', completed: false, time: '', goalId: null }
    ],
    unimportantTasks: [
      { id: 1, content: '', completed: false },
      { id: 2, content: '', completed: false }
    ],
    goals: [],
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
    },
    activeTab: 'tasks'
  },

  onLoad: function() {
    this.setCurrentDate()
    this.loadTasks()
    this.loadGoals()
    this.loadTimelineItems()
  },

  onShow: function() {
    this.loadTasks()
    this.loadGoals()
    this.loadTimelineItems()
  },

  switchTab: function(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ activeTab: tab })
  },

  // 加载目标数据
  loadGoals: function() {
    const goals = wx.getStorageSync('goals') || []
    this.setData({ goals })
  },

  // 设置当前日期
  setCurrentDate: function() {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    const formattedDate = `${year}年${month}月${day}日 星期${weekDay}`
    const currentDate = `${year}-${month}-${day}`
    
    this.setData({
      currentDate,
      formattedDate
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
    this.loadTasks()
  },

  clearTask: function(e) {
    const { id } = e.currentTarget.dataset
    const tasksKey = `tasks_${this.data.currentDate}`
    
    wx.showModal({
      title: '清空任务',
      content: '确定要清空这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const tasks = this.data.tasks.map(task => {
            if (task.id === id) {
              return {
                ...task,
                content: '',
                completed: false,
                time: '',
                goalId: null
              }
            }
            return task
          })
          this.setData({ tasks })
          wx.setStorageSync(tasksKey, tasks)
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  clearUnimportantTask: function(e) {
    const { id } = e.currentTarget.dataset
    const unimportantTasksKey = `unimportantTasks_${this.data.currentDate}`
    
    wx.showModal({
      title: '清空任务',
      content: '确定要清空这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const unimportantTasks = this.data.unimportantTasks.map(task => {
            if (task.id === id) {
              return {
                ...task,
                content: '',
                completed: false
              }
            }
            return task
          })
          this.setData({ unimportantTasks })
          wx.setStorageSync(unimportantTasksKey, unimportantTasks)
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        }
      }
    })
  },

  deleteTimelineItem: function(e) {
    const { id } = e.currentTarget.dataset
    const timelineKey = `timeline_${this.data.currentDate}`
    
    wx.showModal({
      title: '删除事项',
      content: '确定要删除这个事项吗？',
      success: (res) => {
        if (res.confirm) {
          const timelineItems = this.data.timelineItems.filter(item => item.id !== id)
          this.setData({ timelineItems })
          wx.setStorageSync(timelineKey, timelineItems)
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 加载任务
  loadTasks: function() {
    const tasksKey = `tasks_${this.data.currentDate}`
    const unimportantTasksKey = `unimportantTasks_${this.data.currentDate}`
    
    let tasks = wx.getStorageSync(tasksKey) || []
    // 确保始终有三个重要任务
    if (tasks.length < 3) {
      const defaultTasks = [
        { id: 1, content: '', completed: false, time: '', goalId: null },
        { id: 2, content: '', completed: false, time: '', goalId: null },
        { id: 3, content: '', completed: false, time: '', goalId: null }
      ]
      tasks = defaultTasks.map((defaultTask, index) => {
        return tasks[index] || defaultTask
      })
    }
    
    let unimportantTasks = wx.getStorageSync(unimportantTasksKey) || []
    // 确保始终有三个不重要任务
    if (unimportantTasks.length < 3) {
      const defaultUnimportantTasks = [
        { id: 1, content: '', completed: false },
        { id: 2, content: '', completed: false },
        { id: 3, content: '', completed: false }
      ]
      unimportantTasks = defaultUnimportantTasks.map((defaultTask, index) => {
        return unimportantTasks[index] || defaultTask
      })
    }
    
    this.setData({ 
      tasks,
      unimportantTasks
    })
  },

  // 切换任务完成状态
  toggleTask: function(e) {
    const { id } = e.currentTarget.dataset
    const tasks = this.data.tasks.map(task => {
      if (task.id === id) {
        const newTask = { ...task, completed: !task.completed }
        // 如果任务完成且关联了目标，更新目标进度
        if (newTask.completed && newTask.goalId) {
          this.updateGoalProgress(newTask.goalId)
        }
        return newTask
      }
      return task
    })
    this.setData({ tasks })
    this.saveTasks()
  },

  // 更新目标进度
  updateGoalProgress: function(goalId) {
    const goals = this.data.goals.map(section => ({
      ...section,
      items: section.items.map(goal => {
        if (goal.id === goalId) {
          // 简单的进度计算，这里可以根据需求调整
          const progress = Math.min(100, goal.progress + 5)
          return { ...goal, progress }
        }
        return goal
      })
    }))
    this.setData({ goals })
    wx.setStorageSync('goals', goals)
  },

  // 编辑任务
  editTask: function(e) {
    const { id } = e.currentTarget.dataset
    const task = this.data.tasks.find(t => t.id === id)
    
    wx.showActionSheet({
      itemList: ['编辑内容', '设置时间', '关联目标', '清空任务'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.editTaskContent(task)
            break
          case 1:
            this.editTaskTime(task)
            break
          case 2:
            this.linkTaskToGoal(task)
            break
          case 3:
            this.clearTask({ currentTarget: { dataset: { id: task.id } } })
            break
        }
      }
    })
  },

  // 编辑任务内容
  editTaskContent: function(task) {
    wx.showModal({
      title: '编辑任务',
      content: '',
      editable: true,
      placeholderText: '输入任务内容',
      value: task.content,
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const tasks = this.data.tasks.map(t => {
            if (t.id === task.id) {
              return { ...t, content: res.content.trim() }
            }
            return t
          })
          this.setData({ tasks })
          this.saveTasks()
        }
      }
    })
  },

  // 编辑任务时间
  editTaskTime: function(task) {
    wx.showModal({
      title: '设置时间',
      content: '',
      editable: true,
      placeholderText: 'HH:mm',
      value: task.time || this.getCurrentTime(),
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const tasks = this.data.tasks.map(t => {
            if (t.id === task.id) {
              return { ...t, time: res.content.trim() }
            }
            return t
          })
          this.setData({ tasks })
          this.saveTasks()
        }
      }
    })
  },

  // 关联任务到目标
  linkTaskToGoal: function(task) {
    // 准备目标选择列表
    const goalsList = []
    this.data.goals.forEach(section => {
      section.items.forEach(goal => {
        goalsList.push({
          id: goal.id,
          name: `${section.title} - ${goal.content}`
        })
      })
    })
    goalsList.push({ id: null, name: '取消关联目标' })

    wx.showActionSheet({
      itemList: goalsList.map(g => g.name),
      success: (res) => {
        const selectedGoal = goalsList[res.tapIndex]
        const tasks = this.data.tasks.map(t => {
          if (t.id === task.id) {
            return { ...t, goalId: selectedGoal.id }
          }
          return t
        })
        this.setData({ tasks })
        this.saveTasks()

        wx.showToast({
          title: selectedGoal.id ? '已关联目标' : '已取消关联',
          icon: 'success'
        })
      }
    })
  },

  // 保存任务
  saveTasks: function() {
    const tasksKey = `tasks_${this.data.currentDate}`
    const unimportantTasksKey = `unimportantTasks_${this.data.currentDate}`
    
    wx.setStorageSync(tasksKey, this.data.tasks)
    wx.setStorageSync(unimportantTasksKey, this.data.unimportantTasks)
  },

  // 获取当前时间
  getCurrentTime: function() {
    const date = new Date()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  // 处理不重要不紧急任务的完成状态
  toggleUnimportantTask: function(e) {
    const { id } = e.currentTarget.dataset
    const unimportantTasks = this.data.unimportantTasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    this.setData({ unimportantTasks })
    this.saveTasks()
  },

  // 编辑不重要不紧急任务
  editUnimportantTask: function(e) {
    const { id } = e.currentTarget.dataset
    const task = this.data.unimportantTasks.find(t => t.id === id)
    
    wx.showActionSheet({
      itemList: ['编辑内容', '清空任务'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.editUnimportantTaskContent(task)
            break
          case 1:
            this.clearUnimportantTask({ currentTarget: { dataset: { id: task.id } } })
            break
        }
      }
    })
  },

  // 编辑不重要不紧急任务内容
  editUnimportantTaskContent: function(task) {
    wx.showModal({
      title: '编辑任务',
      content: '',
      editable: true,
      placeholderText: '输入任务内容',
      value: task.content,
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const unimportantTasks = this.data.unimportantTasks.map(t => {
            if (t.id === task.id) {
              return { ...t, content: res.content.trim() }
            }
            return t
          })
          this.setData({ unimportantTasks })
          this.saveTasks()
        }
      }
    })
  },

  // 加载时间线项目
  loadTimelineItems() {
    const items = wx.getStorageSync(`timeline_${this.data.currentDate}`) || []
    items.sort((a, b) => a.time.localeCompare(b.time))
    this.setData({ timelineItems: items })
  },

  // 时间线相关功能
  showTimeModal() {
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
