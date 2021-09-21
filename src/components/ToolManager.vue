<template>
  <div id="toolManager">
    <button v-for="(value,index) in tools" :key="'tool'+index" @click="selectTool(index)">{{value.name}}</button>
    {{name}},{{current}},{{tools}}
  </div>
</template>

<script>
import Pen from "@/components/Pen";
import Eraser from "@/components/Eraser";

export default {
  name: "ToolManager",
  data(){
    return {
      tools: [new Pen,new Eraser],
      name: 'ToolManager',
      ctx: null,
      current:-1
    }
  },
  methods:{
    selectTool(index,layer){
      this.current = index
      this.ctx = layer.dom.getContext('2d')
      if(typeof this.tools[this.current].onSelect == "function"){
        this.tools[this.current].onSelect(this.ctx)
      }
    },

    onPointerEnter(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerEnter == "function"){
        let pt = this.getPoint(e)
        let repaintFlg = this.tools[this.current].onPointerEnter(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerOver(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerOver == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerOver(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerDown(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerDown == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerDown(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerMove(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerMove == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerMove(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerUp(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerUp == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerUp(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerOut(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerOut == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerOut(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    onPointerLeave(e) {
      console.log(e)
      if(typeof this.tools[this.current].onPointerLeave == "function"){
        let pt = this.getPoint(e)
        let repaintFlg =this.tools[this.current].onPointerLeave(this.ctx,pt)
        if(repaintFlg) this.$emit('repaint')
      }
    },
    getPoint(e) {
      let clientRect = e.target.getBoundingClientRect();
      return {x: e.clientX - clientRect.left, y: e.clientY - clientRect.top};
    }
  },
  mounted() {
    // this.selectTool(0)
  }
}
</script>

<style scoped>

</style>