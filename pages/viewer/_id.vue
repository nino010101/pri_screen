<template>
  <div>
    <Viewer v-if="$device.isDesktop"></Viewer>
    <Cheer v-else></Cheer>
  </div>
</template>

<script>
import Viewer from '@/components/Viewer'
import Cheer from '@/components/Cheer'

export default {
  components: { Viewer, Cheer }
}
</script>
