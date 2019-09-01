<template>
  <div
    ref="acePUDownWrap"
    class="ace-pull-up-down-wrap">
    <div class="ace-list-wrap">
      <slot></slot>
      <div class="ace-up-wrap">
        <div
          v-if="pullUpIngFlag"
          class="ace-up-tips">
          <span>pulUp loadeMore</span>
        </div>
        <div
          class="ace-up-end"
          v-else>
          <slot name="pullUp"></slot>
          <img
            v-if="$slots.pullUp"
            src="../assets/loading.gif" alt="">
        </div>
      </div>
    </div>
    <div
      :style="pullDownStyle"
      class="ace-pull-down-wrap">
      <div
        v-if="beforePullDownFlag"
        class="ace-down-drop">
        <bubble :y="bubbleY"/>
      </div>
      <div
        v-else
        class="ace-down-loading">
        <slot name="pullDown"></slot>
        <img
          v-if="$slots.pullDown"
          src="../assets/loading.gif" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core';
  import PullDown from '@better-scroll/pull-down';
  import Pullup from '@better-scroll/pull-up';

  import bubble from '../base/bubble.vue';

  BScroll.use(Pullup)
  BScroll.use(PullDown)

  export default {
    name: 'pullUpDown',
    props: {
      loadData: {
        type: Number,
      },
      pullDown: {
        type: Boolean,
        degault: false,
      },
      pullUp: {
        type: Boolean,
        degault: false,
      },
    },
    components: {
      bubble,
    },
    data() {
      return {
        pullUpIngFlag: true,
        beforePullDownFlag: true,
        pullDownEnd: false,
        bubbleY: 0,
        pullDownStyle: '',
      };
    },
    mounted() {
      this.pullDownInitTop = -50;
      this.$nextTick(() => {
        this._initScroll();
        console.log(this, 'this')
      });
    },
    methods: {
      _initScroll() {
        const acePUDownWrap = this.$refs.acePUDownWrap;
        this.scroll = new BScroll(acePUDownWrap, {
          probeType : 3,
          scrollY: true,
          pullUpLoad: this.pullUp,
          pullDownRefresh: this.pullDown,
        })
        this.pullDown && this._pullDownRefresh()
      },
      _pullDownRefresh() {//开启下拉刷新后监听下拉动作
        this.scroll.on('pullingDown', () => {
          this.beforePullDownFlag = false;
          this.$emit('pullingDown');//下拉刷新后执行父组件的pullingDown方法
        });
        this.scroll.on('scroll', (pos) => {//下拉滚动时的样式变化
          if (this.beforePullDownFlag) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop);
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`;
          } else {
            this.bubbleY = 0;
          }
        });
      },
      fourceUpdate() {
        this.pullDownStyle = `top:${this.pullDownInitTop}px`;
        this.scroll.finishPullDown();
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`;
          this.beforePullDownFlag = true;
          this.scroll.refresh();//better-scroll刷新
        }, this.scroll.options.bounceTime); // bounceTime 设置的回弹动画时间
      }
    },
    watch: {
      loadData(newVal) {
        this.fourceUpdate();
      },
    },
  }
</script>

<style lang="scss" scoped>
  .ace-pull-up-down-wrap {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .ace-list-wrap {
      min-height: 1000px;
      .ace-up-wrap {
        .ace-up-tips, .ace-up-end {
          height: 50px;
          text-align: center;
          line-height: 50px;
          color: #333333;
        }
        .ace-up-end {
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .ace-pull-down-wrap {
      width: 100%;
      position: absolute;
      top: -50px;
      left: 0;
      transition: all;
      > div {
        text-align: center;
      }
      .ace-down-loading {
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>