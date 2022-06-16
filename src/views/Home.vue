<template>
  <div class="home">
    <HelloWorld msg="Get on board with Thyme Plane." text="Please sign in."/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // Just the home page
  name: 'home',
  components: {
    HelloWorld
  },
  // TODO: Make Welcome Message dynamic
  mounted() {
    // kind of a reverse route protection.
    // seems like this should happen in the router, but hey, it works.
    if (this.$store.state.user !== null) {
      this.$router.push({name: 'about'})
    }
  }
}
</script>
