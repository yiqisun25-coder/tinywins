Page({
  data: {
    categories: [
      { name: '工作', color: '#4CAF50' },
      { name: '学习', color: '#2196F3' },
      { name: '生活', color: '#FF9800' },
      { name: '健康', color: '#E91E63' },
      { name: '其他', color: '#9C27B0' }
    ],
    selectedCategory: null
  },

  handleCategoryChange(e) {
    const index = e.detail.value
    this.setData({
      selectedCategory: this.data.categories[index]
    })
  },

  async handleSubmit(e) {
    const { title, description } = e.detail.value
    
    if (!title) {
      wx.showToast({
        title: '请输入成就标题',
        icon: 'none'
      })
      return
    }

    if (!this.data.selectedCategory) {
      wx.showToast({
        title: '请选择类别',
        icon: 'none'
      })
      return
    }

    try {
      wx.showLoading({
        title: '保存中'
      })

      const db = wx.cloud.database()
      await db.collection('achievements').add({
        data: {
          title,
          description,
          category: this.data.selectedCategory.name,
          categoryColor: this.data.selectedCategory.color,
          createTime: new Date()
        }
      })

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)

    } catch (err) {
      console.error('保存失败', err)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }
})
