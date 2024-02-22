<template>
  <div>
    <!-- Popup after 10 seconds 
    <vue-newsletter :timeOnpage="10"></vue-newsletter>
    -->
    <!-- Popup on exit intent 
    <vue-newsletter :exitIntent="true"></vue-newsletter>
    -->
    <!-- Popup on click -->
    <button class="selector">Show Popup</button>
    <vue-newsletter onClick=".selector"></vue-newsletter>
    
  </div>
</template>

<script setup>
import VueNewsletter from './components/VueNewsletter.vue'
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
