<script>
import Header from '../lib/components/header/Header.svelte'
import Slide from '../lib/components/slide/Slide.svelte'
import Divider from '../lib/components/divider/Divider.svelte'
import BuyInfo from '../lib/components/buyinfo/Buyinfo.svelte'
import Promocoes from '../lib/components/promocoes/Promocoes.svelte'
import Category from '../lib/components/category/Category.svelte'
import Testemunhos from '../lib/components/testemunhos/Testemunhos.svelte'
import Footer from '../lib/components/footer/Footer.svelte'
import {loadStorageData} from '$lib/js/stores/login.js'
import './style.scss'
import { onMount } from 'svelte';

onMount(() => {
    loadStorageData()
})

</script>
<div class="container-home">
  <Header tamanho="grande"></Header>
  <Slide></Slide>
 
  <div class="container-Content">
      
      <div class="main-topseller">
          <Divider titulo="Clau Prado"></Divider>
          <BuyInfo></BuyInfo>
      </div>

      <div class="main-recentworks">
          <Divider titulo="Promocoes"></Divider>
          <Promocoes></Promocoes>
      </div>

      <div class="category-container">
          <Divider titulo="Para sua Festa"></Divider>
          <Category></Category>
      </div>


      <Testemunhos></Testemunhos>
      <section class="main-request">
          <h1>Faça seu pedido já!</h1>
          <button>Encomendar</button>
      </section>
  </div>
  <Footer></Footer>
</div>