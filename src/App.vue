<template>
  <div id="app">
    {{ name }}
        <SkinEditor></SkinEditor>
<!--    <test-component></test-component>-->
  </div>
</template>

<script>
import SkinEditor from "@/components/SkinEditor";
// import TestComponent from "@/components/TestComponent";

export default {
  name: "App",
  components: {
    // TestComponent,
    SkinEditor
  },
  data() {
    return {
      name: 'App'
    }
  }
}
</script>

<style scoped>

</style>
