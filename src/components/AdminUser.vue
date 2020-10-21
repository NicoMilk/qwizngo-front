<template>
  <b-container class="py-3">
    <div class="d-flex justify-content-center">
      <b-button class="my-4" variant="success" v-b-modal.modalNewUser
        >Ajouter un utilisateur</b-button
      >
    </div>

    <b-col class="mb-4">
      <b-input-group>
        <b-form-input
          @input="filter"
          v-model="searchedUser"
          type="text"
          placeholder="Rechercher un utilisateur"
        >
        </b-form-input>
        <b-input-group-append class="x-button">
          <!-- <b-button variant="info" @click="reset"><strong>x</strong></b-button> -->
        </b-input-group-append>
      </b-input-group>
      <!-- <b-icon icon="search" class="h4 pb-1 search-icon"></b-icon> -->
    </b-col>

    <div
      v-for="(user, idx) in filteredUsers"
      class="accordion shadow"
      role="tablist"
      :key="idx"
    >
      <b-card no-body class="mb-2">
        <!-- Header collapsable -->
        <b-card-header header-tag="header" role="tab" class="p-0">
          <b-container
            fluid
            v-b-toggle="'accordion-' + idx"
            variant="info"
            class="p-2 bg-light d-flex flex-wrap justify-content-between"
          >
            <b-col md="3" class="text-theme">
              <strong>
                {{ user.name }}
              </strong>
            </b-col>
            <b-col md="3">
              {{ user.email }}
            </b-col>
            <b-col md="3" class="col-6"> XP {{ user.score }}</b-col>
            <b-col md="3" class="col-6">
              {{ user.role }}
            </b-col>
          </b-container>
        </b-card-header>

        <!-- Card -->
        <b-collapse
          :id="'accordion-' + idx"
          accordion="quiz-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
            <!-- <b-form> -->
            <b-form-group id="input-name" label="Nom :" label-for="userName">
              <b-form-input
                id="userName"
                v-model="user.name"
                required
                placeholder="XXX"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-email"
              label="Email :"
              label-for="userEmail"
            >
              <b-form-input
                id="userEmail"
                v-model="user.email"
                type="email"
                required
                placeholder="YYY"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-xp" label="Xp :" label-for="userXp">
              <b-form-input
                id="userXp"
                v-model="user.score"
                required
                placeholder="ZZZ"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-role" label="Role :" label-for="userRole">
              <b-form-select
                id="userRole"
                v-model="user.role"
                :options="roles"
                required
              ></b-form-select>
            </b-form-group>
            <b-container fluid class="p-2 d-flex justify-content-around">
              <b-button
                v-b-modal.modalDeleteUser
                variant="danger"
                @click="setCurrentUser(user)"
                >Supprimer</b-button
              >
              <!-- <b-button @click="deleteUser(user.id)" variant="danger"
                >Supprimer</b-button
              > -->
              <!-- <b-button @click="showMsgBoxOne" variant="danger"
                >Supprimer</b-button
              > -->
              <b-button @click="updUser(idx)" variant="success"
                >Modifier</b-button
              >
            </b-container>
            <!-- </b-form> -->
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <!-- DELETE USER MODAL -->
    <b-modal id="modalDeleteUser" centered hide-header hide-footer>
      <div class="d-block text-center">
        <p class="my-4">Supprimer {{ currentUser.name }} ?</p>
      </div>
      <b-container fluid class="p-2 d-flex justify-content-around">
        <b-button variant="success" @click="$bvModal.hide('modalDeleteUser')"
          >Annuler</b-button
        >
        <b-button
          variant="danger"
          @click="deleteUser(currentUser.id), $bvModal.hide('modalDeleteUser')"
          >Confirmer</b-button
        >
      </b-container>
    </b-modal>

    <!-- NEW USER MODAL -->
    <b-modal id="modalNewUser" title="Nouvel Utilisateur">
      <b-container class="container">
        <!-- <b-form @submit="onSubmit" @reset="onReset"> -->
        <b-form>
          <b-form-group id="input-name" label="Username :" label-for="name">
            <b-form-input id="name" v-model="form.name" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-email" label="Email :" label-for="email">
            <b-form-input
              id="email"
              v-model="form.email"
              type="email"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-password"
            label="Password :"
            label-for="password"
          >
            <b-form-input
              id="password"
              v-model="form.password"
              type="password"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-pwdConfirm"
            label="Confirmation Password :"
            label-for="pwdConfirm"
          >
            <b-form-input
              id="pwdConfirm"
              v-model="form.pwdConfirm"
              type="password"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-role" label="Role :" label-for="userRole">
            <b-form-select
              id="userRole"
              v-model="form.role"
              :options="roles"
              required
            ></b-form-select>
          </b-form-group>
        </b-form>
      </b-container>
      <template v-slot:modal-footer>
        <b-container fluid class="d-flex justify-content-around">
          <b-button variant="info" @click="$bvModal.hide('modalNewUser')"
            >Annuler</b-button
          >
          <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
          <b-button @click="resetNewUserForm" variant="danger">Reset</b-button>
          <!-- <b-button type="submit" variant="success">Valider</b-button> -->
          <b-button
            @click="submitNewUserForm(), $bvModal.hide('modalNewUser')"
            variant="success"
            >Valider</b-button
          >
        </b-container>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import AdminUser from '../apis/AdminUser.js';
import User from '../apis/User.js';
import VueLodash from 'vue-lodash';
import lodash from 'lodash';

export default {
  data() {
    return {
      users: [],
      filteredUsers: [],
      searchedUser: '',
      currentUser: '',
      form: {
        // id: null,
        name: '',
        email: '',
        password: '',
        pwdConfirm: '',
        role: 'user',
      },
      roles: ['user', 'admin'],
    };
  },

  mounted() {
    // TODO ADMIN DISABLED IN users.controller -> MUST BE RE-ENABLED
    AdminUser.getUsers().then((response) => {
      const x = _.orderBy(
        response.data,
        [(user) => user.name.toLowerCase()],
        ['asc']
      );
      this.users = x;
      this.filteredUsers = x;
    });
  },

  // computed() {
  //   orderedUsers = () => {
  //     return _.orderBy(this.users, 'name');
  //   };
  // },

  methods: {
    resetNewUserForm(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.name = '';
      this.form.email = '';
      this.form.password = '';
      this.form.pwdConfirm = '';
      this.form.role = 'user';
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },

    // async submitNewUserForm() {
    //   if (
    //     this.form.name &&
    //     this.form.email &&
    //     this.form.password &&
    //     this.form.pwdConfirm &&
    //     this.form.role
    //   ) {
    //     console.log('XXX :', this.users);
    //     if (this.form.password == this.form.pwdConfirm) {
    //       const newUser = await User.register(this.form).catch((error) => {
    //         this.errors = 2; // ???
    //         this.error_message = error.response; // ???
    //       });
    //     }
    //     this.users.push(newUser);
    //     console.log('YYY :', this.users);
    //   } else {
    //     this.errors = 1; // ???
    //   }
    // },

    submitNewUserForm() {
      if (
        this.form.name &&
        this.form.email &&
        this.form.password &&
        this.form.pwdConfirm &&
        this.form.role
      ) {
        // console.log('XXX :', this.users);
        if (this.form.password == this.form.pwdConfirm) {
          User.register(this.form).then((response) => {
            // console.log('RESPONSE.DATA :', response.data);
            const new_user = response.data.new_user;
            const newUser = {
              id: new_user._id,
              name: new_user.name,
              email: new_user.email,
              password: new_user.password,
              role: new_user.role,
              score: new_user.score,
            };
            // console.log('NEW USER :', newUser);
            this.users.push(newUser);
          });
          // console.log('New User :', newUser);
          // this.users.push(newUser);
          // console.log('YYY :', this.users);
        }
      }
    },

    async updUser(idx) {
      try {
        console.log(this.users[idx]);
        const updUser = await AdminUser.updateUser(this.users[idx]);
      } catch (err) {
        console.error('Error from updUser :', error);
      }
    },

    setCurrentUser(user) {
      this.currentUser = user;
    },

    async deleteUser(userId) {
      try {
        const delUser = await AdminUser.deleteUser(userId);
        let deletedUserIndex = await this.users.findIndex(
          (deleted) => deleted.id == userId
        );
        await this.users.splice(deletedUserIndex, 1);
      } catch (error) {
        console.error('Error from deleteUser :', error);
        // }
      }
    },

    async filter() {
      if (this.searchedUser) {
        const regex = new RegExp(this.searchedUser, 'i');
        this.filteredUsers = this.users.filter((user) => {
          return user.name.match(regex);
        });
        // this.filteredUsers = this.users.filter((user) => {
        //   return user.name.includes(this.searchedUser);
        // });

        // console.log('XXX: ', this.filteredUsers);
      } else {
        this.filteredUsers = this.users;
      }
    },
  },
};
</script>
