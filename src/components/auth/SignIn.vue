<template>
  <ValidationObserver ref="observer">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Log in to Thyme Plan
        </p>
        <b-icon icon="lock"></b-icon>
      </header>
      <div class="modal-card-body">
        <ValidationProvider v-model="email" name="email" rules="required|email" v-slot="slotProps">
          <b-field
            horizontal
            label="Email"
            :type="fieldType(slotProps)"
            :message="slotProps.message"
          >
            <b-input
              type="email"
              v-model="email"
              name="email"
              key="email"
              placeholder="your email address"
              ref="email"
            />
          </b-field>
        </ValidationProvider>

        <ValidationProvider v-model="password" name="password" rules="required" v-slot="slotProps">
          <b-field
            horizontal
            label="Password"
            :type="fieldType(slotProps)"
            :message="slotProps.message"
          >
            <b-input
              type="password"
              v-model="password"
              name="password"
              key="password"
              placeholder="your password"
              password-reveal
            />
          </b-field>
        </ValidationProvider>
      </div>
      <footer class="modal-card-foot">
        <b-button
          @click="openPasswordReset()"
          @mouseover="forgot='I forgot'"
          @mouseout="forgot='I'"
          style="margin-right:auto;"
          type="is-danger"
          icon-right="heart-broken"
        >{{ forgot }}</b-button>
        <b-button @click="closeModal" style="margin-left:auto;">Cancel</b-button>
        <b-button
          type="is-success"
          icon-right="lock"
          @click.prevent="validateForm"
        >Log In</b-button>
      </footer>
    </div>
  </ValidationObserver>
</template>

<script>
import { defineRule } from 'vee-validate'
import { required, email } from '@vee-validate/rules'
import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'
import PassReset from '@/components/auth/PassReset.vue'

defineRule('email', email)
defineRule('required', (value) => {
  if (!required(value)) {
    return "Don't forget…"
  }
  return true
})

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    email: '',
    password: '',
    forgot: 'I'
  }),
  methods: {
    fieldType(slotProps) {
      return {
        'is-danger': !!(slotProps.message),
        'is-success': !!(slotProps.valid && !slotProps.message)
      }
    },
    validateForm() {
      if (this.$refs.observer?.validate) {
        this.$refs.observer.validate().then(({ valid }) => {
          if (valid) {
            this.loginWithFirebase()
          }
        })
      } else {
        this.loginWithFirebase()
      }
    },
    loginWithFirebase() {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signInAction', user)
        .then((response) => {
          this.$emit('close')
          this.$buefy.toast.open({
            message: 'You have successfully logged in with the following email address: ' + response.user.email,
            type: 'is-success',
            position: 'is-bottom',
            duration: 3000
          })
        }, (error) => {
          this.$buefy.toast.open({
            message: String(error?.message || error),
            type: 'is-danger',
            position: 'is-bottom',
            duration: 6000
          })
        })
    },
    openPasswordReset() {
      this.$buefy.modal.open({
        component: PassReset,
        hasModalCard: true,
        trapFocus: true
      })
    },
    closeModal() {
      this.$emit('close')
    },
    focusInput() {
      this.$refs.email?.focus?.()
    }
  },
  mounted() {
    this.focusInput()
  }
}
</script>

<style>
span > .field {
  margin-bottom: 0.75em;
}
</style>
