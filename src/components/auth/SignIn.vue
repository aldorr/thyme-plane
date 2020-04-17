<template>
    <form>
  <ValidationObserver ref="observer" v-slot="{ passes }">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Login Form
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors, valid }">
              <b-field horizontal label="Email" :type="{'is-danger':errors[0], 'is-success': valid}">
                      <b-input type="email" :message="errors[0]" v-model="email" name="email" value="email@domain.com" key="email" placeholder="your email address" ref="email"/>
              </b-field>
            </ValidationProvider>

            <ValidationProvider name="password" rules="required" v-slot="{ errors, valid }">
              <b-field horizontal :type="{'is-danger':errors[0], 'is-success': valid}" :message="errors[0]" label="Password">
                      <b-input type="password" v-model="password" name="password" key="password" placeholder="something secret" />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
              <b-button @click="openPasswordReset()" @mouseover="forgot='I forgot'" @mouseout="forgot='I'" style="margin-right:auto; width=32px;" type="is-danger" icon-right="heart-broken">{{forgot}}</b-button>
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="passes(validate)">Connect</b-button>
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

import PassReset from '@/components/auth/PassReset.vue'

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
  computed: {
    error() {
      return this.$store.state.error
    }
  },
  methods: {
    validate() {
          this.loginWithFirebase()
    },

    reset() {
      this.$refs.form.reset()
    },

    loginWithFirebase() {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signInAction', user)
      .then(response => {
          this.$buefy.toast.open({
            message: 'Thanks for loggin\' in with the email address: ' + response.user.email,
            type: 'is-success',
            position: 'is-bottom',
            duration: 3000
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

    openPasswordReset() {
      this.$buefy.modal.open({
          parent: this,
          component: PassReset,
          hasModalCard: true,
          trapFocus: true
      })
    },

    focusInput() {
      this.$refs.email.focus()
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