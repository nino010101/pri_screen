<template>
  <div class="iine-star" :style="{ left: x + 'px', top: y + 'px' }">
    <img :class="[isSmall ? 'img-star-small' : 'img-star']" src="/star.png" />
  </div>
</template>

<script>
import anime from 'animejs/lib/anime.es'
export default {
  props: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    },
    isSmall: {
      type: Boolean,
      defaul: false
    }
  },
  mounted() {
    anime({
      targets: ['.img-star', '.img-star-small'],
      easing: 'easeOutQuint',
      autoplay: true,
      duration: 2000, // 1.2s
      opacity: 0,
      scale: 2
    })
    setInterval(() => {
      this.$emit('iineDone')
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.img-star {
  width: 48px;
  height: 48px;
  &-small {
    width: 24px;
    height: 24px;
  }
}

.iine-star {
  position: absolute;
  z-index: 1000;
}
</style>
