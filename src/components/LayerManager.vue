<template>
  <div id="layerManager">
<!--    <div class="debug">{{ name }},{{ current }},{{ nextIndex }},{{ layers }}</div>-->
    <button @click="addLayer">add layer</button>
<!--    <button @click="repaint">親のイベントを呼び出す</button>-->
    <Layer v-for="layer in reversedLayers" v-bind:key="layer.id" :layer_obj="layer"
           @layer-toggle="toggle(layer)" @layer-select="select(layer)" @layer-remove="remove(layer)"
           :class="{currentLayer: layer.id===current}"></Layer>
  </div>
</template>

<script>
import Layer from "@/components/Layer";
import layerObject from "@/components/LayerObject";

export default {
  name: "LayerManager",
  components: {Layer},
  data() {
    return {
      name: 'LayerManager',
      layers: [],
      current: 0,
      nextIndex: 0
    }
  },
  computed: {
    reversedLayers:function(){
      return this.layers.slice().reverse();
    }
  },
  methods: {
    repaint() {
      this.$emit('repaint')
    },
    select(layer) {
      console.log("select " + layer.id)
      this.current = layer.id
      this.$emit('updateLayer')
    },
    toggle(layer) {
      console.log("toggle " + layer.id)
      layer.toggleVisible()
      this.repaint()
    },
    remove(layer) {
      console.log("remove " + layer.id)
      // todo disable buttons when only 1 layer
      let layerId = layer.id;
      let targetIndex = this.layers.findIndex(value => value.id === layerId)
      this.layers.splice(targetIndex,1)
      if(targetIndex === this.layers.length){
        // last index
        this.select(this.layers[targetIndex-1])
      }else{
        if(this.current === layerId){
          this.select(this.layers[targetIndex])
        }
      }
      this.repaint()
    },
    addLayer() {
      console.log("addLayer")
      let newLayer = new layerObject(this.nextIndex)
      let currentIndex = this.layers.findIndex(value => value.id === this.current)
      console.log("currentIndex = " + currentIndex)
      this.layers.splice(currentIndex + 1, 0, newLayer)
      this.nextIndex += 1
      this.select(newLayer)
      this.repaint()
    },
    getLayer(n = this.current) {
      return this.layers.find(value => value.id === n)
    }
  },
  mounted() {
    console.log("LayerManager mounted")
    this.addLayer()
  }
}
</script>

<style scoped>

</style>