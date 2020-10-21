<template>
  <div>
    <b-container>
      <div class="text-right my-3 d-flex justify-content-around">
        <h5 class="p-2 text-theme">
          <strong>{{ user.name }}</strong>
        </h5>
        <h5 class="p-2 bg-warning flag  ">
          {{ user.score }} XP | Position : <strong>{{ rank }}</strong>
        </h5>
      </div>
      <b-row align-v="baseline">
        <b-col md="6" class="my-1">
          <b-form-group class="mb-0">
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">x</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="6" class="my-1">
          <b-pagination
            pills
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0 info"
          ></b-pagination
        ></b-col>
      </b-row>

      <b-table
        show-empty
        sort-icon-left
        small
        stacked="md"
        :items="quizzes"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        @filtered="onFiltered"
      >
        <template #cell(name)="row">
          <b-link :to="'/quiz/' + row.item.quizz_id.id" class="text-theme "
            ><strong>{{ row.item.name }}</strong></b-link
          >
        </template>
        <template #cell(actions)="row">
          <b-button
            pill
            size="sm"
            @click="row.toggleDetails"
            variant="outline-info"
          >
            <b-icon v-if="row.detailsShowing" icon="arrow-up" />
            <b-icon v-else icon="arrow-down" />
            Réactions
          </b-button>
        </template>

        <template #row-details="row">
          <div>
            <div class="bg-theme">
              <QuizCard :quiz="row.item.quizz_id"></QuizCard>
            </div>
            <div>
              <Ratings
                v-if="$root.$store.state.user"
                :quizId="row.item.quizz_id._id"
                :userId="$root.$store.state.user.id"
              ></Ratings
              ><Comments :quizId="row.item.quizz_id._id"></Comments>
            </div>
          </div>
        </template>
      </b-table>
    </b-container>

    <b-container>
      <div>
        <h4>Mes quiz favoris</h4>
      </div>

      <b-table
        show-empty
        sort-icon-left
        small
        stacked="md"
        :items="favorites"
        :fields="favFields"
        :sort-by.sync="favSortBy"
        :sort-desc.sync="favSortDesc"
        :sort-direction="favSortDirection"
      >
        <template #cell(actions)="row">
          <div class="text-center">
            <b-icon
              icon="heart-fill"
              variant="danger"
              @click="removeFavorite(row.item.id)"
            />
          </div>
        </template>

        <template #row-details="row">
          <div>
            <div class="bg-theme">
              <QuizCard :quiz="row.item.quizz_id"></QuizCard>
            </div>
          </div>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import User from "../apis/User";
import Quiz from "../apis/Quiz";
import UserQuiz from "../apis/UserQuiz";
import moment from "moment";
import Comments from "./Comments";
import Ratings from "./Ratings";
import QuizCard from "./QuizCard";

export default {
  components: { QuizCard, Ratings, Comments },
  data: () => ({
    user: {},
    rank: null,
    quizzes: [],
    fields: [
      {
        key: "name",
        label: "Nom",
        sortable: true,
        sortDirection: "asc",
      },
      {
        key: "category",
        label: "Techno/Langage",
        sortable: true,
        sortDirection: "asc",
      },
      {
        key: "success_rate",
        label: "%",
        sortable: true,
        class: "",
      },
      {
        key: "score",
        label: "XP",
        sortable: true,
        class: "",
      },
      {
        key: "updated_at",
        label: "Participation",
        formatter: (value, key, item) => {
          return moment(value).format("DD MMM YYYY");
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true,
      },
      { key: "actions", label: "Voir plus..." },
    ],
    favFields: [
      {
        key: "name",
        label: "Nom",
        sortable: true,
        sortDirection: "asc",
      },
      {
        key: "category.name",
        label: "Techno/Langage",
        sortable: true,
        sortDirection: "asc",
      },
      {
        key: "created_at",
        label: "Mise en ligne",
        formatter: (value, key, item) => {
          return moment(value).format("DD MMM YYYY");
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true,
      },
      { key: "actions", label: "Supprimer favoris" },
    ],
    totalRows: 1,
    currentPage: 1,
    perPage: 5,
    pageOptions: [5, 10, 15],
    sortBy: "score",
    sortDesc: true,
    sortDirection: "desc",
    favSortBy: "score",
    favSortDesc: true,
    favSortDirection: "desc",
    filter: null,
    filterOn: ["name", "category", "updated_at", "score", "success_rate"],
    favorites: [],
  }),
  async mounted() {
    const auth = await User.auth();
    this.user = auth.data;
    const userRank = await UserQuiz.getRank(auth.data.id);
    this.rank = userRank.data.rank;
    const userQuizzes = await UserQuiz.getQuizzes(auth.data.id);
    const categories = userQuizzes.data.categories;
    userQuizzes.data.quizzes.forEach((q) => {
      q.quizz_id.id = q.quizz_id._id;
      q.quizz_id.created_at = q.quizz_id.createdAt;
      q.name = q.quizz_id.name;
      q.category = q.quizz_id.category.name;
    });
    this.quizzes = userQuizzes.data.quizzes;
    this.totalRows = userQuizzes.data.quizzes.length;

    const favorites = [];

    this.user.favorites.forEach(async (fav) => {
      console.log("fav", fav);
      const quiz = await Quiz.getQuiz(fav);
      favorites.push(quiz.data);
    });
    this.favorites = favorites;
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key };
        });
    },
  },

  methods: {
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async removeFavorite(favId) {
      this.user.favorites = this.user.favorites.filter((fav) => fav !== favId);
      this.favorites = this.favorites.filter((quiz) => quiz.id !== favId);
      const remFav = await User.saveFavorites(
        this.user.id,
        this.user.favorites
        //this.$store.commit("setUser", this.user)
      );
      console.log(this.user.favorites);
    },
  },
};
</script>
