<template>
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
</template>

<script>
import User from "../apis/User";
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
    totalRows: 1,
    currentPage: 1,
    perPage: 5,
    pageOptions: [5, 10, 15],
    sortBy: "score",
    sortDesc: true,
    sortDirection: "desc",
    filter: null,
    filterOn: ["name", "category", "updated_at", "score"],
  }),
  async mounted() {
    const auth = await User.auth();
    this.user = auth.data;
    const userRank = await UserQuiz.getRank(auth.data.id);
    this.rank = userRank.data.rank;
    const userQuizzes = await UserQuiz.getQuizzes(auth.data.id);
    const categories = userQuizzes.data.categories;
    userQuizzes.data.quizzes.forEach((q) => {
      q.quizz_id.category = {
        _id: q.quizz_id.category,
        name: categories.find((c) => c._id === q.quizz_id.category).name,
      };
      q.quizz_id.id = q.quizz_id._id;
      q.quizz_id.created_at = q.quizz_id.createdAt;
      q.name = q.quizz_id.name;
      q.category = q.quizz_id.category.name;
    });
    this.quizzes = userQuizzes.data.quizzes;
    this.totalRows = userQuizzes.data.quizzes.length;
    console.log(userQuizzes.data.quizzes);
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
  },
};
</script>
