var Mock = require('mockjs')
var Random = Mock.Random

Mock
// 获取 关注、粉丝 数目
  .mock(/getFansNum/, {
    "cons|1-50": 50,
    "fans|1-50": 50
  })
  //获取 日记发布者的头像、用户名，日记内容、发布时间、点赞的数量，评论的数量、标签，用户是否已点赞
  .mock(/getDynamicDiaries/, function() {
    var result = Mock.mock({
      "likeCount|1-50": 50,
      "commentCount|1-50": 50,
      "avatar": "/img/default-avatar.png",
      "username": Random.cname(),
      "escapedText": Random.cparagraph(),
      "time": "2月8日 22:56",
      "overflow": true
    });

    return result

  })
  //获取已关注的用户总数，关注用户上限，用户头像，用户名，是否取消关注
  .mock(/getConcerns/, function() {
    return {
      "data": null,
      "datas": {},
      "status": 200,
      "statusText": null
    }
  })

//获取粉丝总数，粉丝头像，用户名，粉丝ID号，点击头像进入个人页面
.mock(/getFans/, function() {
  return {
    "data": null,
    "datas": {},
    "status": 200,
    "statusText": null
  }
})

//获取符合条件的用户头像，用户名，ID号，是否关注，已关注的数量，推举关注总数量
.mock(/addConcern/, function() {
  return {
    "data": null,
    "datas": {},
    "status": 200,
    "statusText": null
  }
})