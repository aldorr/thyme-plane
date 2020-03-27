<template>
  <div class="home">
    <HelloWorld msg="Get ready to become a Thyme Expert." text="Please sign in to continue."/>
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
  }
}
</script>
