<template>
  <div>
    <pullUpDown
      :loadData="lists"
      @pullingDown="pullingDown">
      <ul class="list-wrap">
        <li 
          v-for="index in lists"
          :key="index">
          this is {{index}}
        </li>
      </ul>
    </pullUpDown>
  </div>
</template>

<script>
  import pullUpDown from '../../components/pullUpDown.vue';
  export default {
    data() {
      return {
        lists: 20,
      };
    },
    components: {
      pullUpDown,
    },
    methods: {
      pullingDown() {
        setTimeout(() => { // 异步
          this.lists++;
        }, 2000);
      },
    },
  }
</script>

<style lang="scss" scoped>
.list-wrap {
  li {
    height: 40px;
    text-align: center;
    line-height: 40px;
  }
}
</style>