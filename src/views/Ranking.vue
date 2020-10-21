<template>
  <b-container id="top" class="py-3 text-center">
    <b-col class="sticky-top ">
      <h1 class="bg-light my-4">CLASSEMENT :</h1>
    </b-col>
    <div v-for="(user, idx) in users" :key="idx">
      <b-card
        :class="
          user.id == currentUser.id
            ? 'my-2 text-center currentUserRankCard'
            : 'my-2 text-center'
        "
        xstyle="max-width: 30rem;"
        :border-variant="user.id == currentUser.id ? 'success' : ''"
        :id="'x' + user.id"
      >
        <b-card-text>
          <b-row>
            <b-col md="2">
              <h5>{{ idx + 1 }}</h5>
            </b-col>
            <b-col md="4">
              <h5 class="text-left pl-5">{{ user.name }}</h5>
            </b-col>
            <b-col md="4">
              <h5>{{ user.score }} XPs</h5>
            </b-col>
            <b-col md="1">
              <b-icon
                v-if="idx + 1 === 1"
                icon="award-fill"
                font-scale="2"
                style="color: gold"
              ></b-icon>
              <b-icon
                v-if="idx + 1 === 2"
                icon="award-fill"
                font-scale="2"
                style="color: silver"
              ></b-icon>
              <b-icon
                v-if="idx + 1 === 3"
                icon="award-fill"
                font-scale="2"
                style="color: brown"
              ></b-icon>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>
    </div>
    <b-icon
      icon="arrow-up-circle-fill"
      class="scrollToTop pointer"
      font-scale="3"
      v-scroll-to="'#top'"
    ></b-icon>
    <b-icon
      v-if="Object.keys(currentUser).length != 0"
      icon="person-circle"
      class="scrollToUserRank pointer"
      font-scale="3"
      v-scroll-to="{
        el: '#x' + currentUser.id,
        offset: -400,
        easing: 'ease-in-out',
      }"
    ></b-icon>
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
      currentUser: {},
    };
  },

  async mounted() {
    const users = await AdminUser.getUsers();
    const sortedUsers = _.orderBy(users.data, ['score'], ['desc']);
    this.users = sortedUsers;

    if (this.$store.getters.loggedIn) {
      const currentUser = await User.auth();
      this.currentUser = currentUser.data;
      var autoScroll = this.$scrollTo('#x' + this.currentUser.id, {
        // container: '#container',
        easing: 'ease-in-out',
        offset: -400,
        force: true,
        cancelable: true,
        x: false,
        y: true,
      });
    } else {
      this.currentUser = {};
    }
  },
};
</script>
