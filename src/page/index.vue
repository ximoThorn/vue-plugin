<template>
  <div class="home-wrap">
    <p>
      <router-link to="/mobile">go to mobile</router-link>
    </p>
    <p>
      <router-link to="/pc">go to pc</router-link>
    </p>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.home-wrap {
  padding: 20px;
}
</style>