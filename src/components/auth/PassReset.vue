<template>
    <form>
  <ValidationObserver ref="observer" v-slot="{ passes }">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Password Reset Form
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors, valid }">
              <b-field horizontal label="Email" :type="{'is-danger':errors[0], 'is-success': valid}">
                      <b-input type="email" :message="errors[0]" v-model="email" name="email" value="email@domain.com" key="email" placeholder="your email address" />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="passes(validate)">Send</b-button>
            </footer>
        </div>
  </ValidationObserver>
    </form>
</template>

<script>
import {
  extend
} from 'vee-validate';
import {
  required, email
} from 'vee-validate/dist/rules';

// Add the rules
extend('email', email);
extend('required', {
  ...required,
  message: 'Nicht vergessen…'
});

import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'

export default {
        components: {
            ValidationObserver,
            ValidationProvider
        },

  data: () => ({
    email: ''
  }),
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  methods: {
    validate() {
          this.passwordReset()
          // want to display friendly message if invalid...
          // not just red marks everywhere.
    },

    passwordReset() {
      const user = {
        email: this.email
      }
      this.$store.dispatch('passwordResetAction', user)
      .then(response => {
        console.log(response)
          this.$buefy.toast.open({
            message: 'Please check your email at ' + user.email + '.',
            type: 'is-primary',
            position: 'is-bottom',
            duration: 6000
          })
          this.$emit('close')
      },
      error => {
          // Handle Errors here.
          let errorMessage = error;
          this.$buefy.toast.open({
            message: errorMessage,
            type: 'is-danger',
            position: 'is-bottom',
            duration: 6000
          })
      })
      // return;
    },

  }
}
</script>

<style>
span > .field {
  margin-bottom: 0.75em;
}
</style>