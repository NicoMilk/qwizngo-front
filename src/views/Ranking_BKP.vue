<template>
  <b-container class="py-3">
    <h1>CLASSEMENT :</h1>
    <div class="justify-content-center">
      <!-- CURRENT USER CARD -->
      <b-card style="max-width: 20rem;" class="mb-2">
        <b-card-text>
          {{ currentUser.name }}
          Score : {{ currentUser.score }}
          Place :
        </b-card-text>
      </b-card>

      <!-- RANKING CARDS -->
      <div v-for="(user, idx) in users" :key="idx">
        <b-container
          fluid
          variant="light"
          class="p-2 d-flex flex-wrap justify-content-center"
        >
          <b-card
            style="max-width: 20rem;"
            class="mb-2"
            :bg-variant="user.id == currentUser.id ? 'success' : 'light'"
          >
            <p>{{ idx + 1 }} - {{ user.name }} - {{ user.score }}xp</p>
          </b-card>
        </b-container>
      </div>
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
      currentUser: null,
      currentUserRank: null,
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

    const plop = this.users.indexOf(this.currentUser);
    console.log('CURRENT USER RANK:', plop);
  },
};
</script>
