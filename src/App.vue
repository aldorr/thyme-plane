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


<style lang="scss">
// Import Bulma's utilities using @import for compatibility
// Note: Bulma 1.0+ uses @forward internally, but @import still works
@import "~bulma/sass/utilities/initial-variables";
@import "~bulma/sass/utilities/functions";
@import "~bulma/sass/utilities/derived-variables";
@import "~bulma/sass/utilities/controls";

// Set your colors
$primary: #8c67ef;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Define invert colors (not all provided by Bulma 1.0+)
$light-invert: findColorInvert($light);
$dark-invert: findColorInvert($dark);
$info-invert: findColorInvert($info);
$success-invert: findColorInvert($success);
$warning-invert: findColorInvert($warning);
$danger-invert: findColorInvert($danger);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma styles
// Note: Buefy styles are automatically loaded when Buefy is used as a Vue plugin
@import "~bulma";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

div.is-view {
    margin-top: 3.25rem;
}
</style>
