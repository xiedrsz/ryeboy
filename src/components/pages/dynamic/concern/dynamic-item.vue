<template>
  <li class="item-container">
    <div class="item-avatar">
      <img :data-src="item.avatar" class="lazyload" />
    </div>
    <div class="item-content">
      <div class="item-name">{{ item.username }}</div>
      <div class="text" :class="{fulltext:!fulltext}" ref="text">{{ item.escapedText }}</div>
      <div class="showfull" v-show="item.overflow" @click="fulltext=!fulltext">{{fulltext ? '收起' : '全文'}}</div>
      <div class="comment">
        <div>{{ item.time | time }}</div>
        <div class="mdl-layout-spacer" />
        <div class="counts">
          <i class="material-icons md-16" @click="like" v-html="item.likeIt ? 'favorite' : 'favorite_border'" :class="{'like-it':item.likeIt}"></i>
          <span style="margin-right: 24px">{{ item.likeCount }}</span>
          <i class="material-icons md-16" @click="isComment=!isComment">comment</i>
          <span>{{ item.commentCount }}</span>
        </div>
      </div>
      <div class="item-lable">
        <span>案例</span>
        <span>尿频</span>
        <span>痘痘</span>
      </div>
      <popue-comment :showPopue="isComment" @changeval="comment"></popue-comment>
    </div>
  </li>
</template>
<script>
  export default {
    props: {
      detail: {
        type: Object,
        default () {
          return {
            avatar: "/img/default-avatar.png",
            username: "abc",
            likeCount: 10,
            commentCount: 10,
            text: "abcdefg",
            time: "2月8日 22:56",
            overflow: false,
            likeIt: false
          }
        }
      }
    },
    data() {
      return {
        isComment: false,
        overflow: false,
        fulltext: false
      }
    },
    computed: {
      item() {
        return this.detail
      }
    },
    methods: {
      like() {
          !this.item.likeIt && this.$emit('like', this.item.likeCount);
        },
        comment(option) {
          this.isComment = !this.isComment;
          option.type && !!option.mess && (option.commentCount = this.item.commentCount, this.$emit('comment', option));
        }
    },
    components: {
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
  
  .full-text {
    visibility: hidden;
    z-index: -999;
  }
  
  .showfull {
    font-size: 12px;
    line-height: 18px;
  }
  
  .item-name,
  .showfull {
    color: $color-blue;
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
  
  .item-lable span {
    display: inline-block;
    border: 1px solid #e5e5e5;
    padding: 2px 5px;
    border-radius: 6px;
    line-height: 1;
    font-size: 12px;
    color: #a5a5a5;
  }
  
  .material-icons.like-it {
    color: $color-red;
  }
</style>