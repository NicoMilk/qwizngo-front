<template>
  <b-container fluid class="py-3">
    <div class="sticky-top ">
      <h1>CLASSEMENT :</h1>

      <!-- CURRENT USER CARD -->
      <b-card
        style="max-width: 30rem;"
        class="mb-4 text-center pointer"
        :title="currentUser.name"
        v-scroll-to="{
          el: '#x' + currentUser.id,
          offset: -500,
          easing: 'ease-in-out',
        }"
      >
        <b-card-text>
          <h4>Place : {{ currentUserRank }}</h4>
        </b-card-text>
        <b-card-text>
          <h4>Score : {{ currentUser.score }} XPs</h4>
        </b-card-text>
      </b-card>
    </div>

    <!-- RANKING CARDS -->
    <div v-for="(user, idx) in users" :key="idx">
      <b-card
        v-b-hover="handleHover"
        class="my-2 text-center"
        style="max-width: 30rem;"
        :border-variant="user.id == currentUser.id ? 'success' : ''"
        :id="'x' + user.id"
      >
        <b-card-text>
          <b-col>
            <h5>{{ idx + 1 }}</h5>
          </b-col>
          <b-col>
            <h5>{{ user.name }}</h5>
          </b-col>
          <b-col>
            <h5>{{ user.score }} XPs</h5>
          </b-col>
          <b-col>
            <b-icon v-if="isHovered" icon="chevron-double-up"></b-icon>
          </b-col>
        </b-card-text>
      </b-card>
    </div>
  </b-container>
</template>

<script>
import AdminUser from '../apis/AdminUser.js';
import User from '../apis/User';

export default {
  data() {
    return {
      users: [],
      usersRanks: [],
      currentUser: null,
      currentUserRank: null,
      isHovered: false,
    };
  },

  async mounted() {
    // TODO ADMIN DISABLED IN users.controller -> MUST BE RE-ENABLED
    const users = await AdminUser.getUsers();
    const sortedUsers = _.orderBy(users.data, ['score'], ['desc']);
    this.users = sortedUsers;
    console.log('USERS :', this.users);

    const currentUser = await User.auth();
    this.currentUser = currentUser.data;
    console.log('CURRENT USER :', this.currentUser);

    const plop = await this.users
      .map((user) => user.id)
      .indexOf(this.currentUser.id);
    this.currentUserRank = plop + 1;
    console.log('CURRENT USER RANK:', this.currentUserRank);
  },

  methods: {
    handleHover(hovered) {
      this.isHovered = hovered;
    },
  },
};
</script>

<style></style>
