<template>
  <div class="api-test">
    <h2>This component shows that an API can be called from an NGINX Proxy</h2>
    <p>The url this front end calls is: {{apiCall}}</p>
    <button @click="prove_api">Click here to see proof.</button>
    <p>{{proof}}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "API-Test",
  data() {
    return {
      apiUrl: process.env.VUE_APP_API,
      proof: []
    };
  },
  computed: {
    apiCall() {
      return this.apiUrl + "users";
    }
  },
  methods: {
    prove_api() {
      axios
        .get(this.apiUrl + "users")
        .then(response => (this.proof = response.data))
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.api-test {
  background-color: bisque;
}
</style>
