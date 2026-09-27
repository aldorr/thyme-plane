<template>
    <form>
  <ValidationObserver ref="observer">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Password Reset Form
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider name="email" rules="required|email" v-slot="slotProps">
              <b-field horizontal label="Email" :type="getFieldType(slotProps)">
                      <b-input type="email" :message="getErrorMessage(slotProps)" v-model="email" name="email" value="email@domain.com" key="email" placeholder="your email address" ref="email"/>
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="validateForm">Send</b-button>
            </footer>
        </div>
  </ValidationObserver>
    </form>
</template>

<script>
import {
  defineRule
} from 'vee-validate';
import {
  required, email
} from '@vee-validate/rules';

// Add the rules
defineRule('email', email);
defineRule('required', (value) => {
  if (!required(value)) {
    return 'Don\'t forget…';
  }
  return true;
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
    validateForm() {
      if (this.$refs.observer && this.$refs.observer.validate) {
        this.$refs.observer.validate().then(({ valid }) => {
          if (valid) {
            this.validate();
          }
        });
      } else {
        this.validate();
      }
    },
    passwordReset() {
      const user = {
        email: this.email
      }
      this.$store.dispatch('passwordResetAction', user)
      .then(() => {
        // console.log(response)
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
