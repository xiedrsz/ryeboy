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
                    "description": "指示登录成功或失败",
                    "type": "string",
                    "values": {
                        "": "登录成功",
                        "User not found.": "用户名不存在",
                        "Incorrect password.": "密码错误"
                    }
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
            