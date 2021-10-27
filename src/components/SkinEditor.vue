<template>
  <div id="skinEditor">
    <div class="debug">
      {{ name }},{{ currentLayer }}
    </div>
    <div id="toolManager">
      <button v-for="(value,index) in tools" :key="'tool'+index" @click="selectTool(index)">{{value.name}}</button>
      {{currentTool}},{{tools}}
    </div>
<!--    <PixelCanvas ref="mainCanvas" :width=400 :height=400 :pixel-width=64 :pixel-height=64></PixelCanvas>-->
    <canvas id="mainCanvas" ref="mainCanvas" width="400" height="400"
            v-on="{pointerover:onPointerOver,pointerenter:onPointerEnter,pointerdown:onPointerDown,pointermove:onPointerMove,pointerup:onPointerUp,pointerout:onPointerOut,pointerleave:onPointerLeave}"></canvas>
    <LayerManager ref="layerManager" @repaint="repaint" @updateLayer="updateLayer"></LayerManager>
  </div>
</template>

<script>
import LayerManager from "@/components/LayerManager";
import Pen from "@/components/Pen";
import Eraser from "@/components/Eraser";
import PixelCanvas from "@/components/PixelCanvas";

export default {
  name: "SkinEditor",
  components: {LayerManager},
  data() {
    return {
      name: 'SkinEditor',
      currentLayer: null,

      tools: [new Pen,new Eraser],
      pixelCanvas: new PixelCanvas(),
      ctx: null,
      currentTool:-1
    }
  },
  methods: {
    repaint() {
      let ctx = this.$refs.mainCanvas.getContext('2d')
      ctx.clearRect(0, 0, 400, 400)
      this.$refs.layerManager.layers.forEach((layer) => {
        if (layer.visible) {
          ctx.drawImage(layer.dom, 0, 0,400,400)
        }
      })
    },

    selectTool(index){
      this.currentTool = index
      this.pixelCanvas.setTool(index)
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
      this.currentLayer = this.$refs.layerManager.getLayer()
      this.ctx = this.currentLayer.dom.getContext('2d')
      this.pixelCanvas.setContext(this.ctx)
    }

  },
  created() {
    console.log("[Skin Editor] created")
  },
  mounted() {
    console.log("[Skin Editor] mounted")
    this.currentLayer = this.$refs.layerManager.getLayer()
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

#mainCanvas{
  background: white;
}
</style>