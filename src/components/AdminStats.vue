<template>
  <div>
    <b-form-select
      @change="filter"
      v-model="selectedLang"
      :options="options"
      class="mb-3"
      size="lg"
    >
      <template v-slot:first>
        <b-form-select-option :value="null" disabled
          >Filtrer par langage</b-form-select-option
        >
      </template>
    </b-form-select>

    <b-container class="mt-5">
      <div
        v-for="(quiz, idx) in quizz"
        class="accordion"
        role="tablist"
        :key="idx"
      >
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" role="tab" class="p-0">
            <b-container
              fluid
              variant="info"
              class="p-2 bg-light d-flex flex-wrap justify-content-between"
            >
              <b-col>
                <b-link :to="'/quiz/' + quiz.id">
                  <strong> {{ quiz.name }}</strong></b-link
                ><br />
                <p>{{ quiz.category.name }}</p>
                <br />
                <small class="text-color-black-50">
                  Ajouté le
                  {{
                    new Date(quiz.created_at).toUTCString().substring(5, 16)
                  }} </small
                ><br />
                <small class="text-color-black-50">
                  Dernière modification le
                  {{ new Date(quiz.updated_at).toUTCString().substring(5, 16) }}
                </small>
                <br />
                <b-button
                  :to="'/editquiz/' + quiz.id"
                  variant="info"
                  class="btn-block"
                >
                  <b-icon icon="pencil" variant="dark" class="mr-1"></b-icon>
                  Modifier </b-button
                ><br />
                <b-button
                  :id="quiz.id"
                  :variant="quiz.is_published ? 'outline-danger' : 'danger'"
                  class="btn-block"
                  @click="publishToggle(idx)"
                >
                  <b-icon
                    :icon="
                      quiz.is_published ? 'box-arrow-in-down' : 'box-arrow-up'
                    "
                    :variant="quiz.is_published ? 'danger' : 'light'"
                    class="mr-1"
                  ></b-icon>
                  {{ quiz.is_published ? 'Dépublier' : 'Publier' }}
                </b-button>
              </b-col>
              <b-col>
                <p>Difficulté :</p>
                <b-col class="h1" md="1">
                  <DifficultyIcon :difficulty="quiz.difficulty" />
                </b-col>
                <br />
                <p>
                  Taux de réussite :
                </p>
                <br />
                <b-progress
                  height="40px"
                  :value="quiz.success_ratio"
                  :variant="
                    quiz.success_ratio < 33
                      ? 'danger'
                      : quiz.success_ratio < 66
                      ? 'warning'
                      : 'success'
                  "
                  show-progress
                  class="mb-3"
                >
                </b-progress>
              </b-col>
              <b-col>
                <b-form-rating
                  v-model="quiz.avg_rating"
                  size="sm"
                  variant="info"
                  readonly
                  show-value
                  precision="2"
                ></b-form-rating
                ><br />
                <p>Commentaires : {{ quiz.commentsCount }}</p>
                <br />
                <!-- <p>Joué {{ quiz.playcount }} fois</p>
              <br /> -->
                <!-- <b-icon icon="heart-fill" variant="danger"></b-icon>
              <p>
                : XXX
              </p> -->
              </b-col>
            </b-container>
          </b-card-header>
        </b-card>
      </div>
    </b-container>
  </div>
</template>

<script>
import AdminQuiz from '../apis/AdminQuiz';
import DifficultyIcon from '../components/DifficultyIcon';
import Search from '../apis/Search';

export default {
  components: {
    DifficultyIcon,
  },
  data() {
    return {
      quizz: [],
      allQuizz: [],
      selectedLang: null,
      options: [{ text: 'Tous' }],
      comments: null,
      hearted: null,
    };
  },

  async mounted() {
    // AdminQuiz.getAllQuizzWithStats().then((response) => {
    //   this.quizz = response.data;
    // });
    const quizzes = await AdminQuiz.getAllQuizzWithStats();
    this.allQuizz = quizzes.data;
    this.quizz = quizzes.data;
    const categories = await AdminQuiz.getCategories();
    categories.data.unshift({ text: 'Tous', value: 'Tous' });
    this.options = categories.data;
  },
  methods: {
    publishToggle(idx) {
      let quizId = this.quizz[idx].id;
      let pubStatus = this.quizz[idx].is_published;
      AdminQuiz.updateQuiz({ quizId, data: { is_published: !pubStatus } }).then(
        (response) => {
          this.quizz[idx].is_published = !pubStatus;
        }
      );
    },
    async filter() {
      if (this.selectedLang == 'Tous') {
        this.quizz = this.allQuizz;
      } else {
        this.quizz = this.allQuizz;
        const filteredQuizz = this.quizz.filter((quiz) => {
          return quiz.category._id === this.selectedLang;
        });
        this.quizz = filteredQuizz;
      }
    },
  },
};
</script>
