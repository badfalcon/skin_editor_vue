<template>
  <div id="skinEditor">
<!--    <div class="debug">-->
<!--      {{ name }},{{ currentLayer }}-->
<!--    </div>-->
    <div id="appHead">
      <div id="toolManager">
        <button v-for="(value,index) in tools" :key="'tool'+index" @click="selectTool(index)">{{value.name}}</button>
        <input type="color" @change="selectColor" value="#ff0000">
        {{currentTool}},{{tools}}
      </div>
    </div>
    <div id="appBody">
      <!--    <PixelCanvas ref="mainCanvas" :width=400 :height=400 :pixel-width=64 :pixel-height=64></PixelCanvas>-->
      <div id="canvasArea">
        <canvas id="mainCanvas" ref="mainCanvas" width="400" height="400"
                v-on="{pointerover:onPointerOver,pointerenter:onPointerEnter,pointerdown:onPointerDown,pointermove:onPointerMove,pointerup:onPointerUp,pointerout:onPointerOut,pointerleave:onPointerLeave}"></canvas>
      </div>
      <div id="layerManager">
        <!--    <div class="debug">{{ name }},{{ current }},{{ nextIndex }},{{ layers }}</div>-->
        <button @click="addLayer">add layer</button>
        <!--    <button @click="repaint">親のイベントを呼び出す</button>-->
        <Layer v-for="layer in reversedLayers" v-bind:key="layer.id" :layer_obj="layer" :sole_layer="isSoleLayer"
               @layer-up="up(layer)" @layer-down="down(layer)"
               @layer-toggle="toggle(layer)" @layer-select="select(layer)" @layer-remove="remove(layer)"
               :class="{currentLayer: layer.id===current}"></Layer>
      </div>
    </div>
  </div>
</template>

<script>
import Pen from "@/components/Pen";
import Eraser from "@/components/Eraser";
import PixelCanvas from "@/components/PixelCanvas";
import layerObject from "@/components/LayerObject";
import Layer from "@/components/Layer";

export default {
  name: "SkinEditor",
  components: {Layer},
  data() {
    return {
      name: 'SkinEditor',
      currentLayer: null,

      tools: [new Pen,new Eraser],
      pixelCanvas: new PixelCanvas(),
      ctx: null,
      currentTool:-1,

      layers: [],
      current: 0,
      nextIndex: 0
    }
  },
  computed: {
    reversedLayers:function(){
      return this.layers.slice().reverse();
    },
    isSoleLayer:function(){
      console.log("sole layer is "+(this.layers.length === 1)?"true":"false")
      return this.layers.length === 1;
    }
  },
  methods: {
    repaint() {
      let ctx = this.$refs.mainCanvas.getContext('2d')
      ctx.clearRect(0, 0, 400, 400)
      this.layers.forEach((layer) => {
        if (layer.visible) {
          ctx.drawImage(layer.dom, 0, 0,400,400)
        }
      })
    },

    selectTool(index){
      this.currentTool = index
      this.pixelCanvas.setTool(index)
    },

    selectColor(e) {
      console.log(e.target.value)
      let hex = e.target.value
      let r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
      this.pixelCanvas.setColor(r, g, b, 255);
    },

    onPointerEnter(e) {
      let repaintFlg = this.pixelCanvas.onPointerEnter(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerEnter == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg = this.tools[this.currentTool].onPointerEnter(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerOver(e) {
      let repaintFlg =this.pixelCanvas.onPointerOver(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerOver == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerOver(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerDown(e) {
      let repaintFlg = this.pixelCanvas.onPointerDown(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerDown == "function"){
      //   let pt = this.getPoint(e)
      //   console.log(pt)
      //   let repaintFlg =this.tools[this.currentTool].onPointerDown(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerMove(e) {
      let repaintFlg = this.pixelCanvas.onPointerMove(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerMove == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerMove(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerUp(e) {
      let repaintFlg = this.pixelCanvas.onPointerUp(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerUp == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerUp(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerOut(e) {
      let repaintFlg = this.pixelCanvas.onPointerOut(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerOut == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerOut(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerLeave(e) {
      let repaintFlg = this.pixelCanvas.onPointerLeave(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerLeave == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerLeave(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    getPoint(e) {
      let clientRect = e.target.getBoundingClientRect();
      return {x: (e.clientX - clientRect.left)/400*64, y: (e.clientY - clientRect.top)/400*64};
    },

    updateLayer(){
      this.currentLayer = this.getLayer()
      this.ctx = this.currentLayer.dom.getContext('2d')
      this.pixelCanvas.setContext(this.ctx)
    },

    select(layer) {
      console.log("select " + layer.id)
      this.current = layer.id
      this.updateLayer()
    },
    toggle(layer) {
      console.log("toggle " + layer.id)
      layer.toggleVisible()
      this.repaint()
    },
    up(layer) {
      console.log("up " + layer.id)
      let sourceIndex = this.layers.findIndex(value => value.id === layer.id)
      if(sourceIndex === this.layers.length - 1) return;
      let targetIndex  = sourceIndex + 1
      this.layers.splice(sourceIndex, 2, this.layers[targetIndex], this.layers[sourceIndex])
      this.repaint()
    },
    down(layer) {
      console.log("down " + layer.id)
      let sourceIndex = this.layers.findIndex(value => value.id === layer.id)
      if(sourceIndex === 0) return;
      let targetIndex  = sourceIndex - 1
      this.layers.splice(targetIndex, 2, this.layers[sourceIndex], this.layers[targetIndex])
      this.repaint()
    },
    remove(layer) {
      console.log("remove " + layer.id)
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
  created() {
    console.log("[Skin Editor] created")
  },
  mounted() {
    console.log("[Skin Editor] mounted")
    this.addLayer()
    this.currentLayer = this.getLayer()
    this.ctx = this.currentLayer.dom.getContext('2d')
    let ctx = this.$refs.mainCanvas.getContext('2d')
    ctx.imageSmoothingEnabled = false;
    this.selectTool(0)
  }
}
</script>

<style scoped>
#skinEditor{
  background: aqua;
}

#appHead{

}

#appBody{
  display:flex;
}

#toolManager{
  background: lightgreen;
}

#canvasArea{
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#mainCanvas{
  background: white;
}

#layerManager{
  -webkit-flex-basis: 50px;
  flex-basis: 200px;
}
</style>