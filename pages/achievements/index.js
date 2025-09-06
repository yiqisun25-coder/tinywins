// pages/achievements/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    unlockedCount: 0,
    achievements: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 检查登录状态
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: res.data
        });
      },
      fail: () => {
        console.log('未登录');
      }
    });

    // 示例成就定义
    const defs = [
      {id:'good_baby',title:'好宝',icon:'🌟',description:'连续3天完成任务',progress:100,unlocked:true},
      {id:'good_good_baby',title:'好好宝',icon:'⭐',description:'连续7天完成任务',progress:60,unlocked:false},
      {id:'good_good_good_baby',title:'好好好宝',icon:'👑',description:'连续15天完成任务',progress:30,unlocked:false},
      {id:'task_master',title:'任务大师',icon:'🎯',description:'完成100个任务',progress:20,unlocked:false}
    ];
    
    // 计算已解锁成就数量
    const unlockedCount = defs.filter(item => item.unlocked).length;
    
    this.setData({ 
      achievements: defs,
      unlockedCount: unlockedCount
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  // 导出用户数据
  exportData() {
    wx.showLoading({
      title: '准备导出...',
    });

    // 分别获取数据
    this.getStorageData('tasks', (tasks) => {
      this.getStorageData('timelineItems', (timeline) => {
        this.getStorageData('achievements', (achievements) => {
          // 准备导出的数据
          const exportData = {
            tasks,
            timeline,
            achievements,
            exportDate: new Date().toISOString(),
            userInfo: this.data.userInfo
          };

          // 转换为字符串
          const dataStr = JSON.stringify(exportData, null, 2);

          // 复制到剪贴板
          wx.setClipboardData({
            data: dataStr,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '数据已复制到剪贴板',
                icon: 'success'
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '导出失败',
                icon: 'error'
              });
            }
          });
        });
      });
    });
  },

  // 获取存储数据的辅助函数
  getStorageData(key, callback) {
    wx.getStorage({
      key: key,
      success: (res) => {
        callback(res.data || []);
      },
      fail: () => {
        callback([]);
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})