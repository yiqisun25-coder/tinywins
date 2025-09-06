// pages/gratitude/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    gratitudeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 加载本地存储的感恩数据
    const list = wx.getStorageSync('gratitudeList') || [];
    this.setData({ gratitudeList: list });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  addGratitude() {
    const text = this.data.inputValue.trim();
    if (!text) return;
    const newItem = {
      id: Date.now(),
      text,
      date: this._getDate(),
      time: this._getTime()
    };
    const list = [newItem, ...this.data.gratitudeList];
    this.setData({ gratitudeList: list, inputValue: '' });
    wx.setStorageSync('gratitudeList', list);
  },

  deleteGratitude(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.gratitudeList.filter(item => item.id !== id);
    this.setData({ gratitudeList: list });
    wx.setStorageSync('gratitudeList', list);
  },

  _getDate() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  },
  _getTime() {
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`;
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