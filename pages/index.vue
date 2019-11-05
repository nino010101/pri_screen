<template>
  <section id="main-section">
    <div class="logo-container">
      <h1 class="logo">
        LT Screen!
      </h1>
    </div>
    <div class="menu-container">
      <div class="menu-list">
        <div class="menu-top">
          <b-button
            type="is-primary"
            size="is-large"
            class="button-big"
            rounded
            :disable="$device.isMobile"
            @click="doWebcast"
          >
            配信を開始する
          </b-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    doWebcast() {
      this.$router.push('streamer')
    }
  }
}
</script>

<style lang="scss" scoped>
#main-section {
  .logo-container {
    padding-top: 64px;
    width: 100%;
    display: flex;
    justify-content: center;
    .logo {
      font-size: 120px;
      font-weight: bold;
      color: #4099ff;
    }
  }
  .menu-container {
    width: 100%;
    display: flex;
    justify-content: center;
    .menu-list {
      display: flex;
      flex-direction: column;
      .menu-top {
        margin-top: 32px;
      }
      .menu-bottom,
      .menu-middle {
        margin-top: 16px;
        display: flex;
        justify-content: center;
      }
    }
    .button {
      &-big {
        font-size: 21px;
        font-weight: bold;
      }
    }
  }
}
</style>
