<template>
  <li class="item-container">
    <div class="item-avatar">
      <img :data-src="avatar"
           class="lazyload" />
    </div>
    <div class="item-content">
      <div class="item-name">{{ username }}</div>
      <div class="text" :class="{fulltext:!fulltext}"
           v-html="text" ref="text">{{ text }}</div>
      <div class="showfull" v-show="overflow" @click="isshowfull" v-html="fulltext ? '收起' : '全文'"></div>
      <div class="comment">
        <div>{{ time }}</div>
        <div class="mdl-layout-spacer" />
        <div class="counts">
          <i class="material-icons md-16"  @click="likeItChange" v-html="likeItCom ? 'favorite' : 'favorite_border'" :class="{'like-it':likeItCom}"></i><span style="margin-right: 24px">{{ likeCount }}</span>
          <i class="material-icons md-16" @click="commentIt">comment</i><span>{{ commentCount }}</span>
        </div>
      </div>
      <div class="item-lable">
        <span>案例</span>
        <span>尿频</span>
        <span>痘痘</span>
      </div>
      <popue-comment :showPopue="isComment" @changeval="changeShowPopue"></popue-comment>
    </div>
  </li>
</template>
<script>
  export default {
    props: {
      username: String,
      avatar: String,
      text: String,
      time: String,
      likeCount: {
        type: Number,
        default: 0
      },
      commentCount: {
        type: Number,
        default: 0
      },
      overflow:Boolean,
      likeIt: Boolean,
      index: Number
    },
    data(){
      return {
        fulltext: false,
        showfull: false,
        isComment: false,
        likeItCom: this.likeIt
      }
    },
    computed:{
      
    },
    methods:{
      isshowfull(){
        this.fulltext = !this.fulltext
      },
      likeItChange(){
        this.likeItCom = !this.likeItCom
        this.likeItCom ? this.$store.dispatch('getLike',{"index":this.index,"val":1}) : this.$store.dispatch('getLike',{"index":this.index,"val":-1})
      },
      commentIt(){
        this.isComment = !this.isComment
        console.log(this.isComment)
      },
      changeShowPopue(){
        this.commentIt()
        console.log(this.isComment)
      }
    },
    components:{
      "popue-comment": require("ui/popue-comment.vue")
    }
  }
</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.item-container {
  @include flex-row;
  padding: 10px 16px;
  background: #fff;
  margin-bottom: 10px;
}

.item-avatar {
  background: white;
  width: 40px;
  height: 40px;
  border: 1px solid $color-divider;
  border-radius: 50%;
}

.item-avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.item-content {
  margin-left: 16px;
  font-size: 16px;
  width: 100%;
}
.full-text{
    visibility: hidden;
/*     position: fixed;
    top: 0;
    left: 0; */
    z-index: -999;
}
.showfull{
  font-size:12px;
  line-height:18px;
}
.item-name,.showfull{
  color:$color-blue;
}
.text {
  color: $color-secondary-text;
  margin-top: 8px;
  line-height: 20px;
}
.fulltext {
    position: relative;
  overflow: hidden;
  max-height: 60px;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.comment {
  @include flex-row;
  margin-top: 8px;
  font-size: 12px;
  color: $color-hint-text;
}

.right {
  text-align: right;
}

.counts {
  @include flex-row;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.counts span {
  margin-left: 4px;
}

.lazyload,
.lazyloading {
  opacity: 0;
}

.lazyloaded {
  opacity: 1;
  transition: opacity 300ms;
}
.item-lable span{  
    display: inline-block;     
    border: 1px solid #e5e5e5;
    padding: 2px 5px;
    border-radius: 6px;
    line-height: 1; 
    font-size: 12px;
    color: #a5a5a5;     
}
.material-icons.like-it{
  color:$color-red;
}
/*   .dynamic-list {
    padding: 16px;
    display: flex;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    .dynamic-avater {
      width: 36px;
      height: 36px;
      font-size: 0;
      margin-right: 12px;
      img {
        background-size: cover;
      }
    }
    .dynamic_name {
      color: #00aaee;
    }
    .dynamic_summary {
      height: 3em;
      overflow: hidden;
      margin: 0 0 10px;
    }
    .dynamic_footer {
      display: flex;
      justify-content: space-between;
      .icon {
        display: inline-block;
        content: "";
        width: 12px;
        height: 12px;
        background-size: cover;
      }
      .ungood {
        background-image: url('/img/photo_heart.png')
      }
      .good {
        background-image: url('/img/photo_hearted.png')
      }
      .hasReaded {
        background-image: url('/img/photo_note.png')
      }
    }
    .dynamic_lable {
      span {
        border: 1px solid #e5e5e5;
        padding: 2px 5px;
        border-radius: 6px;
        line-height: 1;
        display: inline-block;
      }
    }
  } */
</style>