<template>
  <section id="main">
    <video class="videoFrame" autoplay></video>
    <br />
    <button @click="startShare">start share</button>
    <button @click="doJoinRoom">join room</button>
  </section>
</template>

<script>
/* eslint-disable no-console */
import Peer from 'skyway-js'
// FIXME:一旦ソース上に持つ、あとで外部ファイル化する
const SKYWAY_KEY = '***'
const peer = new Peer({ key: SKYWAY_KEY })
export default {
  data() {
    return {
      stream: null,
      call: null
    }
  },
  mounted() {
    console.log(peer)
  },
  methods: {
    // 配信側→シェア開始したらそのままビデオを表示する
    // 受信側→call.on(stream)で受信したら表示する
    async startShare() {
      try {
        // PC画面のstream取得
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        // streamをvideoにつなげる
        this.stream = stream
        this.doJoinRoom()
      } catch (e) {}
    },
    doJoinRoom() {
      const room = peer.joinRoom('test', { mode: 'sfu', stream: this.stream })
      this.callEventHandlers(room)
      console.log(room)
    },
    callEventHandlers(call) {
      if (this.call) {
        this.call.close()
      }

      this.call = call
      call.on('stream', (stream) => {
        this.addVideo(stream)
      })
    },
    addVideo(stream) {
      const video = document.querySelector('.videoFrame')
      video.srcObject = stream
    }
  }
}
</script>

<style lang="scss" scoped>
.videoFrame {
  height: 450px;
  width: 800px;
}
</style>
