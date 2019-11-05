<template>
  <section id="main">
    <div class="screen-container">
      <Screen
        ref="screen"
        :iines="iines"
        :room-data="roomData"
        :size="roomSize"
        :is-effect-small="false"
        :msg-list="dispMsgList"
        @iineDone="onIineDone()"
        @onExpand="onExpand()"
      ></Screen>
    </div>
    <div v-show="!roomSize.isExpand" class="menu-container">
      <div class="menu-list">
        <b-button
          class="menu-btn"
          size="is-large"
          type="is-primary"
          @click="doIine"
        >
          いいね</b-button
        >
        <b-field class="menu-msg">
          <b-input v-model="sendMsg" expanded maxlength="60"> </b-input>
          <p class="control">
            <button class="button is-primary" @click="doSendMsg">送信</button>
          </p>
        </b-field>
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
      msgRef: null,
      roomSize: {
        width: 800,
        height: 450,
        starSize: 48,
        isExpand: false
      },
      roomData: {
        roomID: null,
        roomName: '',
        iineCount: 0
      },
      sendMsg: '',
      msgList: [],
      dispMsgList: []
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
          icon: 'alert-circle',
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
      this.msgRef = this.$firebase
        .database()
        .ref('rooms/' + this.roomData.roomID + '/msgList')
      this.iineRef.on('value', (snapshot) => {
        this.roomData.iineCount = snapshot.val()
        this.recvIine(this.roomData.iineCount)
        if (snapshot.val() === null) {
          this.$buefy.dialog.alert({
            title: '終了',
            message: '配信が終了しました、画面を閉じてください',
            type: 'is-danger',
            hasIcon: true,
            icon: 'alert-circle',
            onConfirm: () => this.closeRoom()
          })
        }
      })
      this.msgRef.on('child_added', (snapshot) => {
        this.msgList.push(snapshot.val().msg)
        if (this.dispMsgList.length > 2) {
          const shift = this.dispMsgList.shift()
          window.clearTimeout(shift.timeoutID)
          const timeoutID = window.setTimeout(() => {
            this.dispMsgList.shift()
          }, 10000)
          this.dispMsgList.push({ msg: snapshot.val().msg, timeoutID })
        } else {
          const timeoutID = window.setTimeout(() => {
            this.dispMsgList.shift()
          }, 10000)
          this.dispMsgList.push({ msg: snapshot.val().msg, timeoutID })
        }
      })
    },
    // skywayのイベントハンドラ
    callEventHandlers(call) {
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
      const pattern = getIinePositions(
        this.roomSize.width,
        this.roomSize.height,
        this.roomSize.starSize,
        count
      )
      this.iines.push(pattern[Math.floor(Math.random() * 4)])
    },
    onIineDone() {
      this.$nextTick(() => {
        if (this.iines.length > 30) this.iines.splice(0, 30)
      })
    },
    doSendMsg() {
      if (this.sendMsg !== '') {
        this.msgRef.push({ msg: this.sendMsg })
        this.sendMsg = ''
      }
    },
    onExpand() {
      if (this.roomSize.isExpand) {
        this.roomSize.width = 800
        this.roomSize.height = 450
        this.roomSize.isExpand = false
        window.onresize = null
      } else {
        const vw = window.innerWidth
        const vh = window.innerHeight
        this.roomSize.width = vw
        this.roomSize.height = vh
        this.roomSize.isExpand = true
        window.onresize = this.onResize
      }
    },
    onResize() {
      if (this.roomSize.isExpand) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        this.roomSize.width = vw
        this.roomSize.height = vh
      }
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
      margin-top: 16px;
    }
    .menu-msg {
      margin-top: 16px;
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
