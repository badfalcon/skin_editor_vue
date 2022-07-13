<template>
  <div id="skinEditor">
<!--    <div class="debug">-->
<!--      {{ name }},{{ currentLayer }}-->
<!--    </div>-->
    <div id="appHead">
      <div id="toolManager">
        <button v-for="(value,index) in tools" :key="'tool'+index" @click="selectTool(index)">{{value.name}}</button>
        <input type="color" @change="selectColor" value="#ff0000">
        <button @click="undo" :disabled="!actionManager.canUndo()">undo</button>
        <button @click="redo" :disabled="!actionManager.canRedo()">redo</button>
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
import layerObject from "@/components/LayerObject";
import Layer from "@/components/Layer";
import ActionManager from "@/components/ActionManager";

export default {
  name: "SkinEditor",
  components: {Layer},
  data() {
    return {
      name: 'SkinEditor',
      currentLayer: null,

      tools: [new Pen,new Eraser],

      layers: [],
      current: 0,
      nextIndex: 0,

      currentTool:-1,
      color: [255,0,0,255],

      ctx: null,
      bufferCanvas: null,
      pixelHeight:64,
      pixelWidth:64,
      canvasWidth:400,
      canvasHeight:400,

      pt_old: null,
      imageData: null,

      actionManager: null
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


    onPointerEnter(e) {
      console.log(e.type)
      let repaintFlg = false
      // let repaintFlg = this.pixelCanvas.onPointerEnter(e)
      let pt = this.getPoint(e)
      console.log(pt)
      switch (this.currentTool) {
        case 0:
          if (e.pressure && pt) {
            this.setDot(pt.x, pt.y, this.color)
            this.prev_pt = pt
            this.backRepaint()
            repaintFlg = true;
          }
          break;
      }
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerEnter == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg = this.tools[this.currentTool].onPointerEnter(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerOver(e) {
      console.log(e.type)
      let repaintFlg = false
      let pt = this.getPoint(e)
      console.log(pt)
      // let repaintFlg =this.pixelCanvas.onPointerOver(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerOver == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerOver(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerDown(e) {
      console.log(e.type)
      let repaintFlg = false
      let pt = this.getPoint(e)
      console.log(pt)
      switch (this.currentTool) {
        case 0:
          if (pt) {
            // todo store changed cells and color
            this.setDot(pt.x, pt.y, this.color)
            this.prev_pt = pt
            this.backRepaint()
            repaintFlg = true;
          }
          break;
      }
      // let repaintFlg = this.pixelCanvas.onPointerDown(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerDown == "function"){
      //   let pt = this.getPoint(e)
      //   console.log(pt)
      //   let repaintFlg =this.tools[this.currentTool].onPointerDown(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerMove(e) {
      // console.log(e.type)
      let repaintFlg = false
      //todo pressure使うと出て戻ってきたときとかにややこしくなるからフラグで管理でも
      let pt = this.getPoint(e)
      switch (this.currentTool) {
        case 0:
          if (e.pressure && pt) {
            this.setLine(this.prev_pt.x, this.prev_pt.y, pt.x, pt.y, this.color)
            this.prev_pt = pt
            this.backRepaint()
            repaintFlg = true;
          }
          break;
      }
      // let repaintFlg = this.pixelCanvas.onPointerMove(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerMove == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerMove(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerUp(e) {
      console.log(e.type)
      let repaintFlg = false
      // let repaintFlg = this.pixelCanvas.onPointerUp(e)
      if(repaintFlg) this.repaint()
      switch (this.currentTool) {
        case 0:{
          // todo 保存するための変更点の取得
          const event = new CustomEvent('editorAction',{'detail':{

            }});
          document.dispatchEvent(event);
          break;
        }
      }
      // if(typeof this.tools[this.currentTool].onPointerUp == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerUp(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerOut(e) {
      console.log(e.type)
      let repaintFlg = false
      // let repaintFlg = this.pixelCanvas.onPointerOut(e)
      let pt = this.getPoint(e)
      console.log(pt)
      if(!pt) return
      else console.log("aaaaa")
      switch (this.currentTool) {
        case 0:
          if (e.pressure && pt) {
            this.setLine(this.prev_pt.x, this.prev_pt.y, pt.x, pt.y, this.color)
            this.prev_pt = pt
            this.backRepaint()
            repaintFlg = true;
          }
          break;
      }
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerOut == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerOut(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    onPointerLeave(e) {
      console.log(e.type)
      let repaintFlg = false
      let pt = this.getPoint(e)
      console.log(pt)
      // let repaintFlg = this.pixelCanvas.onPointerLeave(e)
      if(repaintFlg) this.repaint()
      // if(typeof this.tools[this.currentTool].onPointerLeave == "function"){
      //   let pt = this.getPoint(e)
      //   let repaintFlg =this.tools[this.currentTool].onPointerLeave(this.ctx,pt)
      //   if(repaintFlg) this.repaint()
      // }
    },
    // getPoint(e) {
    //   let clientRect = e.target.getBoundingClientRect();
    //   return {x: (e.clientX - clientRect.left)/400*64, y: (e.clientY - clientRect.top)/400*64};
    // },

    updateLayer(){
      this.currentLayer = this.getLayer()
      this.setContext(this.currentLayer.dom.getContext('2d'))
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
      const event = new CustomEvent('editorAction');
      document.dispatchEvent(event);
    },
    getLayer(n = this.current) {
      return this.layers.find(value => value.id === n)
    },


    setTool(index) {
      this.toolIndex = index;
    },
    setColor(r, g, b, a) {
      this.color = [r, g, b, a];
    },
    setContext(ctx) {
      this.ctx = ctx;
      this.imageData = this.ctx.getImageData(0, 0, this.pixelWidth, this.pixelHeight)
      this.backRepaint()
    },
    selectTool(index){
      this.currentTool = index;
      const event = new CustomEvent('editorAction');
      document.dispatchEvent(event);
    },

    selectColor(e) {
      console.log(e.target.value)
      let hex = e.target.value
      let r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
      this.setColor(r, g, b, 255);
    },

    backRepaint() {
      this.ctx.putImageData(this.imageData, 0, 0)
      // let ctx = this.currentLayer.dom.getContext('2d')
      // ctx.d
      // ctx.drawImage(this.rawCanvas, 0, 0, this.width, this.height)
    },



    getPoint(e) {
      let clientRect = e.target.getBoundingClientRect();
      let rawPt = {
        x: (e.clientX - clientRect.left) / this.canvasWidth * this.pixelWidth,
        y: (e.clientY - clientRect.top) / this.canvasHeight * this.pixelHeight
      };
      return (0 <= rawPt.x && rawPt.x <= this.pixelWidth && 0 <= rawPt.y && rawPt.y
          <= this.pixelHeight) ? {
        x: Math.floor(rawPt.x),
        y: Math.floor(rawPt.y)
      } : false;
    },

    setDot(x, y, color) {
      let data = this.imageData.data
      let index = (this.imageData.width * y + x) * 4
      data[index] = color[0]
      data[index + 1] = color[1]
      data[index + 2] = color[2]
      data[index + 3] = color[3]
      // todo add changes to list
    },

    getDot(x, y) {
      let data = this.imageData.data
      let index = (this.imageData.width * y + x) * 4
      return data.slice(index, index + 3);
    },

    setLine(x1, y1, x2, y2, color) {
      let steep = Math.abs(y2 - y1) > Math.abs(x2 - x1)
      if (steep) {
        let tmp = x1;
        x1 = y1;
        y1 = tmp;

        tmp = x2;
        x2 = y2;
        y2 = tmp;
      }
      if (x1 > x2) {
        let tmp = x1;
        x1 = x2;
        x2 = tmp;

        tmp = y1;
        y1 = y2;
        y2 = tmp;
      }
      let dx = x2 - x1
      let dy = Math.abs(y2 - y1)
      let error = dx / 2
      let y = y1
      let y_step = y1 < y2 ? 1 : -1
      for (let x = x1; x <= x2; x++) {
        steep ? this.setDot(y, x, color) : this.setDot(x, y, color)
        error -= dy
        if (error < 0) {
          y += y_step
          error += dx
        }
      }
    },

    undo(){
      this.actionManager.undo();
    },

    redo(){
      this.actionManager.redo();
    }
  },
  created() {
    console.log("[Skin Editor] created")
    this.actionManager = new ActionManager();
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