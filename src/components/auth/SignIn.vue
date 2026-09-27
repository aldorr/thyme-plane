<template>
    <form>
  <ValidationObserver ref="observer">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Log in to Thyme Plan
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider name="email" rules="required|email" v-slot="slotProps">
              <b-field horizontal label="Email" 
                :type="{ 'is-danger': !!(slotProps?.errors && Array.isArray(slotProps.errors) && slotProps.errors.length > 0), 'is-success': !!(slotProps?.valid === true) }" 
                :message="(slotProps?.errors && Array.isArray(slotProps.errors) && slotProps.errors.length > 0) ? String(slotProps.errors[0] || '') : ''">
                      <b-input type="email" v-model="email" name="email" value="email@domain.com" key="email" placeholder="your email address" ref="email"/>
              </b-field>
            </ValidationProvider>

            <ValidationProvider name="password" rules="required" v-slot="slotProps">
              <b-field horizontal 
                :type="{ 'is-danger': !!(slotProps?.errors && Array.isArray(slotProps.errors) && slotProps.errors.length > 0), 'is-success': !!(slotProps?.valid === true) }" 
                :message="(slotProps?.errors && Array.isArray(slotProps.errors) && slotProps.errors.length > 0) ? String(slotProps.errors[0] || '') : ''" 
                label="Password">
                      <b-input type="password" v-model="password" name="password" key="password" placeholder="geheimeSachen2020" password-reveal />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
              <b-button @click="openPasswordReset()" @mouseover="forgot='I forgot'" @mouseout="forgot='I'" style="margin-right:auto; width=32px;" type="is-danger" icon-right="heart-broken">{{forgot}}</b-button>
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="validateForm">Log In</b-button>
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
import { toRaw } from 'vue'

import PassReset from '@/components/auth/PassReset.vue'

export default {
        components: {
            ValidationObserver: ValidationObserver,
            ValidationProvider: ValidationProvider
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
    getTypeObject(errors, valid) {
      // Safely unwrap Proxy objects and return plain object with primitive values
      let safeErrors = errors;
      let safeValid = valid;
      
      // Unwrap if needed (defensive programming)
      try {
        if (errors && typeof errors === 'object') {
          const raw = toRaw(errors);
          if (Array.isArray(raw)) {
            safeErrors = Array.from(raw).map(e => String(e || ''));
          } else {
            safeErrors = [];
          }
        } else if (!Array.isArray(errors)) {
          safeErrors = [];
        }
      } catch (e) {
        safeErrors = [];
      }
      
      try {
        if (valid !== undefined && valid !== null) {
          const raw = toRaw(valid);
          safeValid = raw === true;
        } else {
          safeValid = false;
        }
      } catch (e) {
        safeValid = false;
      }
      
      // Return plain object with primitive values
      return {
        'is-danger': Boolean(safeErrors && safeErrors.length > 0),
        'is-success': Boolean(safeValid)
      };
    },
    getErrorMessage(errors) {
      // Safely unwrap Proxy objects and return error message string
      let safeErrors = errors;
      
      // Unwrap if needed (defensive programming)
      try {
        if (errors && typeof errors === 'object') {
          const raw = toRaw(errors);
          if (Array.isArray(raw)) {
            safeErrors = Array.from(raw).map(e => String(e || ''));
          } else {
            safeErrors = [];
          }
        } else if (!Array.isArray(errors)) {
          safeErrors = [];
        }
      } catch (e) {
        safeErrors = [];
      }
      
      if (!safeErrors || !Array.isArray(safeErrors) || safeErrors.length === 0) return '';
      return String(safeErrors[0] || '');
    },
    validate() {
          this.loginWithFirebase()
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
    reset() {
      this.$refs.form.reset()
    },

    loginWithFirebase() {
      const user = {
        email: this.email,
        password: this.password
      }
      // First manually close the modal to ensure it disappears immediately
      try {
        // Attempt to close the modal immediately
        if (this.$parent && typeof this.$parent.close === 'function') {
          this.$parent.close();
        }
        // Also try DOM approach
        document.querySelectorAll('.modal').forEach(modal => {
          modal.classList.remove('is-active');
        });
      } catch (err) {
        console.error('Error pre-closing modal:', err);
      }

      // Then handle the authentication
      this.$store.dispatch('signInAction', user)
      .then(response => {
          this.$buefy.toast.open({
            message: 'You have successfully logged in with the following email address: ' + response.user.email,
            type: 'is-success',
            position: 'is-bottom',
            duration: 3000
          })
          
          // Navigation is now handled in the store
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
