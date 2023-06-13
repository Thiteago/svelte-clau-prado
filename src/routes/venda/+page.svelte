<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { cart, idCart } from '$lib/js/stores/cart.js'
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/header/Header.svelte'
  import PreviousButton from '$lib/components/previousbutton/Previousbutton.svelte'
  import Avaliacoes from '$lib/components/avaliacoes/Avaliacoes.svelte';
	import { fetchProductsById, calculateDiscount, formatDate, formatToCurrency, createdCart } from '$lib/js/helpers';
	import Footer from '$lib/components/footer/Footer.svelte';

  const produtoId = $page.url.searchParams.get('produto_id');

  let produto = {}
  let promotionalValue
  let formatedValue
  $: ativo = 'descricao'
  $: mainimage = ''

  function createCart(){
    const now = new Date();
    let storedData = localStorage.getItem('idCart')

    if (storedData != null && now.getTime() > new Date(storedData.expiration).getTime()) {
      $idCart = 0
      localStorage.removeItem(key);
    }

    if($idCart == 0 || localStorage.getItem('idCart') == null){
      $idCart = Math.floor((Math.random() * 100) + 1)
      
      let expirationMs = 180 * 60 * 1000;
      let expiration = new Date(now.getTime() + expirationMs);
      let data = { idCart: $idCart, expiration: expiration };
      localStorage.setItem('idCart', JSON.stringify(data))
      createdCart($idCart)
    }else{
      $idCart = localStorage.getItem('idCart').idCart
    }
  }

  function addToCart(){
    createCart()
    if(produto.promocao != null && produto.promocao.status == 'Ativo'){
      if(produto.promocao.tipo == 'valor_fixo'){
        promotionalValue = produto.valor - produto.promocao.valor_desconto
      } else {
        promotionalValue = produto.valor - (produto.valor * (produto.promocao.valor_desconto / 100))
      }
    }
    if(!$cart.find(produtos => produtos.id == produto.id)){
      if(produto.promocao != null && produto.promocao.status != 'Inativo'){
        produto.valor = promotionalValue
      }
      let product = {...produto, imagens: produto.imagens[0], quantidade: 1}
      localStorage.setItem('cart', JSON.stringify([...$cart, product]))
      $cart = [...$cart, product]
    }
  }

  function toggleActive(e){
    let liList = document.getElementsByTagName("li")
    if(!(e.target.className  == "ativo-tab")){
      for(let i = 0; i < liList.length; i++){
        if(liList[i] != e.target){
          liList[i].classList.remove("ativo-tab")
        }
      }
      e.target.classList.add("ativo-tab")
      if(e.target.innerHTML == "Descrição"){
        ativo = "descricao"
      }else if(e.target.innerHTML == "Especificações Técnicas"){
        ativo = "especificacoes"
      }else{
        ativo = "avaliacoes"
      }
    }
  }

  onMount(async () => {
    produto = await fetchProductsById(produtoId)
    mainimage = produto.imagens[0]
    promotionalValue = await calculateDiscount(produto)
    formatedValue = formatToCurrency(produto.valor)
    produto.dataFabricacao = formatDate(produto.dataFabricacao)

    await fetch(`${PUBLIC_BACKEND_URL}/Produto/Visualizou/${produtoId}`, {
      method: 'POST',
    })
  })


</script>

<div>
  <Header />
  {#if Object.keys(produto).length > 0}
  <section class="w-full bg-[#F5F5F5] flex justify-center px-6 items-center flex-col">
    <div class="w-full xl:w-3/4 flex flex-col rounded-bl-lg px-1 bg-white gap-10">
      <div class="flex bg-[#7C3267]">
        <PreviousButton cor="text-white" endereco={'/produtos'}/>
      </div>
      <div class='flex flex-col h-fit xl:h-full xl:flex-row min-h-[565px] '>
          <aside class='w-full pb-0 h-fit xl:w-1/3 px-5  flex flex-col xl:pb-5 xl:px-0'>
              <div class="max-w-full max-h-96 min-h-[384px] justify-center flex pb-2">
                <img class="object-cover" src="http://localhost:3333/static/{mainimage}" alt="">
              </div>
              <div class="flex justify-center relative overflow-auto snap-mandatory snap-x w-full gap-3">
                {#each produto.imagens as img}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                  {#if img != 'Imagem'}
                    <img class="w-20 h-20 left-0 shrink-0 object-cover snap-start" on:click={() => {mainimage = img}} src="http://localhost:3333/static/{img}" alt="">
                  {/if}
                {/each}
              </div>
          </aside>
          <div class='px-5 w-full m-0 xl:px-0 xl:w-2/3 xl:ml-24 flex flex-col min-h-[300px]'>
            <div class="pb-5 mt-2 xl:mt-0">
              <h1 class="text-lg xl:text-3xl font-bold mb-0">{produto.nome}</h1>
              <p class="text-xs">cod. {produto.id}</p>
            </div>
            <div class='flex flex-col items-center '>
              {#if produto.quantidadeEmEstoque == 0}
                <div>Produto indisponivel</div>
              {:else}
                <div>
                  Disponivel apenas para {produto.tipo == 'Aluguel' ? 'aluguel' : 'venda'}
                </div>
                {#if produto.promocao != null && produto.promocao.status != 'Inativo'}
                  <div class="bg-[#7C3267] p-2 rounded text-white">Item Em Promoção!</div>
                  <div class='flex items-center text-3xl pt-2.5 flex-col line-through'>
                    {formatedValue}<span class="text-lg">{produto.tipo == 'Aluguel' ? '/Por dia' : ''}</span>
                  </div>
                  <div>
                    {promotionalValue}
                  </div>
                {:else}
                  <div class='flex items-center text-3xl pt-2.5 flex-col'>
                    {formatedValue}<span class="text-lg">{produto.tipo == 'Aluguel' ? '/Por dia' : ''}</span>
                  </div>
                {/if}
                <button on:click={() => {addToCart(), goto('/carrinho')}} 
                  class='rounded-2xl h-10 px-5 m-5 border-0 bg-[#7C3267] text-white '>
                  {produto.tipo == 'Aluguel' ? 'Alugar' : 'Comprar'}
                </button>
              {/if}
            </div>
          </div>
      </div>    
    </div>
    <div class='w-full xl:w-3/4 bg-white rounded-tr-lg my-2.5'>
        <nav class="p-2.5">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ul class='flex flex-col xl:flex-row gap-10'>
                <li on:click={toggleActive} class="ativo-tab font-bold flex flex-col hover:cursor-pointer">Descrição</li>
                <li on:click={toggleActive} class="font-bold flex flex-col hover:cursor-pointer">Especificações Técnicas</li>
                <li on:click={toggleActive} class="font-bold flex flex-col hover:cursor-pointer">Avaliações</li>
            </ul>
        </nav>

        {#if ativo == 'descricao'}
          <p class='pl-6 pb-7 w-10/12'>{produto.descricao}</p>
        {:else}
          {#if ativo == 'especificacoes'}
            <div class="overflow-x-auto">
              <table class="table w-11/12 ml-2">
                <tbody>
                  <tr>
                    <td>Data de fabricação:</td>
                    <td>{produto.dataFabricacao}</td>
                  </tr>
                  <tr>
                    <td>Material:</td>
                    <td>{produto.material}</td>
                  </tr>
                  <tr>
                    <td>Altura:</td>
                    <td>{produto.altura}cm</td>
                  </tr>
                  <tr>
                    <td>Largura:</td>
                    <td>{produto.largura}cm</td>
                  </tr>
                  <tr>
                    <td>Comprimento:</td>
                    <td>{produto.comprimento}cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          {:else}
            <Avaliacoes produtoId={produto.id}/>
          {/if}
        {/if}
    </div> 
  </section>
  {/if}
</div>
<Footer/>

<style>
  .ativo-tab::after {
		content: '';
		width: 100%;
		height: 2px;
		background-color: palevioletred;
	}
</style>