<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                Add New User
                </p>
                <b-icon icon="lock"></b-icon>
            </header>
            <div class="modal-card-body">
            <ValidationProvider v-model="fullname" name="fullname" rules="required" v-slot="slotProps">
              <b-field horizontal :type="getFieldType(slotProps)" :message="getErrorMessage(slotProps)" label="Name">
                      <b-input type="text" v-model="fullname" name="fullname" key="fullname" placeholder="Chucky Armbruster"  ref="name"/>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-model="email" name="email" rules="required|email" v-slot="slotProps">
              <b-field horizontal :type="getFieldType(slotProps)" :message="getErrorMessage(slotProps)" label="Email">
                      <b-input type="email" v-model="email" name="email" key="email" placeholder="newuser@aldorr.net" />
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-model="password" name="password" rules="required" v-slot="slotProps">
              <b-field horizontal :type="getFieldType(slotProps)" :message="getErrorMessage(slotProps)" label="Password">
              <!-- TODO: Make password revealer... -->
                      <b-input type="password" v-model="password" name="password" key="password" placeholder="something-secret-and-maybe-funny" password-reveal />
              </b-field>
            </ValidationProvider>
            </div>
            <footer class="modal-card-foot">
                    <b-button @click="closeModal" style="margin-left:auto;">Cancel</b-button>
                    <b-button
                    type="is-success"
                    icon-right="lock"
                    @click.prevent="handleSubmit(submit)">Add</b-button>
            </footer>
        </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  defineRule
} from 'vee-validate';
import {
  required,
  email
} from '@vee-validate/rules';
import { ToastProgrammatic as Toast } from 'buefy'
import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'

// Add the rules
defineRule('email', email);
defineRule('required', (value) => {
  if (!required(value)) {
    return 'Don\'t forget…';
  }
  return true;
});

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
    username() {
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
    getFieldType(slotProps) {
      if (!slotProps) return {};
      const hasError = slotProps.errors && Array.isArray(slotProps.errors) && slotProps.errors.length > 0;
      const isValid = slotProps.valid === true;
      return {
        'is-danger': hasError,
        'is-success': isValid
      };
    },
    getErrorMessage(slotProps) {
      if (!slotProps || !slotProps.errors) return '';
      if (!Array.isArray(slotProps.errors) || slotProps.errors.length === 0) return '';
      // Extract the first error value, ensuring it's a primitive
      const firstError = slotProps.errors[0];
      if (firstError == null) return '';
      // Convert to string, handling Proxy objects
      try {
        return String(firstError);
      } catch (e) {
        // If String() fails, try JSON serialization to unwrap Proxy
        try {
          return JSON.parse(JSON.stringify(firstError));
        } catch (e2) {
          return '';
        }
      }
    },

    validate() {
      this.$validator.validateAll().then((result) => {
        if (result) {
      this.addUserToFirebase()
        } else {
          Toast.open({
            message: 'It seems your form is missing something! Please check the fields.',
            type: 'is-danger',
            position: 'is-bottom'
          })
        }
      })
    },

    submit() {
      this.addUserToFirebase()
    },

    reset() {
      this.$refs.form.reset()
    },

    addUserToFirebase() {
      const user = {
        newuser: {
          fullname: this.fullname,
          username: this.username,
          email: this.email
        },
        email: this.email,
        password: this.password
      }
      // console.log(user)
      this.$store.dispatch('newUserAction', user).then(
        Toast.open({
          message: 'New user: ' + user.email + ' added!',
          type: 'is-success',
          position: 'is-bottom'
        })
      )
        // .catch(
        //   Toast.open({
        //   message: 'New user: ' + user.email + ' unsuccesful!',
        //   type: 'is-danger',
        //   position: 'is-bottom'
        // })
      // );
      this.$emit('close')
      return;
    },
    closeModal() {
      this.$emit('close')
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
