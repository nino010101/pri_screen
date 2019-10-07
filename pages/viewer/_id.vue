<template>
  <section id="main">
    <div class="screen-container">
      <Screen
        ref="screen"
        :iines="iines"
        :room-data="roomData"
        :size="roomSize"
        @iineDone="onIineDone()"
      ></Screen>
    </div>
    <div class="menu-container">
      <div class="menu-list">
        <b-button
          class="menu-btn"
          size="is-large"
          type="is-primary"
          rounded
          icon-right="heart"
          @click="doIine"
        >
          いいね</b-button
        >
        <b-button
          type="is-light"
          size="is-small"
          class="menu-btn"
          @click="closeRoom"
          >退室</b-button
        >
      </div>
    </div>
  </section>
</template>

<script>
// 見る側画面
// TODO:止まるのなんとかする
/* eslint-disable no-console */
import Peer from 'skyway-js'
import Screen from '~/components/Screen'
import { getIinePositions } from '~/utils/commonFunc'

const peer = new Peer({ key: process.env.SKYWAY_APIKEY })

export default {
  components: { Screen },
  data() {
    return {
      stream: null,
      call: null,
      iines: [],
      databaseRef: null,
      iineRef: null,
      roomSize: {
        width: 1280,
        height: 720
      },
      roomData: {
        roomID: null,
        roomName: '',
        iineCount: 0
      }
    }
  },
  mounted() {
    // databaseにルームIDがなければ弾く
    this.databaseRef = this.$firebase.database().ref('rooms')
    this.databaseRef.once('value').then((snapshot) => {
      const roomList = snapshot.val()
      if (
        this.$route.params.id === undefined ||
        roomList[this.$route.params.id] === undefined
      ) {
        this.$buefy.dialog.alert({
          title: 'error',
          message: 'ルームが存在しません',
          type: 'is-danger',
          hasIcon: true,
          icon: 'times-circle',
          iconPack: 'fa',
          onConfirm: () => this.$router.push('/')
        })
      }
      this.roomData.roomID = roomList[this.$route.params.id].roomID
      this.roomData.roomName = roomList[this.$route.params.id].roomName
      this.roomData.iineCount = roomList[this.$route.params.id].iineCount
      // dataがあれば処理へ
      this.doJoinRoom(this.roomData.roomID)
    })
  },
  methods: {
    // room接続
    doJoinRoom(id) {
      const room = peer.joinRoom(id, { mode: 'sfu' })
      this.callEventHandlers(room)
      this.iineRef = this.$firebase
        .database()
        .ref('rooms/' + this.roomData.roomID + '/iineCount')
      this.iineRef.on('value', (snapshot) => {
        this.roomData.iineCount = snapshot.val()
        this.recvIine(this.roomData.iineCount)
        if (snapshot.val() === null) {
          this.$buefy.dialog.alert({
            title: '終了',
            message: '配信が終了しました、画面を閉じてください',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            onConfirm: () => this.closeRoom()
          })
        }
      })
    },
    // skywayのイベントハンドラ
    callEventHandlers(call) {
      console.dir(call)
      this.call = call
      call.on('stream', (stream) => {
        this.stream = stream
        this.$refs.screen.addVideo(stream)
      })
    },
    closeRoom() {
      if (this.stream.getTracks()[0]) {
        this.stream.getTracks()[0].stop()
      }
      this.call.close()
      this.$router.push('/')
    },
    doIine() {
      this.iineRef.once('value').then((snapshot) => {
        this.roomData.iineCount = snapshot.val()
        this.roomData.iineCount += 1
        this.iineRef.set(this.roomData.iineCount)
      })
    },
    recvIine(count) {
      const pattern = getIinePositions(1280, 720, 48, count)
      this.iines.push(pattern[Math.floor(Math.random() * 4)])
    },
    onIineDone() {
      this.$nextTick(() => {
        if (this.iines.length > 30) this.iines.splice(0, 30)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  flex-direction: column;
}
.screen-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.menu-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  .menu-list {
    width: 400px;
    display: flex;
    flex-direction: column;
    .menu-btn {
      margin-top: 8px;
    }
  }
}
.iine-view-anime {
  &-leave-active {
    transition: opacity 2s;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
