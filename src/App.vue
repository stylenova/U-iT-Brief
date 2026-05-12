<template>
  <div id="app">
    <ClientQuestionnaire />
  </div>
</template>

<script>
import ClientQuestionnaire from './components/ClientQuestionnaire.vue';

export default {
  name: 'App',
  components: {
    ClientQuestionnaire
  }
};
</script>

<style>
body {
  font-family: 'Segoe UI', 'Arial', sans-serif;
  background: #eef2f3;
  margin: 0;
  padding: 0;
}
#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
