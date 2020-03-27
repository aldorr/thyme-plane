<template>
        <HelloWorld v-bind:msg="`Willkommen ` + userName" v-bind:text="`Du bist als ` + userEmail + ` eingeloggt`"/>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // Just the home page
  name: 'home',
  components: {
    HelloWorld
  },
  computed: {
    userEmail() {
      return this.$store.getters.userEmail
    },
    userName: {
        get: function() {
          return this.$store.getters.userName
        },
        set: function(value) {
          // console.log(value)
          this.$store.commit('setUserName', value)
        }
    }
  },
  methods: {
    loadAllData() {
      this.$store.dispatch('loadTimeEntries')
    },
  },
  mounted() {
    this.loadAllData()
  }
}
</script>