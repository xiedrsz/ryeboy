# /login
用户登录

## POST
+ Request (application/json)

    + Schema

            {
                "account": {
                    "description": "帐号可以是邮箱或者用户名",
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }

    + Example
    
            {
                "account": "xj15",
                "password": "111111"
            }
            
+ Response 200 (application/json)

    + Schema

            {
                "error": {
                    "description": "该属性仅在登录失败存在",
                    "type": "string"
                },
                "user": {
                    "description": "该属性仅在登录成功存在",
                    "type": "object",
                    "properties": {
                        "sessionToken": {
                            "type": "string"
                        },
                        "id": {
                            "type": "string"
                        },
                        "username": {
                            "type": "string"
                        },
                        "nickname": {
                            "type": "string"
                        }
                    }
                }
            }

    + Example
    
        登录成功

            {
                "error": "",
                "user": {
                    "sessionToken": "doJ/h+5ELy5B/sd2yOU0JQ==",
                    "id": "56ecdd7c816dfa0052e3d5d5",
                    "username": "xj15",
                    "nickname": "测试",
                }
            }

        登录失败

            {
                "error": "Incorrect password."
            }
            

# /logout
用户退出登录

## POST
+ Request (application/json)

    + Schema

            {
                "userid": {
                    "type": "string"
                }
            }

    + Example
    
            {
                "userid": "56ecdd7c816dfa0052e3d5d5"
            }
            
+ Response

    服务端删除对应用户的授权令牌，成功返回 200，错误返回 400。    


# /getUsers
获取一些用户基本信息

## POST
+ Request (application/json)

    + Schema

            {
                "users": {
                    "type": "array"
                }
            }

    + Example
    
            {
                "users": ["56ecdd7c816dfa0052e3d5d5", "57f2e3fa59ea72d1f09b578c", "57158aedd7baf14a7069f8bf"]
            }
            
+ Response 200 (application/json)

    + Schema

            [
                {
                    "_id": {
                        "type": "string"
                    },
                    "username": {
                        "type": "string"
                    },
                    "portrait": {
                        "description": "用户头像，如果用户没有设置则不存在该字段",
                        "type": "string"
                    },
                    "nickname": {
                        "description": "用户昵称，如果用户没有设置则不存在该字段",
                        "type": "string"
                    },
                    "grade": {
                        "type": "object",
                        "properties": {
                            "lv": {
                                "type": "number"
                            },
                            "exp": {
                                "type": "number"
                            }
                        }
                    }
                },
                ...
            ]

    + Example

            [ 
                { 
                    _id: 56e4d40d731956005ce0156a,
                    username: '学长土豆',
                    portrait: '2',
                    nickname: '学长土豆',
                    grade: { lv: 41, exp: 51576 } },
                { 
                    _id: 57de3d98e7fc680048e99181,
                    username: '时光胶囊',
                    portrait: '1',
                    grade: { lv: 34, exp: 26145 } },
                { 
                    _id: 57f4ec0059ea72d1f09b5890,
                    username: '525970850',
                    nickname: '杨花落尽杨柳岸',
                    grade: { lv: 29, exp: 17644 },
                    portrait: '1' 
                }
            ]


# /getDiaries
获取日记列表

## POST
+ Request (application/json)

    + Schema

            {
                "label": {
                    "description": "日记频道关键字，由后台定义，比如全部为 default",
                    "type": "string"
                },
                "filter": {
                    "description": "日记频道过滤方案英文标识，比如推荐为 recommend，最冷为 cold",
                    "type": "string"
                },
                "last": {
                    "description": "获取更多日记时使用，是上次获取的日记列表最后一项的某个属性，一般是时间，具体由查询算法决定",
                    "type": "string"
                }
            }

    + Example
    
            {
                label: "default",
                filter: "recommend",
                last: "2017-02-05T12:11:04.847Z",
            }
            
+ Response 200 (application/json)

    + Schema

            [
                {
                    "_id": {
                        "type": "string"
                    },
                    "userid": {
                        "type": "string"
                    },
                    "date": {
                        "type": "date"
                    },
                    "text": {
                        "type": "string"
                    },
                    "privacy": {
                        "type": "number"
                    },
                    "createdAt": {
                        "type": "date"
                    },
                    "updatedAt": {
                        "type": "date"
                    },
                    "userLv": {
                        "type": "number"
                    },
                    "likeCount": {
                        "description": "日记点赞数量",
                        "type": "number"
                    },
                    "commentCount": {
                        "description": "日记评论数量",
                        "type": "number"
                    },
                },
                ...
            ]

    + Example

            [ 
                { 
                    _id: 589b30c6a3335154090e1682,
                    userid: '588056609a469177ac5302e7',
                    date: 2017-02-08T00:00:00.000Z,
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
                }
            ]


# /getSubscribedChannels
获取订阅的频道

## GET
+ Request (application/json)

    + Schema

            {
                "userid": {
                    "type": "string"
                } 
            }

    + Example
    
            {
                userid: "587c44479a469177ac52ff8f" 
            }
            
+ Response 200 (application/json)

    + Schema

            [
                {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    } 
                },
                ...
            ]

    + Example

            [ 
                {
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
                }
            ]


# /getRecommendedChannels
获取后台推荐的频道（用户可订阅的全部频道）

## GET
+ Request (无参数)

+ Response 200 (application/json)

    + Schema

            [
                {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    } 
                },
                ...
            ]

    + Example

            [ 
                {
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
                }
            ]


# /setSubscribedChannels
更新订阅的频道

## POST
+ Request (application/json)

    + Schema

            {
                "userid": {
                    "type": "string"
                },
                "channels": {
                    "description": "添加、删除、排序后的频道",
                    "type": "array"
                }
            }

    + Example
    
            {
                userid: "587c44479a469177ac52ff8f",
                channels: [
                    {
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
                    }
                ]
            }
            
+ Response 200 (application/json)

    成功返回 200，错误返回 400。