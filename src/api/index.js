import axios from "axios";
import config from "js/config";
// 引入 mocks
//import "../../mocks"

axios.defaults.baseURL = config.apiAddress;

axios.defaults.headers = {
  'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NjQyM2I5MGMwMzdjMGZjYzkzZmE1YyIsImlhdCI6MTQ5OTc0MTQxNX0.MnvVwdCktpy3vKGmXMnQvUBIgJe4IJZvkmW58uoBwOY',
  Accept: 'application/json'
};

class api {
  static getLessonDetail(id) {
    return axios.get("/getLessonDetail", {
      params: {
        id
      }
    });
  }

  static getUser(userid) {
    return axios.get(`/users/${userid}`);
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
    return axios.get("/labels")
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
  static subscrible(id) {
    return axios.post("/subscrible", {
      id: id
    })
  }

  // 获取频道列表
  static getLabels() {
    return axios.get("/labels")
  }

  // 获取小组列表, T
  static getGroups(name) {
    return axios.get("/groups", {
      params: {
        name: ""
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
  static getMembers(group_id) {
    return axios.get(`/group/${group_id}/members`)
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
  static getGroupDiaries(id) {
    return axios.get(`/group/${id}/diaries`)
  }

  // 获取小组资料, T
  static getGroupInfo(group_id) {
    return axios.get(`/group/${group_id}`)
  }

  // 修改小组资料, 更新小组, T
  static saveGroupInfo(groupInfo) {
    let group_id = groupInfo._id;
    return axios.post(`/group/${group_id}`, groupInfo)
  }

  // 邀请好友, T
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

export default api;