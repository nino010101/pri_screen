<template>
  <section id="main">
    <div class="streamer-container">
      <div class="screen">
        <transition-group tag="div" class="iine-view" name="iine-view-anime">
          <div v-for="iine in iines" :key="iine.count">
            <IineStar
              :x="iine.x"
              :y="iine.y"
              :is-small="true"
              @iineDone="onIineDone()"
            ></IineStar>
          </div>
        </transition-group>
        <video muted class="videoFrame" autoplay></video>
      </div>
      <div class="menu-container">
        <b-button type="is-primary" @click="startShare">
          配信をはじめる！
        </b-button>
        <b-button type="is-light" @click="finishStream">
          配信をおわる！
        </b-button>
      </div>
      <div class="info-container">
        <p>ルーム名: {{ roomData.roomName }}</p>
        <p>いいね: {{ roomData.iineCount }}</p>
      </div>
      <div class="share-container">
        <div class="share-list">
          <div class="share-viewer">
            <b-input
              id="view-url"
              class="copy-text"
              size="is-small"
              :value="viewURL"
              readonly
            ></b-input>
            <b-button
              class="copy-button"
              size="is-small"
              @click="doCopyUrl('view-url')"
            >
              配信URLをコピー
            </b-button>
          </div>
        </div>
        <div class="share-list">
          <div class="share-viewer">
            <b-input
              id="cheer-url"
              class="copy-text"
              size="is-small"
              :value="cheerURL"
              readonly
            ></b-input>
            <b-button
              class="copy-button"
              size="is-small"
              @click="doCopyUrl('cheer-url')"
            >
              応援URLをコピー
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// 配信者側画面
// TODO:streamer側の星を消す
/* eslint-disable no-console */
import Peer from 'skyway-js'
import IineStar from '~/components/IineStar'
import { getUniqueId, getIinePositions } from '~/utils/commonFunc'

const peer = new Peer({ key: process.env.SKYWAY_APIKEY })
const HOST = `${window.location.protocol}//${window.location.host}`

export default {
  components: { IineStar },
  data() {
    return {
      stream: null,
      call: null,
      iines: [],
      iineRef: null,
      iineCount: 0,
      viewURL: '',
      cheerURL: '',
      roomData: {
        roomID: null,
        roomName: '',
        iineCount: 0
      }
    }
  },
  mounted() {
    // 画面開始時にルーム名を入力
    this.$buefy.dialog.prompt({
      message: 'ルーム名を入力してください',
      inputAttrs: {
        placeholder: 'ルーム名',
        maxlength: 10
      },
      confirmText: '決定',
      trapFocus: false,
      focusOn: 'cancel',
      canCancel: false,
      onConfirm: (value) => (this.roomData.roomName = value)
    })
  },
  methods: {
    // 配信側→シェア開始したらそのままビデオを表示する
    // 受信側→call.on(stream)で受信したら表示する
    async startShare() {
      try {
        // PC画面のstream取得
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: 1280,
            height: 720,
            frameRate: 24
          }
        })
        // streamをvideoにつなげる
        this.stream = stream
        this.createRoom()
        this.viewURL = `${HOST}/viewer/${this.roomData.roomID}`
        this.cheerURL = `${HOST}/cheer/${this.roomData.roomID}`
        this.addVideo(this.stream)
      } catch (e) {}
    },
    createRoom() {
      this.roomData.roomID = getUniqueId()
      this.call = peer.joinRoom(this.roomData.roomID, {
        mode: 'sfu',
        stream: this.stream
      })
      if (!this.call) return
      const roomRef = this.$firebase
        .database()
        .ref('rooms/' + this.roomData.roomID)
      const dataObject = {
        roomID: this.roomData.roomID,
        roomName: this.roomData.roomName,
        iineCount: this.roomData.iineCount,
        isStreaming: true
      }
      roomRef.set(dataObject, (err) => {
        if (err) {
          // commit failed
          console.log(err)
        } else {
          this.iineRef = this.$firebase
            .database()
            .ref('rooms/' + this.roomData.roomID + '/iineCount')
          this.iineRef.on('value', (snapshot) => {
            this.roomData.iineCount = snapshot.val()
            this.recvIine(this.roomData.iineCount)
          })
        }
      })
    },
    finishStream() {
      if (!this.call) return
      this.stream.getTracks()[0].stop()
      this.call.close()
      const roomRef = this.$firebase
        .database()
        .ref('rooms/' + this.roomData.roomID)
      roomRef.set(null)
      this.$router.push('/')
    },
    addVideo(stream) {
      const video = document.querySelector('.videoFrame')
      video.srcObject = stream
    },
    recvIine(count) {
      const pattern = getIinePositions(640, 320, 24, count)
      this.iines.push(pattern[Math.floor(Math.random() * 4)])
    },
    onIineDone() {
      this.$nextTick(() => {
        if (this.iines.length > 30) this.iines.splice(0, 30)
      })
    },
    doCopyUrl(id) {
      const target = document.getElementById(id)
      target.select()
      document.execCommand('copy')
    }
  }
}
</script>

<style lang="scss" scoped>
.streamer-container {
  margin: 16px;
}

.screen {
  width: 640px;
  height: 360px;
  border: solid 1px;
  background: #000;
}

.videoFrame {
  width: 100%;
  height: 100%;
}

.menu-container {
  margin-top: 16px;
}

.iine-view-anime {
  &-leave-active {
    transition: opacity 2s;
  }
  &-leave-to {
    opacity: 0;
  }
}
.info-container {
  margin-top: 16px;
}
.share-container {
  margin-top: 16px;
  width: 640px;
}
.share-list {
  width: 640px;
  .share-viewer {
    display: flex;
    justify-content: space-between;
    .copy-button {
      width: 160px;
    }
    .copy-text {
      width: 480px;
    }
  }
}
</style>
