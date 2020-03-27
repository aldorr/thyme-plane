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

              <b-field horizontal :type="{'is-danger':errors[0], 'is-success': valid}" :message="errors[0]" label="Email">
                      <b-input type="email" v-model="email" name="email" value="email@domain.com" key="email" placeholder="your email address" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="password" rules="required" v-slot="{ errors, valid }">
              <b-field horizontal :type="{'is-danger':errors[0], 'is-success': valid}" :message="errors[0]" label="Password">
                      <b-input type="password" v-model="password" name="password" key="password" placeholder="something secret" />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
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

export default {
        components: {
            ValidationObserver,
            ValidationProvider
        },

  data: () => ({
    email: '',
    password: ''
  }),

  methods: {

    validate() {

        // if (this.$refs.form.valid) {
          this.loginWithFirebase()
        // } else {
        //   this.$buefy.toast.open({
        //     message: 'It seems your form is missing something! Please check the fields.',
        //     type: 'is-danger',
        //     position: 'is-bottom'
        //   })
        // }

    },

    reset() {
      this.$refs.form.reset()
    },

    loginWithFirebase() {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signInAction', user).then(

        this.$store.dispatch("loadTimeEntries").then(
          this.$buefy.toast.open({
            message: 'Thanks for loggin\' in!',
            type: 'is-success',
            position: 'is-bottom'
          })
        )
      );
      this.$router.push({ name: 'about'})
      this.$emit('close')
      return;
    }
  }
}
</script>
