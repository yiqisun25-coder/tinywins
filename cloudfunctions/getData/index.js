// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud1-7gx4c1sy905c2fa7' }) // 使用指定云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 根据传入的参数获取不同的数据
    switch (event.type) {
      case 'userProfile':
        return await db.collection('profiles')
          .where({
            _openid: wxContext.OPENID
          })
          .get()
      
      case 'achievements':
        return await db.collection('achievements')
          .where({
            _openid: wxContext.OPENID
          })
          .orderBy('createTime', 'desc')
          .get()
      
      default:
        return {
          error: 'Invalid type'
        }
    }
  } catch (err) {
    console.error(err)
    return {
      error: err
    }
  }
}
