<template>
        <HelloWorld v-bind:msg="`Welcome ` + userName" v-bind:text="`You are logged in as ` + userEmail"/>
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
