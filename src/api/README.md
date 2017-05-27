# 目录

| **URL** | **HTTPS** | **功能** |
| :--- | :--- | :--- |
| /login | POST | [用户登录](#user-content-yong-hu-deng-lu) |
| /logout | POST | [用户退出登录](#user-content-yong-hu-tui-chu-deng-lu) |
| /getUsers | POST | [获取一组用户的基本信息](#user-content-huo-qu--zu-yong-hu-de-ji-ben-xin-xi) |
| /getUser | GET | [获取一个用户的基本信息](#user-content-huo-qu--ge-yong-hu-de-ji-ben-xin-xi) |
| /getDiaries | POST | [获取日记列表](#user-content-huo-qu-ri-ji-lie-biao) |
| /getSubscribedChannels | GET | [获取订阅的频道](#user-content-huo-qu-ding-yue-de-pin-dao) |
| /getRecommendedChannels | GET | [获取推荐的频道](#user-content-huo-qu-tui-jian-de-pin-dao) |
| /setSubscribedChannels | POST | [更新订阅的频道](#user-content-geng-xin-ding-yue-de-pin-dao) |
| /getLessonDetail | GET | 获取功课详情 |
| /publishLesson | POST | 用户发布功课 |
| /getLesson | GET | 获取用户某天的功课记录 |
| /getDiary | GET | 获取日记详情 |
| /getDiaryComments | GET | 获取日记评论 |
| /getMoreDiaryComments | GET | 获取更多日记评论 |

# 用户登录

**POST /login**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| account | string | 帐号可以是邮箱或者用户名 |
| password | string | HTTPS下的POST是加密传输的，所以密码可以原文发送 |

**请求示例**

```
{
    "account": "xj15",
    "password": "111111"
}
```

**返回**

登录成功  
status: 200 OK


```
{
    "error": "",
    "user": {
        "sessionToken": "doJ/h+5ELy5B/sd2yOU0JQ==",
        "id": "56ecdd7c816dfa0052e3d5d5",
        "username": "xj15",
        "nickname": "测试",
    }
}
```

登录失败  
status: 200 OK


```
{
    "error": "Incorrect password."
}
```

# 用户退出登录

**POST /logout**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |

**请求示例**

```
{
    "userid": "56ecdd7c816dfa0052e3d5d5"
}
```

**返回**

status: 200 OK

# 获取一组用户的基本信息

**POST /getUsers**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| users | array |  |

**请求示例**

```
{
    "users": ["56ecdd7c816dfa0052e3d5d5", "57f2e3fa59ea72d1f09b578c", "57158aedd7baf14a7069f8bf"]
}
```

**返回**

获取成功  
status: 200 OK


```
[{
    _id: 56ecdd7c816dfa0052e3d5d5,
    username: '学长土豆',
    portrait: '2',
    nickname: '学长土豆',
    grade: {
        lv: 41,
        exp: 51576
    }
},
{
    _id: 57f2e3fa59ea72d1f09b578c,
    username: '时光胶囊',
    portrait: '1',
    grade: {
        lv: 34,
        exp: 26145
    }
},
{
    _id: 57158aedd7baf14a7069f8bf,
    username: '525970850',
    nickname: '杨花落尽杨柳岸',
    grade: {
        lv: 29,
        exp: 17644
    },
    portrait: '1'
}]
```

| **需要注意的字段** | **说明** |
| :--- | :--- |
| portrait | 用户的头像，如果用户没有设置则不存在该字段 |
| nickname | 用户昵称，如果用户没有设置则不存在该字段 |

如果任意一个用户不存在  
status: 404 Not Found


# 获取一个用户的基本信息

**GET /getUser**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |

**请求示例**

```
{
    "userid": "56ecdd7c816dfa0052e3d5d5"
}
```

**返回**

获取成功  
status: 200 OK


```
{
    _id: 56ecdd7c816dfa0052e3d5d5,
    username: '学长土豆',
    portrait: '2',
    nickname: '学长土豆',
    grade: {
        lv: 41,
        exp: 51576
    }
}
```

如果用户不存在  
status: 404 Not Found


# 获取日记列表

**POST /getDiaries**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| label | string | 日记频道关键字，由后台定义，比如全部为 default |
| filter | string | 日记频道过滤方案英文标识，比如推荐为 recommend，最冷为 cold |
| last | string | 获取更多日记时使用，是上次获取的日记列表最后一项的某个属性，一般是时间，具体由查询算法决定 |

**请求示例**

```
{
    label: "default",
    filter: "recommend",
    last: "2017-02-05T12:11:04.847Z",
}
```

**返回**

获取成功  
status: 200 OK


```
[{
    _id: 589b30c6a3335154090e1682,
    userid: '588056609a469177ac5302e7',
    date: 2017-02-08T00: 00 : 00.000Z,
    text: '刚才尝试了一下完整的麦式一段，麦式运动了不得啊，做的时候感觉整个泌尿系统都在活动，睾丸处能感受到明显的血液流动的感觉，做完神清气爽，口齿生津，照镜子观察自己好像变帅了一点点，哈哈',
    privacy: 0,
    createdAt: 2017-02-08T14:52:54.378Z,
    updatedAt: 2017-02-09T16:21:07.063Z,
    userLv: 3,
    likeCount: 10,
    commentCount: 45
},
{
    _id: 589b06aba3335154090df654,
    userid: '585f734f7236a860e8002102',
    date: 2017-02-08T00:00:00.000Z,
    text: '一会儿她好像让我想起了一丝丝祝福篇，顿时惊醒了，幸好有祝福篇的帮助，祝福陌生人，自己的心胸也逐渐开阔了，今后也应该继续把这一项坚持下来\n\n从今天开始，每天除了麦式五段，麦八争取做5组以上，四季之春，正好苏醒，种下些许梦想，等 待秋收！看到更多的蜕变案例，方知，行动才变化的源泉！\n\n晚安，麦田！',
    privacy: 0,
    createdAt: 2017-02-08T11:53:15.969Z,
    updatedAt: 2017-02-09T17:29:38.976Z,
    userLv: 18,
    likeCount: 5,
    commentCount: 65
},
{
    _id: 589ab89aa3335154090de74b,
    userid: '587c44479a469177ac52ff8f',
    date: 2017-02-08T00:00:00.000Z,
    text: '坚持麦式中，感觉脑子清楚多了，生活也感觉慢慢的充实，不管是心理作用还 是确确实实的恢复，为自己加油！',
    privacy: 0,
    createdAt: 2017-02-08T06:20:10.877Z,
    updatedAt: 2017-02-09T14:39:32.760Z,
    userLv: 7,
    likeCount: 1,
    commentCount: 6
}]
```

| **需要注意的字段** | **说明** |
| :--- | :--- |
| likeCount | 日记点赞数量 |
| commentCount | 日记评论数量 |

# 获取订阅的频道

**GET /getSubscribedChannels**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |

**请求示例**

```
{
    userid: "587c44479a469177ac52ff8f"
}
```

**返回**

获取成功  
status: 200 OK


```
[{
    id: "tbs",
    name: "蜕变史"
},
{
    id: "ms",
    name: "麦式"
},
{
    id: "ys",
    name: "饮食"
},
{
    id: "zx",
    name: "作息"
},
{
    id: "xl",
    name: "心理"
}]
```

# 获取推荐的频道

这些推荐频道由后台进行管理，将由用户在管理订阅频道时全部显示出来。

**GET /getRecommendedChannels**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| 无 |  |  |

**返回**

获取成功  
status: 200 OK


```
[{
    id: "tbs",
    name: "蜕变史"
},
{
    id: "ms",
    name: "麦式"
},
{
    id: "ys",
    name: "饮食"
},
{
    id: "zx",
    name: "作息"
},
{
    id: "xl",
    name: "心理"
},
{
    id: "qlxy",
    name: "前列腺炎"
},
{
    id: "yj",
    name: "遗精"
}]
```

# 更新订阅的频道

用户在管理频道页面对频道进行排序、添加、删除等操作，然后提交到后台存储。  
排序后的频道列表由前端给出。

**POST /setSubscribedChannels**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |
| channels | array | 添加、删除、排序后的频道 |

**请求示例**

```
{
    userid: "587c44479a469177ac52ff8f",
    channels: [{
        id: "ms",
        name: "麦式"
    },
    {
        id: "tbs",
        name: "蜕变史"
    },
    {
        id: "ys",
        name: "饮食"
    },
    {
        id: "zx",
        name: "作息"
    },
    {
        id: "xl",
        name: "心理"
    },
    {
        id: "yj",
        name: "遗精"
    }]
}
```

**返回**

status: 200 OK

# 获取功课详情

**GET /getLessonDetail**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| id | string | 功课标识 |

**请求示例**

```
{
    id: "304" 
}
```

**返回**

获取成功  
status: 200 OK

```
{
    tutorial: "<p>教程内容</p><br>",
    faq: "老男孩：做麦式的时候……"
}
```

| **需要注意的字段** | **说明** |
| :--- | :--- |
| tutorial | 功课教程，由后台编辑，HTML编辑器 |
| faq | 常见问答，纯文本，由后台编辑 |

# 用户发布功课

**GET /publishLesson**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |
| checkedCards | array | 勾选的功课列表 |
| time | string | 功课日期 |
| text | string | 日记内容 |
| expectedExp | number | 做功课获得的成长值 |
| privacy | number | 隐私 |

**请求示例**

```
{
    userid: "56ecdd7c816dfa0052e3d5d5",
    checkedCards: ["100", "304", "401"],
    time: "2017-05-25T00:00:00.000Z",
    text: "test",
    expectedExp: 0,
    privacy: 0
}
```

**返回**

发布成功  
status: 200 OK

# 获取用户某天的功课记录

**GET /getLesson**

| **参数** | **类型** | **说明** |
| :--- | :--- | :--- |
| userid | string |  |
| date | string | 功课日期 |

**请求示例**

```
{
    userid: "56ecdd7c816dfa0052e3d5d5",
    date: "2017-05-25T00:00:00.000Z"
}
```

**返回**

获取成功  
status: 200 OK

```
{
    checkedCards: ["100", "304", "401"],
    text: "test"
}
```