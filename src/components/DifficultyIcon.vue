<template>
  <div>
    <b-col v-if="quiz.difficulty === 'Facile'" class="h1" md="1">
      <b-icon icon="reception1" variant="success" class="mr-1"></b-icon>
    </b-col>
    <b-col v-if="quiz.difficulty === 'Moyen'" class="h1" md="1">
      <b-icon icon="reception2" variant="warning" class="mr-1"></b-icon>
    </b-col>
    <b-col v-if="quiz.difficulty === 'Difficile'" class="h1" md="1">
      <b-icon icon="reception3" variant="danger" class="mr-1"></b-icon>
    </b-col>
    <b-col v-if="quiz.difficulty === 'Hardcore'" class="h1" md="1">
      <b-icon icon="reception4" variant="dark" class="mr-1"></b-icon>
    </b-col>
  </div>
</template>

<script>
export default {
  props: {
    quiz: Object,
  },
};
</script>
