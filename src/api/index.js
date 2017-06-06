import axios from "axios";
import config from "js/config";
// 引入 mocks
import "../../mocks"

axios.defaults.baseURL = config.apiAddress;

class api {
  static getLessonDetail(id) {
    return axios.get("/getLessonDetail", {
      params: {
        id
      }
    });
  }

  static getUser(userid) {
    return axios.get("/getUser", {
      params: {
        userid
      }
    });
  }

  static getRecommendedChannels() {
    return axios.get("/getRecommendedChannels");
  }

  static setSubscribedChannels(userid, channels) {
    return axios.post("/setSubscribedChannels", {
      userid,
      channels
    });
  }

  static getSubscribedChannels(userid) {
    return axios.get("/getSubscribedChannels", {
      params: {
        userid
      }
    });
  }

  static login(account, password) {
    return axios.post("/login", {
      account,
      password
    });
  }

  static logout() {
    return axios.post("/logout");
  }

  static getDiaries(label, filter, last) {
    return axios.post("/getDiaries", {
      label,
      filter,
      last
    });
  }

  static getUsers(users) {
    return axios.post("/getUsers", {
      users
    });
  }

  // 获取 关注、粉丝 数目, T
  static getFansNum() {
    return axios.get("/getFansNum");
  }

  //动态日记接口, T
  static getDynamicDiaries() {
    return axios.get("/getDynamicDiaries");
  }

  // 获取关注人, T
  static getConcerns() {
    return axios.get("/getConcerns")
  }

  // 获取粉丝, T
  static getFans() {
    return axios.get("/getFans")
  }

  // 获取新关注人/换一批, T
  static getNewConcern() {
    return axios.get("/getNewConcern")
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
    return axios.get("/getSubscribles")
  }

  // 获取订阅频道内容
  static getSubChannels(channel_id) {
    return axios.get("/diaries", {
      channel_id: channel_id
    })
  }

  // 退订
  // 可一次退订多个
  static unsubscribe(channel_ids) {
    return axios.post("/unsubscribe", {
      channel_ids: channel_ids
    })
  }

  // 添加订阅频道
  static addSubscrible(channel_ids) {
    return axios.post("/subscribe", {
      channel_ids: channel_ids
    })
  }

  // 获取小组列表
  static getGroups(name) {
    return axios.get("/groups", {
      params: {
        name
      }
    })
  }

  // 加入小组
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
  static createGroup(name, agejange, descrption) {
    return axios.post("/groups", {
      name,
      agejange,
      descrption
    })
  }

  // 获取小组成员
  static getMembers(group_id) {
    return axios.get(`/group/${group_id}/members`)
  }

  // 获取申请列表
  static getApplys(group_id) {
    return axios.get(`/group/${group_id}/pending_members`)
  }

  // 同意申请, 小组管理员通过用户申请
  static agreeApply(id, userid) {
    return axios.post(`/group/${id}/approve`, {
      userid
    })
  }

  // 拒绝申请
  // userid 表示被拒绝的申请人
  static rejectApply(group_id, userid) {
    return axios.get(`/group/${group_id}/reject/${userid}`)
  }

  // 获取小组消息, 根据id获取对应小组的成员日记
  static getGroupNews(id) {
    return axios.get(`/group/${id}/diaries`)
  }

  // 获取小组资料
  static getGroupInfo(group_id) {
    return axios.get(`/group/${group_id}`)
  }

  // 修改小组资料, 更新小组
  static saveGroupInfo(groupInfo) {
    let group_id = groupInfo.id;
    return axios.post(`/group/${group_id}`, groupInfo)
  }

  // 邀请好友
  static inviteFriends(group_id, userid) {
    return axios.get(`/group/${group_id}/invite/${userid}`)
  }

  // 设置小组
  static groupSetting(group_id) {
    return axios.post(`/group/${group_id}`)
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

// 暂时暴露到全局
window.api = api;

export default api;