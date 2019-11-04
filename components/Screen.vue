<template>
  <div
    class="screen"
    :style="{
      width: size.width + 'px',
      height: size.height + 'px'
    }"
  >
    <transition-group
      v-if="isDisplayEffect"
      tag="div"
      class="iine-view"
      name="iine-view-anime"
    >
      <div v-for="iine in iines" :key="iine.count">
        <IineStar
          :x="iine.x"
          :y="iine.y"
          :is-small="isEffectSmall"
          @iineDone="onIineDone()"
        ></IineStar>
      </div>
    </transition-group>
    <transition-group tag="div" class="msgBoxWrapper" name="msgBoxList">
      <div v-for="(val, idx) in msgList" :key="idx" class="msgBox">
        <p class="msg">{{ val.msg }}</p>
      </div>
    </transition-group>
    <video muted class="videoFrame" autoplay controls></video>
    <div class="iine-overlay">
      <p class="iine-text">{{ roomData.iineCount }} いいね</p>
    </div>
    <div class="roomname-overlay">
      <p class="roomname-text">{{ roomData.roomName }}</p>
    </div>
  </div>
</template>

<script>
// 表示画面コンポーネント
import IineStar from '~/components/IineStar'
export default {
  components: { IineStar },
  props: {
    iines: {
      type: Array,
      required: true
    },
    size: {
      type: Object,
      default: () => {
        return { width: 640, height: 360 }
      }
    },
    isDisplayEffect: {
      type: Boolean,
      default: true
    },
    isEffectSmall: {
      type: Boolean,
      default: false
    },
    roomData: {
      type: Object,
      required: true
    },
    msgList: {
      type: Array,
      default: null
    }
  },
  methods: {
    onIineDone() {
      this.$emit('iineDone')
    },
    addVideo(stream) {
      const video = document.querySelector('.videoFrame')
      video.srcObject = stream
    }
  }
}
</script>

<style lang="scss" scoped>
.screen {
  border: solid 1px;
  background: #000;
  position: relative;
}

.videoFrame {
  width: 100%;
  height: 100%;
}

.iine-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1100;
  .iine-text {
    font-size: 32px;
    font-weight: bold;
    -webkit-text-stroke: 1px #fff;
    color: #ef6bff;
  }
}

.roomname-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1100;
  .roomname-text {
    font-size: 32px;
    font-weight: bold;
    -webkit-text-stroke: 1px #fff;
    color: #ef6bff;
  }
}

.msgBoxWrapper {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0.5;
  .msgBox {
    width: 300px;
    background-color: #000;
    padding: 4px;
    margin-top: 4px;
    border-radius: 8px;

    .msg {
      color: #fff;
      font-weight: bold;
    }
  }
}
.msgBoxList-enter-active,
.msgBoxList-leave-active {
  transition: all 0.5s;
}
.msgBoxList-enter {
  opacity: 0;
  transform: translateX(30px);
}
.msgBoxList-leave-to {
  opacity: 0;
}
</style>
