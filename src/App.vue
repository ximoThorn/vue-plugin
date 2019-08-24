<template>
  <div id="app">
    <div
      @click="pickerSingleFlag = true"
      class="sel-btn">
      {{singleSelectText}}
    </div>
    <div
      @click="pickerDoubleFlag = true"
      class="sel-btn">
      {{doubleSelectText}}
    </div>
    <div
      @click="pickeMorerFlag = true"
      class="sel-btn">
      {{moreSelectText}}
    </div>

    <!-- 单个选项 -->
    <picker
      @confirm="pickerConfirm"
      @change="pickerChange"
      title="title1"
      :selectIndexs="singleSelectedIndex"
      :wheelDatas="pickerSingle"
      :pickerVisible.sync="pickerSingleFlag">
    </picker>
    <!-- 两个选项 -->
    <picker
      @confirm="pickerConfirm"
      @change="pickerChange"
      title="title2"
      :selectIndexs="doubleSelectedIndex"
      :wheelDatas="pickerDouble"
      :pickerVisible.sync="pickerDoubleFlag">
    </picker>
    <!-- 三个选项 -->
    <picker
      ref="morePicker"
      @confirm="pickerConfirm"
      @change="pickerMoreChange"
      title="title3"
      :selectIndexs="moreSelectedIndex"
      :wheelDatas="pickerThree"
      :pickerVisible.sync="pickeMorerFlag">
    </picker>
  </div>
</template>

<script>
import picker from "./components/picker.vue";
import { pickerSingle, pickerDouble, pickerThree } from './config/config';

export default {
  name: "app",
  data() {
    let pickerMore = [];
    const deepArr = JSON.parse(JSON.stringify(pickerThree));
    let _arr = [];
    for (const item of deepArr) {
      _arr.push(item);
    };
    pickerMore[0] = _arr;
    pickerMore[1] = pickerThree[0].children;
    pickerMore[2] = pickerThree[0].children[0].children;
    return {
      pickerSingleFlag: false,
      pickerSingle,
      singleSelectedIndex: [0, 0, 0],
      singleSelectText: 'select1',
      pickerDoubleFlag: false,
      pickerDouble,
      doubleSelectedIndex: [0, 0, 0],
      doubleSelectText: 'select2',
      pickeMorerFlag: false,
      pickerThree: pickerMore,
      moreSelectedIndex: [0, 0, 0],
      moreSelectText: 'select3',
    }
  },
  components: {
    picker
  },
  mounted() {
  },
  methods: {
    pickerConfirm(val, indexs) {
      if (val.length === 1) {
        this.singleSelectedIndex = indexs;
        this.singleSelectText = `${val[0].text}`;
      } else if (val.length === 2) {
        this.doubleSelectedIndex = indexs;
        this.doubleSelectText = `${val[0].text}, ${val[1].text}`;
      } else {
        this.moreSelectedIndex = indexs;
        this.moreSelectText = `${val[0].text}, ${val[1].text}, ${val[2].text}`;
      }
      console.log(val, 'val');
    },
    pickerChange(i, j) {
      console.log(i, j);
    },
    pickerMoreChange(i, j) { // 三级联动时的数据映射 
      console.log(i, j);
      let _arr1 = this.pickerThree[i][j].children;;
      let _arr2 = [];
      if (i === 0) {
        this.$refs.morePicker.wheelTo(1, 0);
        this.$refs.morePicker.wheelTo(2, 0);
        if (_arr1.length === 1) {
          const _arr2 = _arr1[0].children;
          this.$set(this.pickerThree, 1, _arr1);
          this.$set(this.pickerThree, 2, _arr2);
          return;
        }
        _arr2 = _arr1[0].children;
        this.$set(this.pickerThree, 1, _arr1);
        this.$set(this.pickerThree, 2, _arr2);
      } else if (i === 1) {
        this.$refs.morePicker.wheelTo(2, 0);
        this.$set(this.pickerThree, 2, _arr1);
      };
    },
  },
};
</script>

<style lang="scss">
  div,ul,li {
    box-sizing: border-box;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .sel-btn {
    width: 80%;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border: 1px solid #e5e5e5;
    margin: 0 auto 40px;
  }
</style>
