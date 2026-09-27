<template>
  <div id="app">
    <!-- display nav bar -->
    <nav-bar></nav-bar>
    <router-view/>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
export default {
  name: "App",
  components: {
    NavBar
  },
  created() {
    // Check for authentication when app loads
    this.$store.dispatch('checkAuth')
  }
}
</script>
