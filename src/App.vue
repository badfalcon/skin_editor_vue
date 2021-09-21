<template>
  <div id="app">
    {{name}}
    <SkinEditor></SkinEditor>
  </div>
</template>

<script>
import SkinEditor from "@/components/SkinEditor";
export default {
  name: "App",
  components: {SkinEditor},
  data(){
    return {
      name: 'App'
    }
  }
}
</script>

<style>
@import "main.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
