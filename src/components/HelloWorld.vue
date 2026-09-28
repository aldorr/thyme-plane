<template>
  <section class="hero is-fullheight start-hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title title-w-image">
          <span class="text">{{ msg }}</span>
          <img
            class="brand-logo"
            src="@/assets/thyme-plane-logo.svg"
            alt="thyme-plane"
            width="974"
            height="176"
          >
        </h1>
        <h2 class="subtitle" @click="openLogin()">
          {{ text }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
import SigninVue from '@/components/auth/SignIn.vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    text: String
  },
  methods: {
    openLogin() {
      this.$buefy.modal.open({
        component: SigninVue,
        hasModalCard: true,
        trapFocus: true
      })
      this.hideNav()
    },
  }
}
</script>

<style scoped>
.start-hero {
  background-color: var(--bulma-scheme-main, #1e1e2e);
  color: var(--bulma-text, #cdd6f4);
}

h1.title.title-w-image {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  color: var(--bulma-text, #cdd6f4);
}

h1 .text {
  flex-shrink: 0;
}

.brand-logo {
  display: block;
  width: auto;
  max-width: min(50vw, 28rem);
  max-height: 2.75rem;
  height: auto;
}

h2.subtitle {
  color: var(--bulma-text-weak, #a6adc8);
  cursor: pointer;
  transition: color 350ms;
}

h2.subtitle:hover {
  color: var(--bulma-primary, #cba6f7);
}
</style>
