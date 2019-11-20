<template>
  <transition v-if="pickerVisible" name="picker">
    <div
      @click="hide"
      class="ace-picker-mask">
      <div
        @click.stop
        class="ace-picker-panel">
        <div class="ace-picker-choose">
          <span
            @click="cancel"
            class="ace-picker-cancel">
            {{cancelText}}
          </span>
          <span
            @click="confirm"
            class="ace-picker-confirm">
            {{confirmText}}
          </span>
          {{title}}
        </div>
        <div class="ace-picker-content">
          <div class="ace-mask-top"></div>
          <div class="ace-mask-bottom"></div>
          <div
            ref="wheelWrap"
            class="ace-picker-wheel">
            <div
              class="ace-wheel"
              v-for="(item, index) in wheelDatas"
              :key="'item' + index">
              <ul>
                <li v-for="(child, childIndex) in item"
                :key="'child' + childIndex">
                  {{child[textLabel]}}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from '@better-scroll/core';
import Wheel from '@better-scroll/wheel';
BScroll.use(Wheel);

  export default {
    props: {
      cancelText: {
        type: String,
        default: '取消',
      },
      confirmText: {
        type: String,
        default: '确定',
      },
      title: {
        type: String,
      },
      wheelDatas: {
        type: Array,
        default() {
          return [];
        },
      },
      textLabel: {
        type: String,
        default: 'text',
      },
      pickerVisible: {
        type: Boolean,
        default: false,
      },
      selectIndexs: {
        type: Array,
        default() {
          return [0, 0, 0];
        },
      },
    },
    data() {
      return {
      }
    },
    mounted() {
      this.wheels = [];
    },
    methods: {
      cancel() {
        this.hide();
      },
      hide() {
        for (let i = 0, len = this.wheels.length; i < len; i++) {
          this.wheels[i] && this.wheels[i].disable();
        };
        this.$emit('hidePick', false);
        this.$emit('update:pickerVisible', false);
      },
      confirm() {
        let _arrItem = [];
        let _arrIndex = [0, 0, 0];
        for (let i = 0, len = this.wheels.length; i < len; i++) {
          const location = this.wheels[i].getSelectedIndex();
          if (this.wheelDatas[i][location]) {
            _arrItem.push(this.wheelDatas[i][location]);
            _arrIndex[i] = location;
          };
        };
        this.$emit('confirm', _arrItem, _arrIndex);
        this.hide();
      },
      initWheel() {
        if (!this.$refs.wheelWrap) {
          return
        }
        const childs = this.$refs.wheelWrap.children;
        for (let i = 0, len = childs.length; i < len; i++) {
          this.createWheel(childs[i], i);
        };
      },
      createWheel(el, i) {
        if (this.wheels[i]) {
          this.wheels[i].refresh();
        } else {
          this.wheels[i] = new BScroll(el, {
            wheel: {
              selectedIndex: this.selectIndexs[i],
            },
            probeType: 3
          });
          this.wheels[i].on('scrollEnd', () => {//实时监听滚动后所选的项，传给父组件
            this.$emit('change', i, this.wheels[i].getSelectedIndex());
          });
        }
      },
      wheelTo(i, j) {
        this.wheels[i] && this.wheels[i].wheelTo(j);
      },
    },
    beforeDestroy() {
      this.hide();
    },
    watch: {
      pickerVisible(flag) {
        if (!flag) {
          return;
        }
        this.wheels = [];
        this.$nextTick(() => {
          this.initWheel();
        });
      },
      wheelDatas() {
        this.$nextTick(() => {
          for (let i = 0, len = this.wheels.length; i < len; i++) {
            this.wheels[i] && this.wheels[i].refresh();
          };
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .picker-enter-active, .picker-leave-active {
    transition: all .3s ease-in-out;
    .ace-picker-panel {
      transition: transform .3s ease-in-out;
    }
  }
  .picker-enter, .picker-leave-to {
    opacity: 0;
    .ace-picker-panel {
      transform: translateY(274px);
    }
  }
  .ace-picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(37, 38, 45, .4);
    .ace-picker-panel {
      background-color: #ffffff;
      height: 274px;
      position: absolute;
      bottom: 0;
      width: 100%;
      .ace-picker-choose {
        position: relative;
        border-bottom: 1px solid #e5e5e5;
        height: 59px;
        line-height: 59px;
        text-align: center;
        color: #333333;
        span {
          position: absolute;
          top: 6px;
          display: block;
          height: 48px;
          line-height: 48px;
          padding: 0 16px;
          -webkit-tap-highlight-color: transparent;
          &.ace-picker-cancel {
            left: 0;
            color: #999999;
            cursor: pointer;
          }
          &.ace-picker-confirm {
            right: 0;
            color: #007bff;
            cursor: pointer;
          }
        }
      }
      .ace-picker-content {
        position: relative;
        padding: 20px 0;
        .ace-mask-top, .ace-mask-bottom {
          position: absolute;
          width: 100%;
          height: 67px;
          z-index: 20;
          pointer-events: none;
          background: linear-gradient(0deg, hsla(0, 0%, 100%, .4), hsla(0, 0%, 100%, .8));
        }
        .ace-mask-top {
          top: 20px;
        }
        .ace-mask-bottom {
          bottom: 20px;
        }
        .ace-picker-wheel {
          padding: 0 16px;
          display: flex;
          .ace-wheel {
            flex: 1;
            margin: 0 8px;
            height: 174px;
            overflow: hidden;
            ul {
              margin-top: 68px; 
              li {
                height: 36px;
                line-height: 36px;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
</style>
