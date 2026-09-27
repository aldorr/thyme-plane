<template>
  <ValidationObserver ref="observer">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Password Reset Form
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
      </div>
      <footer class="modal-card-foot">
        <b-button @click="closeModal" style="margin-left:auto;">Cancel</b-button>
        <b-button
          type="is-success"
          icon-right="lock"
          @click.prevent="validateForm"
        >Send</b-button>
      </footer>
    </div>
  </ValidationObserver>
</template>

<script>
import { defineRule } from 'vee-validate'
import { required, email } from '@vee-validate/rules'
import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'

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
    email: ''
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
            this.passwordReset()
          }
        })
      } else {
        this.passwordReset()
      }
    },
    passwordReset() {
      const user = { email: this.email }
      this.$store.dispatch('passwordResetAction', user)
        .then(() => {
          this.$buefy.toast.open({
            message: 'Please check your email at ' + user.email + '.',
            type: 'is-primary',
            position: 'is-bottom',
            duration: 6000
          })
          this.$emit('close')
        }, (error) => {
          this.$buefy.toast.open({
            message: String(error?.message || error),
            type: 'is-danger',
            position: 'is-bottom',
            duration: 6000
          })
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
