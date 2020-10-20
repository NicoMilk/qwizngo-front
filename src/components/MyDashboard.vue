<template>
  <div>
    <h1>My Dashboard</h1>
    <h2>Mes quiz favoris</h2>
    <div><QuizCard v-for="item in quizzes" :key="item.id" :quiz="item"></QuizCard></div>
  </div>
</template>

<script>
// @ is an alias to /src
import QuizCard from "@/components/QuizCard.vue";
import User from "../apis/User";

export default {
  name: "MyDashboard",
  components: {
    QuizCard,
  }
}