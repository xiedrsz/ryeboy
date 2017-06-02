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
      "list|1-15": [{
        "likeCount|1-50": 50,
        "commentCount|1-50": 50,
        "avatar": "/img/default-avatar.png",
        "username": function() {
          return Random.cname()
        },
        "escapedText": function() {
          return Random.cparagraph()
        },
        "time": "2月8日 22:56",
        "overflow": true,
        "likeIt": function() {
          return Random.boolean()
        },
      }]
    });

    return result.list
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
        },
        note: "取消"
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
        },
        note: "关注"
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
  // 获取订阅列表
  .mock(/getSubscribles/, function() {
    return {
      "data ": null,
    }
  })
  // 获取订阅频道内容
  .mock(/getSubChannels/, function() {
    return {
      "data ": null,
    }
  })
  // 退订
  .mock(/unsubscribe/, function() {
    return {
      "data ": null,
    }
  })
  // 添加订阅频道
  .mock(/addSubscrible/, function() {
    return {
      "data ": null,
    }
  })
  // 订阅
  .mock(/subscrible/, function() {
    return {
      "data ": null,
    }
  })
  // 获取小组列表
  .mock(/groups/, function() {
    var result = Mock.mock({
      "list|1-10": [{
        "avatar": "/img/default-avatar.png",
        "name": function() {
          return Random.cword(3, 5);
        },
        "id": /\d{8}/,
        "descrption": function() {
          return Random.csentence(8);
        },
        "gradeNum|1-50": 50,
        "gradeMax": 50,
        "level|1-5": 5,
        "classify": function() {
          var temp = Mock.mock({
              'regexp': /all(,welcome)?(,latest)?(,level)?(,honor)?(,littleBoy|,BigBoy)?/
            }),
            args = temp.regexp.split(",");

          return args;
        },
        "note": "加入"
      }]
    });

    return result.list
  })

// 加入小组
.mock(/apply/, function() {
    return {
      "data ": null,
    }
  })
  // 查找小组
  .mock(/searchGroup/, function() {
    return {
      "data ": null,
    }
  })
  // 创建小组
  .mock(/__groups$/, function() {
    return {
      "data ": null,
    }
  })
  // 获取小组成员
  .mock(/getMembers/, function() {
    return {
      "data ": null,
    }
  })
  // 获取申请列表
  .mock(/getApplys/, function() {
    return {
      "data ": null,
    }
  })
  // 同意申请
  .mock(/approve/, function() {
    return {
      "data ": null,
    }
  })
  // 拒绝申请
  .mock(/rejectApply/, function() {
    return {
      "data ": null,
    }
  })
  // 获取小组消息，根据id获取对应小组的成员日记
  .mock(/diaries/, function() {
    var result = Mock.mock({
      "list|1-15": [{
        "likeCount|1-50": 50,
        "commentCount|1-50": 50,
        avatar: '/img/default-avatar.png',
        username: function() {
          return Random.cname()
        },
        escapedText: function() {
          return Random.cparagraph()
        },
        time: "2月8日 22:56",
        overflow: true,
        likeIt: function() {
          return Random.boolean()
        },
        "channel|+1": [
          "essence",
          "changed",
          "latest",
          "welcome",
          "unwelcome",
          "problems"
        ]
      }]
    });

    return result.list
  })
  // 获取小组资料
  .mock(/getGroupInfo/, function() {
    var result = Mock.mock({
      "avatar": "/img/default-avatar.png",
      "name": Random.cword(3, 5),
      "id": /\d{8}/,
      "memMax": 100,
      "memNum|1-50": 50,
      "members|1-15": [{
        avatar: "/img/default-avatar.png",
        name: function() {
          return Random.cname();
        },
        "grade|1-50": 50,
        "score|1-100": 100,
        "no": /\d{2}/,
        "date": "2017-09-18"
      }],
      "grade|1-10": 10,
      "gradeNum|1-50": 50,
      "gradeMax": 100,
      "medalNum|1-50": 50,
      "medalMax": 100,
      "minAge|1-18": 18,
      "maxAge|19-50": 50,
      "descrption": Random.cparagraph(),
      "leader": "lll"
    })

    return result
  })
  // 修改小组资料, 更新小组
  .mock(/group/, function() {
    return {
      "data ": null,
    }
  })
  // 邀请好友
  .mock(/inviteFriends/, function() {
    return {
      "data ": null,
    }
  })
  // 设置小组
  .mock(/groupSetting/, function() {
    return {
      "data ": null,
    }
  })
  // 获取麦田计划
  .mock(/getPlan/, function() {
    return {
      "data ": null,
    }
  })
  // 获取问卷信息
  .mock(/getQuestionnaire/, function() {
    return {
      "data ": null,
    }
  })
  // 提交问卷
  .mock(/answerQuestionnaire/, function() {
    return {
      "data ": null,
    }
  })