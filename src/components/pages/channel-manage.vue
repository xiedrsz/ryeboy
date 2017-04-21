<template>
  <div class="page"
       title="频道管理">
    <div class="page-content">
      <div class="subscribed">
        <div class="title-row">
          <div>我的频道</div>
          <div class="mdl-layout-spacer"></div>
          <button-flat class="sideline"
                       :text="enableEdit ? '完成' : '编辑'"
                       @click.native="edit" />
        </div>
        <sortable v-model="subscribedChannels"
                   :options="{ group: 'label', animation: 150, ghostClass: 'ghost', disabled: !enableEdit}"
                   class="label-container">
          <div v-for="item in subscribedChannels"
               :id="item.id"
               @click="removeSubscribed"
               class="label"
               :data-badge="enableEdit ? '×' : ''">
            <div class="disabled">{{ item.name }}</div>
          </div>
        </sortable>
      </div>
      <div class="unsubscribed">
        <div class="title-row">
          <div>频道推荐</div>
        </div>
        <div class="label-container">
          <div v-for="item in recommendedChannels"
               :id="item.id"
               @click="addSubscribed"
               class="label">
            <div class="disabled">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import sortable from "vendor/sortable";
import api from "api";
import _ from "lodash";
import * as types from "store/mutation-types";

// 默认推荐订阅频道
const defaultRecommendedChannels = [
  {
    id: "tbs",
    name: "蜕变史",
    active: false
  },
  {
    id: "ms",
    name: "麦式",
    active: false
  },
  {
    id: "ys",
    name: "饮食",
    active: false
  },
  {
    id: "zx",
    name: "作息",
    active: false
  },
  {
    id: "xl",
    name: "心理",
    active: false
  },
  {
    id: "qlxy",
    name: "前列腺炎"
  },
  {
    id: "yj",
    name: "遗精",
  },
  {
    id: "yyz",
    name: "抑郁症",
  },
  {
    id: "kqky",
    name: "口腔溃疡",
  },
  {
    id: "sm",
    name: "失眠",
  },
  {
    id: "npnj",
    name: "尿频尿急",
  },
  {
    id: "tyhc",
    name: "头晕昏沉",
  },
  {
    id: "bftf",
    name: "白发脱发",
  },
  {
    id: "yy",
    name: "意淫",
  },
  {
    id: "sx",
    name: "肾虚",
  },
  {
    id: "ywzx",
    name: "阳痿早泄",
  },
  {
    id: "bm",
    name: "便秘",
  },
];

export default {
  data() {
    return {
      enableEdit: false,
      modified: false,
      subscribedChannels: [],
      recommendedChannels: []
    };
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    },
  },
  watch: {
    subscribedChannels: {
      handler: function () {
        this.modified = true;
      },
      deep: true
    }
  },
  methods: {
    edit() {
      if (this.enableEdit && this.modified) {
        this.$store.commit(types.SET_CHANNEL_CHANGED);
        this.$store.dispatch("setSubscribedChannels", this.subscribedChannels);
      }
      this.enableEdit = !this.enableEdit;
      if (this.enableEdit) {
        this.modified = false;
      }
    },
    removeSubscribed(event) {
      if (!this.enableEdit) return;
      if (this.subscribedChannels.length <= 1) {
        this.$store.commit(types.SHOW_DIALOG, {
          show: true,
          type: "alert",
          content: "至少保留一个频道。"
        });
        return;
      }
      let index = _.findIndex(this.subscribedChannels, { "id": event.target.id });
      this.recommendedChannels.unshift(this.subscribedChannels[index]);
      this.subscribedChannels.splice(index, 1);
    },
    addSubscribed(event) {
      if (!this.enableEdit) return;
      let item = _.find(this.recommendedChannels, { "id": event.target.id });
      _.pull(this.recommendedChannels, item);
      this.subscribedChannels.push(item);
    },
    initRecommendedChannels(channels) {
      channels.forEach(channel => {
        if (_.findIndex(this.subscribedChannels, function (subscribedChannel) {
          return subscribedChannel.id == channel.id;
        }) == -1) {
          this.recommendedChannels.push(channel);
        }
      });
    }
  },
  components: {
    sortable,
    "button-flat": require("components/ui/button-flat.vue"),
  },
  mounted() {
    this.$store.state.diary.channels.forEach(item => {
      if (item.id != "default") {
        this.subscribedChannels.push({
          id: item.id,
          name: item.name
        });
      }
    });
    this.modified = false;
    api.getRecommendedChannels().then(res => {
      this.initRecommendedChannels(res.data);
    }).catch(() => {
      this.initRecommendedChannels(defaultRecommendedChannels);
    });
  }
};

</script>

<style lang="scss" scoped>
@import "~scss/main.scss";
.title-row {
  @include flex-row;
  width: 100%;
}

.label-container {
  margin-top: 16px;
  @include flex-row;
  flex-wrap: wrap;
  width: 100%;
}

.label {
  @include flex-row;
  @include flex-center;
  position: relative;
  width: 72px;
  border-radius: 4px;
  background-color: #dedede;
  padding: 6px 0;
  margin-right: 8px;
  margin-bottom: 8px;
}

.label[data-badge]:after {
  content: attr(data-badge);
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.2em;
  color: $color-blue;
  width: 16px;
  height: 16px;
}

.disabled {
  pointer-events: none;
}

.ghost {
  opacity: 0.25;
}

.sideline {
  border: 1px solid $color-disable
}

.unsubscribed {
  margin-top: 32px;
  border-top: 1px solid $color-disable;
  padding-top: 16px;
}
</style>