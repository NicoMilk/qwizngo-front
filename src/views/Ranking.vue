<template>
  <b-container id="top" class="py-3">
    <b-col class="sticky-top ">
      <h1 class="bg-light my-4">CLASSEMENT :</h1>
    </b-col>

    <!-- CURRENT USER CARD -->
    <!-- <b-card
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
      </b-card> -->

    <!-- <div id="top"></div> -->

    <!-- RANKING CARDS -->
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
            <!-- <b-col md="1">
              <b-icon
                v-if="showBackToTop === user.id"
                class="pointer"
                icon="chevron-double-up"
                v-scroll-to="'#top'"
              ></b-icon>
            </b-col> -->
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
      icon="person-circle"
      class="scrollToUserRank pointer"
      font-scale="3"
      v-scroll-to="{
        el: '#x' + currentUser.id,
        offset: -400,
        easing: 'ease-in-out',
      }"
    ></b-icon>

    <!-- <b-button class="scrollToTop">BTT</b-button> -->
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
      currentUserRank: null,
      showBackToTop: null,
    };
  },

  async mounted() {
    // TODO ADMIN DISABLED IN users.controller -> MUST BE RE-ENABLED
    const users = await AdminUser.getUsers();
    const sortedUsers = _.orderBy(users.data, ['score'], ['desc']);
    this.users = sortedUsers;
    // console.log('USERS :', this.users);

    const currentUser = await User.auth();
    this.currentUser = currentUser.data;
    // console.log('CURRENT USER :', this.currentUser);

    const plop = await this.users
      .map((user) => user.id)
      .indexOf(this.currentUser.id);
    this.currentUserRank = plop + 1;
    // console.log('CURRENT USER RANK:', this.currentUserRank);

    var options = {
      // container: '#container',
      easing: 'ease-in-out',
      offset: -400,
      force: true,
      cancelable: true,
      x: false,
      y: true,
    };

    var autoScroll = this.$scrollTo('#x' + this.currentUser.id, options);
    // console.log('AUTOSCROLL :', autoScroll);
  },

  methods: {},
};
</script>
