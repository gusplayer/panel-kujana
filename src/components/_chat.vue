<template>
  <section id="chat">
    <router-view></router-view>
    <chat-intranet></chat-intranet>
  </section>
</template>

<script>
import axios from 'axios';
import chatIntranet from './chat';
export default {
  components: { chatIntranet },
  created(){

  },
  data(){
    return{
    }
  },
  computed: {
    currentUser(){
      return this.$store.state.currentUser;
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  
</style>
