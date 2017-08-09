<template>
  <div class="page"
       title="频道管理">
    <div class="page-content">
      <div class="subscribed">
        <div class="title-row">
          <div>我的频道</div>
          <div class="mdl-layout-spacer"></div>
          <button-flat :border="true"
                       :text="enableEdit ? '完成' : '编辑'"
                       @click.native="edit" />
        </div>
        <sortable v-model="subscribedChannels"
                  :options="{ group: 'label', animation: 150, ghostClass: 'ghost', disabled: !enableEdit}"
                  class="label-container">
          <div v-for="item in subscribedChannels"
               :key="item.id"
               @click="removeSubscribed(item.id)"
               class="label"
               :data-badge="enableEdit ? '×' : ''">
            <div class="disabled">{{ item.name }}</div>
          </div>
        </sortable>
      </div>
      <div class="note"
           v-show="enableEdit">拖拽可以排序</div>
      <div class="unsubscribed">
        <div class="title-row">
          <div>频道推荐</div>
        </div>
        <div class="label-container">
          <div v-for="item in activatedChannels"
               :key="item.id"
               @click="addSubscribed(item.id)"
               class="label"
               :data-badge="enableEdit ? '+' : ''">
            <div class="disabled">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import sortable from "lib/sortable";
  import api from "api";
  import _ from "lodash";

  export default {
    data() {
      return {
        enableEdit: false,
        modified: false,
        subscribedChannels: [],
        activatedChannels: []
      };
    },
    computed: {
      authenticated() {
        return this.$store.state.user.authenticated;
      },
    },
    watch: {
      subscribedChannels: {
        handler: function() {
          this.modified = true;
        },
        deep: true
      }
    },
    methods: {
      edit() {
        if (this.enableEdit && this.modified) {
          this.$store.commit("diary_setChannelChanged");
          this.$store.dispatch("diary_setUserChannels", this.subscribedChannels);
        }
        this.enableEdit = !this.enableEdit;
        if (this.enableEdit) {
          this.modified = false;
        }
      },
      removeSubscribed(id) {
        if (!this.enableEdit) return;
        if (this.subscribedChannels.length <= 1) {
          this.$store.commit("page_showDialog", {
            show: true,
            type: "alert",
            content: "至少保留一个频道。"
          });
          return;
        }
        let index = _.findIndex(this.subscribedChannels, {
          id
        });
        this.activatedChannels.unshift(this.subscribedChannels[index]);
        this.subscribedChannels.splice(index, 1);
      },
      addSubscribed(id) {
        if (!this.enableEdit) return;
        let item = _.find(this.activatedChannels, {
          id
        });
        _.pull(this.activatedChannels, item);
        this.subscribedChannels.push(item);
      },
      setActivatedChannels(channels) {
        _.differenceBy(channels, this.subscribedChannels, "id").forEach(item => {
          this.activatedChannels.push(item);
        });
      }
    },
    components: {
      sortable,
      "button-flat": require("components/ui/button-flat.vue"),
    },
    async mounted() {
      this.$store.state.diary.channels.forEach(item => {
        let {
          id,
          name
        } = item;
        if (id != "default") {
          this.subscribedChannels.push({
            id,
            name
          });
        }
      });
      this.modified = false;
      api.getActivatedChannels().then(res => {
        let channels = res.data;
        channels.forEach(item => {
          if (!item.id) {
            item.id = item.name;
            item.name = item.displayName;
          }
        });
        this.setActivatedChannels(channels);
      });
    }
  };
</script>

<style lang="scss"
       scoped>
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

  .unsubscribed {
    margin-top: 32px;
    border-top: 1px solid $color-divider;
    padding-top: 16px;
  }

  .note {
    color: $color-hint-text;
    margin-top: 16px;
  }
</style>