<template>
  <div class="page"
       title="状态">
    <loadable-content :nomore="true"
                      :loadstate="loadstate">
      <list>
        <list-item text="等级"
                   :secondaryText="status.lv"></list-item>
        <list-item text="成长值"
                   :secondaryText="status.exp"></list-item>
        <list-item text="爱心"
                   :secondaryText="status.ap"></list-item>
        <list-item text="身份"
                   :secondaryText="status.level"></list-item>
        <list-item text="种麦子天数"
                   :secondaryText="status.wheatGrowDays"></list-item>
        <list-item text="连续种麦子天数"
                   :secondaryText="status.consecutiveWheatGrowDays"></list-item>
      </list>
    </loadable-content>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loadstate: "loading",
        status: {}
      };
    },
    components: {
      "list": require("components/ui/list.vue"),
      "list-item": require("components/ui/list-item.vue"),
      "loadable-content": require("ui/loadable-content.vue"),
    },
    async mounted() {
      try {
        let status = (await this.$app.api.getUserStatus(this.$app.userid)).data;
        status.level = this.$app.textHelper.getUserIdent(status.studentLevel);
        this.$set(this.$data, "status", status);
        this.loadstate = "loaded";
      } catch (error) {
        this.loadstate = "error";
      }
    }
  };
</script>