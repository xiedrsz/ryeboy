<template>
  <li @click="$router.push('/pages/diary-detail?id=' + item._id)">
    <user-item :id="item.userid" class="item-container">
      <template scope="props">
        <div class="item-avatar">
          <img :data-src="props.user.avatar" class="lazyload" @click.stop="$router.push('/pages/user-detail?id=' + item.userid)" />
        </div>
        <div class="item-content">
          <div class="item-name">
            {{ props.user.nickname||props.user.username }}
            <span class="gray">{{ ' LV'+ (props.user.level||1) }}</span>
          </div>
          <div class="text" :class="{fulltext:!fulltext}" ref="text">{{ item.text }}</div>
          <div class="showfull" @click.stop="fulltext=!fulltext">{{fulltext ? '收起' : '全文'}}</div>
          <div class="comment">
            <div>{{ item.updated_at | time }}</div>
            <div class="mdl-layout-spacer" />
            <div class="counts">
              <i class="material-icons md-16" v-html="item.like ? 'favorite' : 'favorite_border'" :class="{'like-it':item.like}"></i>
              <span style="margin-right: 24px">{{ item.likeCount || 4 }}</span>
              <i class="material-icons md-16">comment</i>
              <span>{{ item.commentCount || 5 }}</span>
            </div>
          </div>
          <div class="item-lable">
            <span v-for="label in item.labels">{{ label }}</span>
          </div>
        </div>
      </template>
    </user-item>
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
            likeIt: false
          }
        }
      }
    },
    data() {
      return {
        fulltext: false
      }
    },
    computed: {
      item() {
        return this.detail
      }
    },
    components: {
      "user-item": require("ui/user-item.vue")
    }
  }
</script>

<style lang="scss" scoped>
  @import "~scss/main.scss";
  .gray {
    color: rgba(0, 0, 0, 0.54);
    font-size: 13px;
  }
  
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