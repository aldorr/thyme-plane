<template>
  <section class="hero is-light is-fullheight">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Willkommen {{userEmail}}!</h1>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  /** Just to show something, when you first login. */
  // methods: {
  //     loadCustomerData() {
  //         this.$store.dispatch('loadCustomerEntries')
  //     },
  //   },
  //   listAllUsers() {
  //     this.$store.dispatch('listAllUsers')
  //   }
  // },
  computed: {
    userEmail() {
      return this.$store.getters.userEmail
    }
  }
  // mounted() {
  //   this.loadCustomerData()
  // }
}
</script>