var Mock = require('mockjs')

Mock
// 获取 关注、粉丝 数目
  .mock(/getFansNum/, function() {
	  return {
	    "data": null,
	    "datas": {
	    	"concernNum":50,
	    	"fanNum":30
	    },
	    "status": 200,
	    "statusText": null
	  }
	})  
//获取 日记发布者的头像、用户名，日记内容、发布时间、点赞的数量，评论的数量、标签，用户是否已点赞
  .mock(/getDynamicDiaries/,function(){
  	return {
  		"data": null,
  		"datas": [{
  			"authorAvater":'',
  			"authorName":'草莓LV6',
  			"content":'4月有23个城市新建商品住宅价格环比涨幅比上月回落，比3月增加13个，7个城市由上月上涨转为持平或下降，3个城市降幅扩大',
  			"time":'1495162972222',
  			"goodNum":'20',
  			"commentNum":'20',
  			"lable":['国际','社会','教育'],
  			"isGood":true
  		}],
  		"status":200,
  		"statusText":null
  	}
  })

//获取已关注的用户总数，关注用户上限，用户头像，用户名，是否取消关注
 .mock(/getConcerns/,function(){
	return {
	    "data": null,
	    "datas": {    	
	    },
	    "status": 200,
	    "statusText": null
	}
 })

//获取粉丝总数，粉丝头像，用户名，粉丝ID号，点击头像进入个人页面
 .mock(/getFans/,function(){
	return {
	    "data": null,
	    "datas": {    	
	    },
	    "status": 200,
	    "statusText": null
	}
 })

 //获取符合条件的用户头像，用户名，ID号，是否关注，已关注的数量，推举关注总数量
  .mock(/addConcern/,function(){
	return {
	    "data": null,
	    "datas": {    	
	    },
	    "status": 200,
	    "statusText": null
	}
 })