<template>
  <div :draggable="!isChangingName" :id="'layer_' + layer_obj.id" ref="layer" @click="select"
       :class="[{hidden: !layer_obj.visible},'layer']"
       @click.right.prevent="openLayerMenu">
    <!--    <canvas class="layer-thumbnail" ref="layerCanvas" width="50px" height="50px"></canvas>-->
    <span class="layer_name" @click.stop @dblclick="renameStart"
          v-show="!isChangingName">{{ layer_obj.nickname }}</span> <!--todo check-->
    <input class="layer_rename" ref="renameInput" @click.stop @dblclick.stop type="text"
           :value="layer_obj.nickname" @blur="renameEnd" @keydown.enter="renameEnd" maxlength="20"
           v-show="isChangingName">
    <button class="layer_visible" @click="toggle">sh/hi</button>
    <button class="layer_delete" @click="remove" :disabled="sole_layer">rem</button>
    <button class="layer_up" @click="up" :disabled="sole_layer">↑</button>
    <button class="layer_down" @click="down" :disabled="sole_layer">↓</button>
  </div>
</template>

<script>
export default {
  props: ['layer_obj', 'sole_layer'],
  name: "Layer",
  data() {
    return {
      isChangingName: false
    }
  },
  methods: {
    renameStart(e) {
      console.log("rename start");
      this.isChangingName = true
      this.$nextTick(() => this.$refs.renameInput.focus())
      // this.$emit("layer-rename")
      e.stopPropagation();
    },
    renameEnd(e) {
      console.log("rename end");
      console.log(e);
      this.isChangingName = false
      this.layer_obj.nickname = e.target.value
      e.stopPropagation();
    },
    select() {
      console.log("select");
      this.$emit("layer-select")
    },
    toggle(e) {
      this.$emit("layer-toggle")
      e.stopPropagation();
    },
    remove(e) {
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
    },
    openModal() {
      this.showContent = true
    },
    closeModal() {
      this.showContent = false
    }
  },
  created() {

  },
  mounted() {
    this.$refs.layer.insertBefore(this.layer_obj.dom, this.$refs.layer.firstChild)
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