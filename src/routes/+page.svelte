<script>
import { PUBLIC_BACKEND_URL } from '$env/static/public'
import quotes from '$lib/assets/icons/quotes.svg'
import leftquote from '$lib/assets/icons/left-quote.svg'
import Header from '$lib/components/header/Header.svelte'
import SubHeader from '$lib/components/subHeader/SubHeader.svelte'
import Slide from '$lib/components/slide/Slide.svelte'
import BuyInfo from '$lib/components/buyinfo/Buyinfo.svelte'
import {loadStorageData, user} from '$lib/js/stores/login.js'
import { registerVisit,fetchProducts } from '$lib/js/helpers.js'
import './style.scss'
import Carousel from 'svelte-carousel'
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import produto1 from '$lib/assets/img/produto-3.jpeg'
import produto2 from '$lib/assets/img/produto-5.jpg'
import Footer from '$lib/components/footer/Footer.svelte';

let hasSpecialSale = false
let products = []
let promotionalProduts = []

async function checkIfHasSpecialSale(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/promocoesativas`)
		let data = await response.json()
    if(data.length > 0){
			hasSpecialSale = true
      data.forEach(promo => {
        promo.produtos.forEach(prod => {
          promotionalProduts.push(prod)
        })
      })
      promotionalProduts = promotionalProduts.slice(0,4)
		}
}

async function orderProducts(){
  products = await fetchProducts()
  //sort products by date most recent and return 8 products
  products.sort((a,b) => {
    return new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
  })
  products = products.slice(0,8)

  return products
}

onMount(async () => {
    await loadStorageData()
    await registerVisit($user ? true : false)
    await checkIfHasSpecialSale()
    await orderProducts()
})

</script>
<div class="container-home">
	<SubHeader/>
  <Header tamanho="grande"/>
  <div>
    <div class="slide-desk">
      <Slide/>
    </div>
    <div class="slide-mob">
      {#if browser}
        <Carousel
          autoplay
          autoplayDuration={5000}
          autoplayProgressVisible
          arrows={false}
          >
          <img src={produto1} alt="">
          <img src={produto2} alt="">
        </Carousel>
      {/if}
    </div>
  </div>
 
  <div class="container-Content">
		<BuyInfo />

    {#if hasSpecialSale}
      <section class="flex flex-col w-9/12 m-auto bg-[#faedf8] rounded-lg py-6 px-2">
        <div class="pl-2">
          <h1 class="font-medium  text-3xl">Produtos com precinho especial</h1>
          <p>Os itens abaixo estão todos em promoção, confira! 🥳🎉</p>
        </div>

        <div class="mt-4 flex gap-3 flex-wrap pl-2">
          {#if products.length > 0}
            {#each promotionalProduts as prod }
              <div>
                <div class="flex justify-center bg-[#f5d9f1] hover:bg-[#e092cf] cursor-pointer py-12 rounded-md">
                  <a href="/venda?produto_id={prod.id}">
                    <img width="250" src="{PUBLIC_BACKEND_URL}/static/{prod.imagens[0]}" alt="">
                  </a>
                </div>
                <div class="flex flex-col mt-2 items-center">
                  <div class="font-bold"><a href="/venda?produto_id={prod.id} ">{prod.nome}</a></div>
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
        <div class="flex justify-center">
          <a href="/produtos" class="flex rounded-lg justify-center  w-full sm:w-2/12 items-center bg-[#b14897] hover:bg-[#92397a] cursor-pointer mt-3 py-3">
            <div class="font-bold text-white">Ver todos os produtos</div>
          </a>
        </div>
      </section>
    {/if}
    <section class="flex flex-col w-9/12 m-auto my-6 gap-4 ">
      <div>
        <h1 class="font-italic text-3xl">Novos Produtos</h1>
        <p>Os mais recentes trabalhos da Clau 😍</p>
      </div>

      <div class="mt-4 flex gap-3 flex-wrap">
        {#if products.length > 0}
          {#each products as prod }
            <div>
              <div class="flex justify-center bg-[#F0F0F0] hover:bg-[#c6c6c6] cursor-pointer py-12">
                <a href="/venda?produto_id={prod.id}">
                  <img width="250" src="{PUBLIC_BACKEND_URL}/static/{prod.imagens[0]}" alt="">
                </a>
              </div>
              <div class="flex flex-col mt-2 items-center">
                <div class="font-bold">
                  <a href="/venda?produto_id={prod.id}">{prod.nome}</a>
                </div>
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
      <div class="flex justify-center">
        <a href="/produtos" class="flex rounded-lg justify-center w-full sm:w-2/12 px-2 text-center items-center bg-[#F0F0F0] hover:bg-[#c6c6c6] cursor-pointer mt-3 py-3">
          <div class="font-bold">Ver todos os produtos</div>
        </a>
      </div>
    </section>

    <section class="w-9/12 m-auto mt-6">
      <div>
        <h1 class="font-italic text-3xl">Depoimentos</h1>
        <p>Leia depoimentos de outros clientes que tiveram a experiência completa com nossos produtos! 🥹</p>
      </div>

      <div style="min-height: 12rem" class="flex items-center">
        {#if browser}
          <div class="carousel-desktop">
            <Carousel
            particlesToShow={3}
            particlesToScroll={2}
            autoplayDuration={5000}
            duration={5000}
            autoplay
            pauseOnFocus={true}
            dots={false}
            arrows={false}

            >
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
            </Carousel>
          </div>
          <div class="carousel-mobile">
            <Carousel
            particlesToShow={1}
            particlesToScroll={1}
            autoplayDuration={5000}
            duration={5000}
            autoplay
            pauseOnFocus={true}
            dots={false}
            arrows={false}

            >
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
              <div class="flex flex-col items-center">
                <h1 class="font-bold text-2xl flex">
                  <i class="w-3">
                    <img class="w-6" src={leftquote} alt=""/>
                  </i>
                    Sensacional 
                    <i class="w-3"><img class="w-6" src={quotes} alt=""/>
                  </i>
                </h1>
                <p>aidqkadiqeiwqeiqweiqwieqwi</p>
              </div>
            </Carousel>
          </div>
         
        {/if}
      </div>
    </section>
  </div>
</div>
<Footer/>