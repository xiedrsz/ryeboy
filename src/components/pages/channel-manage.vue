<template>
  <div class="page"
       title="频道管理">
     123
  </div>
</template>

<script>
export default {
  computed: {
    authenticated() {
      return this.$store.state.user.authenticated;
    }
  }
};

</script>