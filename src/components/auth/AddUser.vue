<template>
    <form>
  <ValidationObserver ref="observer" v-slot="{ passes }">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Neuer User hinzufügen
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider name="email" rules="required" v-slot="{ errors, valid }">
              <b-field horizontal :type="{'is-danger':errors[0], 'is-success':valid}" :message="errors" label="Name">
                      <b-input type="text" v-model="fullname" name="fullname" value="fullname@domain.com" key="fullname" placeholder="Regula Pfeiffer"  ref="name"/>
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors, valid }">
              <b-field horizontal :type="{'is-danger':errors[0], 'is-success':valid}" :message="errors" label="Email">
                      <b-input type="email" v-model="email" name="email" value="email@domain.com" key="email" placeholder="neuernutzer@breeder.de" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="password" rules="required" v-slot="{ errors, valid }">
              <b-field horizontal :type="{'is-danger':errors[0], 'is-success':valid}" :message="errors" label="Password">
                      <b-input type="password" v-model="password" name="password" key="password" placeholder="something-secret-and-maybe-funny" />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="passes(validate)">Hinzufügen</b-button>
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
    fullname: '',
    email: '',
    password: ''
  }),

  computed: {
    username () {
      // let atsignpos = this.fullname.indexOf("@")
      // let username = this.fullname.slice(atsignpos, )
      let username = this.fullname.toLowerCase();
      username = username.replace(/[|&;$%@"<>()+,\s]/g, "")
      // username.replace(/\s/g, '')
      // Ü, ü     \u00dc, \u00fc
      // Ä, ä     \u00c4, \u00e4
      // Ö, ö     \u00d6, \u00f6
      // ß        \u00df
      username = username.replace(/\u00e4/g, "ae")
      username = username.replace(/\u00f6/g, "oe")
      username = username.replace(/\u00fc/g, "ue")
      username = username.replace(/\u00df/g, "ss")
      return username
    }
  },

  methods: {

    validate () {
      // this.$validator.validateAll().then((result) => {
      //   if (result) {
          this.addUserToFirebase()
      //   } else {
      //     this.$buefy.toast.open({
      //       message: 'It seems your form is missing something! Please check the fields.',
      //       type: 'is-danger',
      //       position: 'is-bottom'
      //     })
      //   }
      // })
    },

    reset () {
      this.$refs.form.reset()
    },

    addUserToFirebase () {
      const user = {
        newuser:
          { fullname: this.fullname, username: this.username, email: this.email },
        email: this.email,
        password: this.password
      }
      // console.log(user)
      this.$store.dispatch('newUserAction', user).then(
            this.$buefy.toast.open({
              message: 'New user: ' + user.email +' added!',
              type: 'is-success',
              position: 'is-bottom'
            })
      );
      this.$parent.close()
      return;
    },
    focusInput() {
      this.$refs.name.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
}
</script>
