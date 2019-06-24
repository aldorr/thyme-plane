<template>
    <form>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Login Form
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
              <b-field horizontal :type="{'is-danger':errors.has('email')}" :message="errors.first('email')" label="Email">
                      <b-input type="email" v-model="email" name="email" v-validate="'required|email'" value="email@domain.com" key="email-input" placeholder="your email address" />
              </b-field>
              <b-field horizontal :type="{'is-danger':errors.has('password')}" :message="errors.first('password')" label="Password">
                      <b-input type="password" v-model="password" name="password" v-validate="'required'" key="password-input" placeholder="something secret" />
              </b-field>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="validate">Connect</b-button>
            </footer>
        </div>
    </form>
</template>

<script>
export default {

  data: () => ({
    email: '',
    password: ''
  }),

  methods: {

    validate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.loginWithFirebase()
        } else {
          this.$toast.open({
            message: 'It seems your form is missing something! Please check the fields.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        }
      })
    },

    reset () {
      this.$refs.form.reset()
    },

    loginWithFirebase () {
      const user = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signInAction', user).then(
            this.$toast.open({
              message: 'Thanks for loggin\' in!',
              type: 'is-success',
              position: 'is-bottom'
            })
      );
      this.$parent.close()
      return;
    }
  }
}
</script>
