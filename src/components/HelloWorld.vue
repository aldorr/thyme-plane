<template>
  <section class="hero is-primary is-fullheight" style="background:url(https://source.unsplash.com/1600x720/?business,note);background-size:cover;">
    <div class="hero-body">
      <div class="container">
        <h1 class="title title-w-image">
          <span class="text">{{ msg }}</span>
          <svg width="100%" height="100%" viewBox="0 0 974 176" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><rect id="thyme-plane" x="0" y="0.314" width="973.996" height="175" style="fill:none;"/><text x="145.885px" y="136.178px" style="font-family:'AvenirNext-Bold', 'Avenir Next', sans-serif;font-weight:700;font-size:144px;">t<tspan x="193.117px 275.629px 350.941px 477.661px 557.149px 597.757px 686.029px 722.605px 797.773px 880.141px " y="136.178px 136.178px 136.178px 136.178px 136.178px 136.178px 136.178px 136.178px 136.178px 136.178px ">hyme-plane</tspan></text><g id="favicon"><path d="M16.013,82.129l75.032,-68.887l16.06,13.063l-61.07,55.824l67.45,52.422l-15.513,14.244l-81.959,-66.666Z" style="fill:#267bd9;"/><path d="M75.118,81.584l47.135,-43.479l9.402,7.647l-38.912,35.832l42.372,33.109l-9.063,8.321l-50.934,-41.43Z" style="fill:#267bd9;"/></g></svg>
        </h1>
        <h2 class="subtitle" @click="openLogin()" >
          {{ text }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
import SigninVue from '@/components/auth/SignIn.vue'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    text: String
  },
  methods: {
    openLogin() {
        this.$buefy.modal.open({
            parent: this,
            component: SigninVue,
            hasModalCard: true,
            trapFocus: true
        })
        this.hideNav()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hero.is-primary {
  background-color: #222;
}
h1.title.title-w-image {
    display: flex;
    width: 100%;
    justify-content: center;
    text-shadow: 0px 0px 2px #000c;
    gap: 1rem;
}

h1 svg {
  max-width: 50vw;
  width: auto;
  max-height: 36px;
  text-shadow: 0px 0px 2px #fffc;
}

h2 {
  text-shadow: 0px 0px 2px #000c;
  cursor: pointer;
  transition: all 350ms;
}
h2:hover {
  color: #000 !important;
  text-shadow: 0px 0px 2px #fffc;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
