Page({
  data: {
    stats: {
      completedTasks: 0,
      completedGoals: 0,
      streak: 0
    }
  },

  onLoad: function() {
    console.log('Profile page loaded');
    this.loadStats();
  },

  onShow: function() {
    console.log('Profile page shown');
    this.loadStats();
  },

  loadStats: function() {
    try {
      const completedTasks = wx.getStorageSync('completedTasks') || 0;
      const streak = wx.getStorageSync('streak') || 0;
      const goals = wx.getStorageSync('goals') || [];
      
      console.log('Loading stats:', { completedTasks, streak, goals });

      this.setData({
        stats: {
          completedTasks,
          completedGoals: 0,
          streak
        }
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  },

  navigateTo: function(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path
    });
  },

  onShareAppMessage: function() {
    return {
      title: 'TinyWins - 记录每一个小进步',
      path: '/pages/index/index'
    };
  }
});
