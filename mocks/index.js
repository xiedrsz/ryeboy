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
      "overflow": true,
      "likeIt": Random.boolean()
    });

    return result
  })
  //获取已关注的用户总数，关注用户上限，用户头像，用户名，是否取消关注
  .mock(/getConcerns/, function() {
    var result = Mock.mock({
      "list|1-15": [{
        _id: '56e4d40d731956005ce0156a',
        username: function() {
          return Random.cname()
        },
        portrait: '2',
        nickname: '学长土豆',
        grade: {
          lv: 41,
          exp: 51576
        }
      }]
    });

    return result.list;
  })
  //获取粉丝总数，粉丝头像，用户名，粉丝ID号，点击头像进入个人页面
  .mock(/getFans/, function() {
    var result = Mock.mock({
      "list|1-15": [{
        _id: '56e4d40d731956005ce0156a',
        username: function() {
          return Random.cname()
        },
        portrait: '2',
        nickname: '学长土豆',
        grade: {
          lv: 41,
          exp: 51576
        }
    }]
    });

    return result.list;
  })
  // 获取新关注人/换一批
  .mock(/getNewConcern/, function() {
    var result = Mock.mock({
      "list|1-15": [{
        _id: '56e4d40d731956005ce0156a',
        username: function() {
          return Random.cname()
        },
        portrait: '2',
        nickname: '学长土豆',
        grade: {
          lv: 41,
          exp: 51576
        }
      }]
    });

    return result.list;
  })
  // 关注
  .mock(/\/concern/, function() {
    return {
      "data": null,
      "datas": {},
      "status": 200,
      "statusText": null
    }
  })
  // 取消关注
  .mock(/cancelConcern/, function() {
    return {
      "data": null,
      "datas": {},
      "status": 200,
      "statusText": null
    }
  })
  // 点赞
  .mock(/like/, function() {
    return {
      "data": null,
      "datas": {},
      "status": 200,
      "statusText": null
    }
  })
  // 评论
  .mock(/comment/, function() {
    return {
      "data": null,
      "datas": {},
      "status": 200,
      "statusText": null
    }
  })