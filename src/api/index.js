import config from "js/config";
import qs from "qs";
// 引入 mocks
//import "../../mocks"

axios.defaults.baseURL = config.apiAddress;
axios.defaults.headers["Accept"] = "application/json";

class api {
  static getWechatUserInfo(access_token, openid) {
    return axios.get("https://api.weixin.qq.com/sns/userinfo", {
      params: {
        access_token,
        openid
      }
    });
  }

  static getWechatAccessToken(code) {
    return axios.get("/getWechatAccessToken", {
      params: {
        code,
      }
    });
  }

  static ssoLogin(userid, platform, nickname) {
    return axios.post("/ssoLogin", {
      userid,
      platform,
      nickname
    });
  }

  static getAllLabels() {
    return axios.get("diary/getAllLabels");
  }

  static getNewMessageCount(userid, fetchTime) {
    return axios.get("/users/newMessageCount", {
      params: {
        userid,
        fetchTime
      }
    });
  }

  static getServerConfig(userid) {
    return axios.get("/config", {
      params: {
        userid
      }
    });
  }

  static getSearch(keyword, type) {
    return axios.get("search/keyword", {
      params: {
        keyword,
        type
      }
    });
  }

  static getAnswer(id) {
    return axios.get("search/getAnswer", {
      params: {
        id
      }
    });
  }

  static getAnswers(type, last) {
    return axios.get("search/getAnswers", {
      params: {
        type,
        last
      }
    });
  }

  static getAnswerTypes() {
    return axios.get("search/getAnswerTypes");
  }

  static getRecommendAnswers() {
    return axios.get("search/getRecommendAnswers");
  }

  static feedback(content, email, userid) {
    return axios.post("diary/feedback", {
      content,
      email,
      userid
    });
  }

  static updateUserInfo(id, name, content) {
    return axios.post("users/updateInfo", {
      id,
      name,
      content
    });
  }

  static getUserInfo(id) {
    return axios.get("users/info", {
      params: {
        id
      }
    });
  }

  static getUserStatus(id) {
    return axios.get("users/status", {
      params: {
        id
      }
    });
  }

  static getUserCards(id) {
    return axios.get("users/cards", {
      params: {
        id
      }
    });
  }

  static getPublishedDates(userid) {
    return axios.get("diary/publishedDates", {
      params: {
        userid
      }
    });
  }

  static getFavorites(userid, last) {
    return axios.get("/getFavorites", {
      params: {
        userid,
        last
      }
    });
  }

  static setFavorite(id, userid) {
    return axios.post("/setFavorite", {
      id,
      userid,
      type: 1
    });
  }

  static getLikes(id, last) {
    return axios.get(`/diary/likes/${id}`, {
      params: {
        last
      }
    });
  }

  static setLike(id, userid) {
    return axios.post(`/diary/like/${id}`, {
      userid
    });
  }

  static getNotices(userid, type, last) {
    return axios.get("/notices", {
      params: {
        userid,
        type,
        last
      }
    });
  }

  static getPersonalDiaries(id, userid, last, filter, data) {
    return axios.get("/diary/personal", {
      params: {
        id,
        userid,
        last,
        filter,
        data
      }
    });
  }

  static addDiaryComment(id, comment) {
    return axios.post("/diary/addComment", {
      id,
      comment
    });
  }

  static getMoreDiaryComments(id, last) {
    return axios.get(`/diary/${id}/more-comments/${last}`);
  }

  static getDiaryComments(id) {
    return axios.get(`/diary/${id}/comments`);
  }

  static getDiary(id, userid) {
    return axios.get(`/diary/${id}`, {
      params: {
        userid,
      }
    });
  }

  static getLesson(userid, date) {
    return axios.get("/diary/getLesson", {
      params: {
        userid,
        date
      }
    });
  }

  static publishLesson(data) {
    return axios.post("/diary/publishLesson", data);
  }

  static getLessonDetail(id) {
    return axios.get("/diary/getLessonDetail", {
      params: {
        id
      }
    });
  }

  static getUser(userid) {
    return axios.get(`/users/${userid}`);
  }

  static getActivatedChannels() {
    return axios.get("/diary/getActivatedChannels");
  }

  static setUserChannels(userid, data) {
    return axios.post("/diary/setUserChannels", {
      userid,
      data
    });
  }

  static getUserChannels(userid) {
    return axios.get("/diary/getUserChannels", {
      params: {
        userid
      }
    });
  }

  static register(account, password) {
    return axios.post("/register", {
      account,
      password
    });
  }

  static login(account, password) {
    return axios.post("/authenticate", {
      account,
      password
    });
  }

  static logout() {
    // return axios.post("/logout");
  }

  static getDiaries(label, filter, last, userid) {
    return axios.get("/diaries", {
      params: {
        label,
        filter,
        last,
        userid
      }
    });
  }

  static getUsers(users) {
    return axios.get("/users/many", {
      params: {
        users
      }
    });
  }

  static setAuthorization() {
    axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.jwt}`;
  }

  static delay(timeout) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }

  // 获取 关注、粉丝 数目, T
  static getFansNum() {
    return axios.get("/relation-status");
  }

  //动态日记接口, T
  static getDynamicDiaries(last = 0) {
    return axios.get("/user-diaries", {
      params: {
        followed: 1,
        last
      }
    });
  }

  // 获取关注人, T
  static getConcerns() {
    return axios.get("/followees")
  }

  // 获取粉丝, T
  static getFans() {
    return axios.get("/followers")
  }

  // 获取新关注人/换一批, T
  static getNewConcern() {
    return axios.get("/recommended-users")
  }

  // 关注, T
  static concern(userid) {
    return axios.post(`/follow/${userid}`)
  }

  // 取消关注, T
  static cancelConcern(userid) {
    return axios.post(`/unfollow/${userid}`)
  }

  // 点赞, T
  static like(diary_id) {
    return axios.post(`/diary/${diary_id}/like`)
  }

  // 评论, T
  static comment(diary_id) {
    return axios.post(`/diary/${diary_id}/comment`)
  }

  // 获取订阅列表
  static getSubscribles() {
    return axios.get("/subscribed-channels")
  }

  // 获取订阅频道内容
  static getSubChannels(channel_id) {
    return axios.get("/diaries", {
      channel_id: channel_id
    })
  }

  // 退订
  // 可一次退订多个
  static unsubscribe(id) {
    return axios.post("/unsubscribe", {
      ids: [id]
    })
  }

  // 订阅
  static subscribe(id) {
    return axios.post("/subscribe", {
      ids: [id]
    })
  }

  // 获取频道列表
  static getLabels() {
    return axios.get("/labels")
  }

  // 获取小组列表, 貌似没有按名字查询的, name
  static getGroups(filter, last) {
    return axios.get("/groups", {
      params: {
        filter,
        last
      }
    })
  }

  // 加入小组, T
  static addGroup(id, userid) {
    return axios.post(`/group/${id}/apply`, {
      userid
    })
  }

  // 查找小组
  static searchGroup(name) {
    return axios.get("/groups", {
      params: {
        name
      }
    })
  }

  // 创建小组
  static createGroup(group) {
    return axios.post("/groups", {
      group
    })
  }

  // 获取小组成员, T
  static getMembers(group_id, orderBy = 'date ASC') {
    return axios.get(`/group/${group_id}/members`, {
      params: {
        sortBy: orderBy
      }
    })
  }

  // 清退成员, T
  static expellMember(group_id, user_id) {
    return axios.post(`/group/${group_id}/remove-member/${user_id}`)
  }

  // 获取申请列表, T
  static getApplys(group_id) {
    return axios.get(`/group/${group_id}/pending-members`)
  }

  // 同意申请, 小组管理员通过用户申请, T
  static agreeApply(group_id, userid) {
    return axios.post(`/group/${group_id}/process-applicant/approve/${userid}`)
  }

  // 拒绝申请, T
  static rejectApply(group_id, userid) {
    return axios.post(`/group/${group_id}/process-applicant/reject/${userid}`)
  }

  // 根据id获取对应小组的成员日记, T
  static getGroupDiaries(id, filter, last) {
    return axios.get(`/group/${id}/diaries`, {
      params: {
        filter,
        last
      }
    })
  }

  // 获取小组资料, T
  static getGroupInfo(group_id) {
    return axios.get(`/group/${group_id}`)
  }

  // 修改小组资料, 更新小组, T
  static saveGroupInfo(groupInfo) {
    let group_id = groupInfo._id;
    return axios.post(`/group/${group_id}`, {
      group: groupInfo
    })
  }

  // 邀请好友, T
  static inviteFriends(group_id, userid) {
    return axios.get(`/group/${group_id}/invite/${userid}`)
  }

  // 设置小组
  static groupSetting(group_id) {
    return axios.post(`/group/${group_id}`)
  }

  // 上传图片
  static uploadImage(file) {
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData();
    formData.append('file', file);

    return axios.post('/assets/uploadImage', formData, config);
  }

  // 获取麦田计划
  static getPlan() {
    return axios.get("/getPlan")
  }

  // 获取问卷信息
  static getQuestionnaire() {
    return axios.get("/getQuestionnaire")
  }

  // 提交问卷
  static answerQuestionnaire() {
    return axios.get("/answerQuestionnaire")
  }
}

export default api;