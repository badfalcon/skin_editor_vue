<template>
  <div  draggable="true" :id="'layer_' + layer_obj.id" ref="layer" @click="select"
       :class="[{hidden: !layer_obj.visible},'layer']"
       @click.right.prevent="openLayerMenu">
<!--    <canvas class="layer-thumbnail" ref="layerCanvas" width="50px" height="50px"></canvas>-->
    <span class="layer_name">{{ layer_obj.nickname }}</span> <!--todo check-->
    <button class="layer_visible" @click="toggle">sh/hi</button>
    <button class="layer_delete" @click="remove">rem</button>
    <button class="layer_up" @click="up">↑</button>
    <button class="layer_down" @click="down">↓</button>
  </div>
</template>

<script>
export default {
  props: ['layer_obj'],
  name: "Layer",
  data() {
    return {
    }
  },
  methods: {
    select() {
      console.log("select");
      this.$emit("layer-select")
    },
    toggle(e) {
      this.$emit("layer-toggle")
      e.stopPropagation();
    },
    remove(e){
      this.$emit("layer-remove")
      e.stopPropagation();
    },
    up(e) {
      this.$emit("layer-up")
      e.stopPropagation();
    },
    down(e) {
      this.$emit("layer-down")
      e.stopPropagation();
    },
    openLayerMenu() {
      console.log("openLayerMenu")

      // todo context menu
    }
  },
  created() {

  },
  mounted() {
    this.$refs.layer.insertBefore(this.layer_obj.dom,this.$refs.layer.firstChild)
    // let ctx = this.$refs.layerCanvas.getContext('2d')
    // ctx.drawImage(this.layer_obj.dom, 0, 0)
  }
}
</script>

<style scoped>
div.currentLayer {
  border: solid 1px;
  background: lightgray;
}
.layer {
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
}
</style>