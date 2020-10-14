<template>
  <div>
    <div v-if="!rated" class="d-flex justify-content-start align-items-center">
      <div>
        <h5 class="my-auto">Notez ce quiz !!</h5>
      </div>
      <div>
        <b-form-rating
          v-model="rating"
          variant="warning"
          inline
          no-border
          size="lg"
          class="bg-transparent"
        ></b-form-rating>
      </div>
    </div>
    <div v-else>
      <h6>Merci pour votre contribution !!</h6>
    </div>
  </div>
</template>

<script>
import Comments from "../apis/Comments";

export default {
  data() {
    return {
      rated: false,
      rating: null,
    };
  },

  props: {
    quizId: String,
  },

  watch: {
    rating: function () {
      console.log("rating changed");
      this.rated = true;
      this.addRating();
    },
  },

  methods: {
    addRating() {
      Comments.addRating({
        data: {
          user_id: this.$store.state.user.id,
          quizz_id: this.$route.params.quiz_id,
          rating: this.rating,
        },
      }).then((response) => console.log(response.data));
    },
  },
};
</script>

<style>
</style>