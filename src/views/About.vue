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
        get() {
          return this.$store.getters.userName
        },
        set(value) {
          this.$store.dispatch('setUserName', value)
        }
    }
  },
  methods: {
    loadAllData() {
        this.$store.dispatch('loadTimeEntries')
        // .then((result) => {
        //   if (result) {
        //     let userID = this.$store.getters.user
        //     let currentUserName = result[userID].fullname
        //     this.userName = currentUserName
        //   }
        // })
    },
  },
  mounted() {
    this.loadAllData()
  }
}
</script>