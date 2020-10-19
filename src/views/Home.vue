<template>
  <div class="home container mt-0">
    <div class="mb-3 search-parent p-2 d-flex justify-content-between">
      <b-row class="search-bar flex-fill">
        <b-col md="3">
          <b-form-input
            @input="search_text"
            @keypress.enter="searchAll"
            v-model="search.text"
            type="text"
            placeholder="Recherche par titre"
          ></b-form-input>
          <b-icon icon="search" class="h4 pb-1 search-icon"></b-icon>
        </b-col>
        <b-col md="3">
          <b-form-select
            @change="searchAll"
            v-model="selectedLang"
            :options="options"
            size="md"
          />
        </b-col>
        <b-col xs="6" md="3">
          <div>
            <b-form-select
              @change="searchAll"
              v-model="selectedLevel"
              :options="niveau"
              size="md"
            />
          </div>
        </b-col>
        <b-col xs="6" md="3">
          <b-form-select
            @change="searchAll"
            v-model="sorting"
            :options="tri"
            size="md"
          />
        </b-col>
      </b-row>
    </div>

    <div class="d-flex justify-content-around flex-wrap">
      <QuizCard v-for="item in quizzes" :key="item.id" :quiz="item"></QuizCard>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import QuizCard from "@/components/QuizCard.vue";
import AdminQuiz from "../apis/AdminQuiz";
import Quiz from "../apis/Quiz";
import Search from "../apis/Search";

export default {
  name: "Home",
  components: {
    QuizCard,
  },
  data() {
    return {
      search: { filter: null, text: "" },
      categories: [],
      quizzes: [],
      selectedLang: "",
      selectedLevel: "",
      searchItem: null,
      sorting: "desc",
      options: [],
      niveau: [
        { value: "", text: "Niveau : tous" },
        { value: "Facile", text: "Facile" },
        { value: "Moyen", text: "Moyen" },
        { value: "Difficile", text: "Difficile" },
      ],
      tri: [
        { value: "desc", text: "Plus récents" },
        { value: "asc", text: "Plus anciens" },
      ],
    };
  },

  async mounted() {
    const categories = await AdminQuiz.getCategories();
    this.options = [{ text: "Techno/langage : tous", value: "" }].concat(
      categories.data
    );
  },

  beforeMount() {
    this.getAllQuizzes();
  },

  updated() {
    //this.getAllQuizzes();
  },

  methods: {
    search_text() {
      var inside = this;
      console.log(this.search.text, inside);
    },
    async getAllQuizzes() {
      Quiz.getPublishedQuizzes().then((result) => {
        this.quizzes = result.data;
      });
    },

    /*     async filter(field) {
      const payload = {};
      payload.field = field;
      if (field === "category") {
        payload.query = this.selectedLang;
      } else {
        payload.query = this.selectedLevel;
      }
      Search.filterQuiz({ data: payload }).then(
        (result) => (this.quizzes = result.data)
      );
    }, */

    /*     async search() {
      console.log("search function")
      const payload = {};
      payload.query = this.searchItem;
      Search.searchQuiz({ data: payload }).then(
        (result) => (this.quizzes = result.data)
      );
    }, */

    async searchAll() {
      const payload = {};
      if (this.searchItem) {
        payload.query = this.searchItem;
      } else {
        payload.query = " ";
      }

      payload.category = this.selectedLang;
      payload.level = this.selectedLevel;
      payload.sort = this.sorting;
      Search.multiSearch({ data: payload }).then((result) => {
        //console.log(result.data);
        this.quizzes = result.data;
      });
    },

    /*     async sort() {
      const payload = {};
      payload.sort = this.sorting;
      Search.sortQuiz({ data: payload }).then((result) => {
        //console.log(result.data);
        this.quizzes = result.data;
      });
    }, */

    reset() {
      this.selectedLang = null;
      this.selectedLevel = null;
      this.searchItem = null;
      this.sorting = "desc";
      this.getAllQuizzes();
    },
  },
};
</script>

<style scoped></style>
