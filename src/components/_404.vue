<template>
  <section class="PageNotFound">
    <div class="PageNotFound_content">
      <h1>404</h1>
      <p>Esta pagina no existe</p>
      <router-link to="/inicio" class="actionReturnInicio">Ir a inicio</router-link>
    </div>
    <img src="../assets/404.png" alt="">
  </section>
</template>

<script>
export default {
}
</script>

<style scoped>
  .PageNotFound{
    height: calc(100vh - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFF;
  }
  .PageNotFound_content{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .PageNotFound_content h1{
    font-size: 120px;
    color: #289bf0;
  }
  .PageNotFound img{
    max-width: 426px;
    width: 100%;
    margin-left: 50px;
  }
  .actionReturnInicio{
    margin-top: 10px;
    padding: 12px 40px;
    border-style: none;
    border-radius: 18px;
    border: solid 2px #289bf0;
    background-color: transparent;
    color: #289bf0;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: .3s;
  }
  .actionReturnInicio:hover{
    transform: scale(0.95);
  }
  @media(max-width: 900px){
    .PageNotFound{
      flex-direction: column-reverse;
      justify-content: flex-end;
    }
    .PageNotFound_content{
      height: initial;
    }
    .PageNotFound img{
      margin-left: 0px;
    }
  }
</style>
