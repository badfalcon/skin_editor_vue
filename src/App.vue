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

<style scoped>

</style>
