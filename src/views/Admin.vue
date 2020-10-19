<template>
  <div>
    <div class="container px-0 py-4">
      <nav class="nav nav-pills flex-column flex-sm-row nav-justified">
        <router-link
          :to="{ path: '/admin' }"
          class="flex-sm-fill text-center nav-link mx-3"
          >Quiz</router-link
        >
        <router-link
          :to="{ name: 'AdminUser' }"
          class="flex-sm-fill text-center nav-link mx-3"
          >Utilisateurs</router-link
        >
        <router-link
          :to="{ name: 'AdminStats' }"
          class="flex-sm-fill text-center nav-link mx-3"
          >Statistiques</router-link
        >
      </nav>
      <router-view></router-view>
    </div>
    <div class="my-5 text-center"></div>
  </div>
</template>

<script>
// TOTO ensure is admin

export default {
  data() {
    return {
      isAdmin: false,
    };
  },
  xmounted() {
    console.log(this.$store.state);
    this.isAdmin = this.$store.state.user
      ? this.$store.state.user.role == "admin"
      : false;
  },
};
</script>
