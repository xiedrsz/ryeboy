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
        <draggable v-model="subscribedChannels"
                   :options="{ group: 'label', animation: 150, ghostClass: 'ghost', disabled: !enableEdit}"
                   class="label-container">
          <div v-for="item in subscribedChannels"
               :id="item.id"
               @click="handleSubscribedLabel"
               class="label"
               :data-badge="enableEdit ? '×' : ''">
            <div class="disabled">{{ item.name }}</div>
          </div>
        </draggable>
      </div>
      <div class="unsubscribed">
        <div class="title-row">
          <div>频道推荐</div>
        </div>
        <!--<draggable v-model="subscribedChannels"
                       :options="{ group: 'label', animation: 150, ghostClass: 'ghost', disabled: !enableEdit}"
                       class="label-container">
              <div v-for="item in subscribedChannels"
                   :id="item.id"
                   @click="handleSubscribedLabel"
                   class="label"
                   :data-badge="enableEdit ? '×' : ''">
                <div class="disabled">{{ item.name }}</div>
              </div>
            </draggable>-->
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import * as types from "store/mutation-types";

export default {
  data() {
    return {
      enableEdit: false,
      subscribedChannels: []
    };
  },
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    },
  },
  methods: {
    edit() {
      if (this.enableEdit) {
        this.$store.dispatch("setSubscribedChannels", this.subscribedChannels);
      }
      this.enableEdit = !this.enableEdit;
    },
    handleSubscribedLabel(e) {
      console.log("handleSubscribedLabel", e.target, e.target.id);
    }
  },
  components: {
    draggable,
    "button-flat": require("components/ui/button-flat.vue"),
  },
  mounted() {
    this.subscribedChannels = this.$store.state.diary.channels.filter(item => {
      return item.id != "default";
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