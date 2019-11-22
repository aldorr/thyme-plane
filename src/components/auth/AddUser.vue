<template>
    <form>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Neuer User hinzufügen
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
              <b-field horizontal :type="{'is-danger':errors.has('fullname')}" :message="errors.first('fullname')" label="fullname">
                      <b-input type="text" v-model="fullname" name="fullname" v-validate="'required'" value="fullname@domain.com" key="fullname-input" placeholder="Regula Pfeiffer" />
              </b-field>
              <b-field horizontal :type="{'is-danger':errors.has('email')}" :message="errors.first('email')" label="Email">
                      <b-input type="email" v-model="email" name="email" v-validate="'required|email'" value="email@domain.com" key="email-input" placeholder="neuernutzer@breeder.de" />
              </b-field>
              <b-field horizontal :type="{'is-danger':errors.has('password')}" :message="errors.first('password')" label="Password">
                      <b-input type="password" v-model="password" name="password" v-validate="'required'" key="password-input" placeholder="something-secret-and-maybe-funny" />
              </b-field>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="$parent.close()" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="validate">Hinzufügen</b-button>
            </footer>
        </div>
    </form>
</template>

<script>
export default {

  data: () => ({
    fullname: '',
    email: '',
    password: ''
  }),

  methods: {

    validate () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.addUserToFirebase()
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

    addUserToFirebase () {
      const user = {
        newuser:
          { fullname: this.fullname },
        email: this.email,
        password: this.password
      }
      // console.log(user)
      this.$store.dispatch('newUserAction', user).then(
            this.$toast.open({
              message: 'New user: ' + user.email +' added!',
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
