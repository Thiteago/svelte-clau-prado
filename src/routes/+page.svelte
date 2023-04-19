<script>
import { PUBLIC_BACKEND_URL } from '$env/static/public'
import Carousel from 'svelte-carousel'
import Header from '$lib/components/header/Header.svelte'
import SubHeader from '$lib/components/subHeader/SubHeader.svelte'
import Slide from '../lib/components/slide/Slide.svelte'
import BuyInfo from '../lib/components/buyinfo/Buyinfo.svelte'
import {loadStorageData} from '$lib/js/stores/login.js'
import { registerVisit,fetchProducts } from '$lib/js/helpers.js'
import './style.scss'
import { onMount } from 'svelte';

let hasSpecialSale = false
let products = []

async function checkIfHasSpecialSale(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/promocoesativas`)
		let data = response.json()
    if(data.length > 0){
			hasSpecialSale = true
		}
}

async function orderProducts(){
  products = await fetchProducts()
  //sort products by date most recent and return 8 products
  console.log(products)
  products.sort((a,b) => {
    return new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
  })
  products = products.slice(0,8)

  return products
}

onMount(async () => {
    loadStorageData()
    registerVisit()
    checkIfHasSpecialSale()
    orderProducts()
})

</script>
<div class="container-home">
	<SubHeader/>
  <Header tamanho="grande"/>
	<Slide/>
 
  <div class="container-Content">
		<BuyInfo />
    <section class="flex flex-col w-9/12 m-auto mt-6 gap-4 ">
      <div>
        <h1 class="font-italic text-3xl">Novos Produtos</h1>
        <p>Os mais recentes trabalhos da Clau 😍</p>
      </div>

      <div class="mt-4 flex gap-3 flex-wrap">
        {#if products.length > 0}
          {#each products as prod }
            <div>
              <div class="flex justify-center bg-[#F0F0F0] hover:bg-[#c6c6c6] cursor-pointer py-12">
                <img width="250" src="http://localhost:3333/static/{prod.imagens[0]}" alt="">
              </div>
              <div class="flex flex-col mt-2 items-center">
                <div class="font-bold">{prod.nome}</div>
                <div class="font-bold">R$ {prod.valor}</div>
              </div>
            </div>
          {/each}
        {:else}
          <div class="flex justify-center items-center bg-[#F0F0F0]cursor-pointer py-12">
            <div class="font-bold">Nenhum produto encontrado</div>
          </div>
        {/if}
      </div>
      <div>
        <a href="/produtos" class="flex rounded-lg justify-center items-center bg-[#F0F0F0] hover:bg-[#c6c6c6] cursor-pointer mt-3 py-3">
          <div class="font-bold">Ver todos os produtos</div>
        </a>
      </div>
    </section>

    <section>
      
    </section>
  </div>
</div>