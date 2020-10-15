<template>
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
              <strong> {{ quiz.name }}</strong
              ><br />
              <p>{{ quiz.category.name }}</p>
              <br />
              <small class="text-color-black-50">
                Ajouté le
                {{ new Date(quiz.created_at).toUTCString().substring(5, 16) }}
              </small>
            </b-col>
            <!-- <DifficultyIcon :quiz="quiz" /> -->
            <b-col>
              <b-col v-if="quiz.difficulty === 'Facile'" class="h1" md="1">
                <b-icon
                  icon="reception1"
                  variant="success"
                  class="mr-1"
                ></b-icon>
              </b-col>
              <b-col v-if="quiz.difficulty === 'Moyen'" class="h1" md="1">
                <b-icon
                  icon="reception2"
                  variant="warning"
                  class="mr-1"
                ></b-icon>
              </b-col>
              <b-col v-if="quiz.difficulty === 'Difficile'" class="h1" md="1">
                <b-icon
                  icon="reception3"
                  variant="danger"
                  class="mr-1"
                ></b-icon> </b-col
              ><br />
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
              <!-- <p>
                Commentaires : XXX
              </p>
              <br /> -->
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
</template>

<script>
import AdminQuiz from '../apis/AdminQuiz';
import DifficultyIcon from '../components/DifficultyIcon';

export default {
  data() {
    return {
      quizz: [],
      progressBarColor: '',
      comments: null,
      hearted: null,
    };
  },

  mounted() {
    AdminQuiz.getAllQuizzWithStats().then((response) => {
      this.quizz = response.data;
    });
  },
};
</script>
