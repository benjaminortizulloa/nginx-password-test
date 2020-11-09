<template>
  <div class="home">
    <h1>This is the home page</h1>
    <ApiTest/>
  </div>
</template>

<script>
import ApiTest from "@/components/ApiTest";
export default {
  name: "Home",
  components: { ApiTest }
};
</script>
