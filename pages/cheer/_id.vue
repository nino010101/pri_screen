<template>
  <section id="main">
    <div class="main-container">
      <h1 class="title">応援しよう！</h1>
      <p class="iine-counter">{{ roomData.iineCount }}いいね</p>
      <div class="iine-button">
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
      </div>
    </div>
  </section>
</template>

<script>
// smp用応援画面
/* eslint-disable no-console */

export default {
  data() {
    return {
      databaseRef: null,
      iineRef: null,
      roomData: {
        roomID: null,
        roomName: '',
        iineCount: 0
      }
    }
  },
  mounted() {
    // databaseにルームIDがなければ弾く
    this.$firebase
      .database()
      .ref('rooms')
      .once('value')
      .then((snapshot) => {
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
      this.iineRef = this.$firebase
        .database()
        .ref('rooms/' + this.roomData.roomID + '/iineCount')
      this.iineRef.on('value', (snapshot) => {
        // console.log(snapshot.val())
        this.roomData.iineCount = snapshot.val()
        if (snapshot.val() === null) {
          this.$buefy.dialog.alert({
            title: '終了',
            message: '配信が終了しました、画面を閉じてください',
            type: 'is-danger',
            hasIcon: true,
            icon: 'times-circle',
            iconPack: 'fa',
            onConfirm: () => this.$router.push('/')
          })
        }
      })
    },
    closeRoom(e) {
      e.preventDefault()
      this.$router.push('/')
    },
    doIine(e) {
      e.preventDefault()
      this.iineRef.once('value').then((snapshot) => {
        this.roomData.iineCount = snapshot.val()
        this.roomData.iineCount += 1
        this.iineRef.set(this.roomData.iineCount)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#main {
  display: flex;
  justify-content: center;
}

.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-top: 32px;
    color: #e856ba;
    text-align: center;
  }

  .iine-counter {
    font-size: 18px;
    font-weight: bold;
    margin-top: 32px;
    text-align: center;
  }

  .iine-button {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
