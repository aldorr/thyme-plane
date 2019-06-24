<template>
  <section class="hero is-primary is-fullheight" style="background:url(https://source.unsplash.com/1600x720/?business,note)">
    <div class="hero-body">
      <div class="container" style="mix-blend-mode:difference;background-color:#000;">
        <h1 class="title">
          {{ msg }}
        </h1>
        <h2 class="subtitle">
          {{text}}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    text: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
