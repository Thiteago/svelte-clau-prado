<script>
  import './venda.scss'
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
    if(!$cart.find(produtos => produtos.id == produto.id)){
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
          liList[i].className = ""
        }
      }
      e.target.className = "ativo-tab"
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
  <section class="container-produto">
    <div class="container-info">
      <PreviousButton endereco={'/produtos'}/>
        <div class='wrapper-info'>
          <aside class='imagem-produto'>
              <div class="max-w-full justify-center flex pb-2">
                <img class="h-80" src="http://localhost:3333/static/{mainimage}" alt="">
              </div>
              <div class="flex gallery w-full gap-3">
                {#each produto.imagens as img}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                  {#if img != 'Imagem'}
                    <img on:click={() => {mainimage = img}} src="http://localhost:3333/static/{img}" alt="">
                  {/if}
                {/each}
              </div>
          </aside>
          <div class='info-produto'>
            <div class="wrapper-title">
              <h1>{produto.nome}</h1>
              <p>cod. {produto.id}</p>
            </div>
            <div class='wrapper-buy'>
              {#if produto.quantidadeEmEstoque == 0}
                <div class='info-situation'>Produto indisponivel</div>
              {:else}
              <div class='info-situation'>Disponivel apenas para {produto.tipo == 'Aluguel' ? 'aluguel' : 'venda'}
              </div>
              {#if produto.promocao != null && produto.promocao.status != 'Inativo'}
                <div></div>
              {/if}
              <div class='price-info flex-col'>
                {formatedValue}<span class="text-sm">{produto.tipo == 'Aluguel' ? '/Por dia' : ''}</span>
              </div>
                <button on:click={() => {addToCart(), goto('/carrinho')}} class='button'>{produto.tipo == 'Aluguel' ? 'Alugar' : 'Comprar'}</button>
              {/if}
            </div>
          </div>
      </div>    
    </div>
    <div class='more-info'>
        <nav class="wrapper-menu">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ul class='container-menu'>
                <li on:click={toggleActive} class='ativo-tab'>Descrição</li>
                <li on:click={toggleActive}>Especificações Técnicas</li>
                <li on:click={toggleActive}>Avaliações</li>
            </ul>
        </nav>

        {#if ativo == 'descricao'}
          <p class='container-descricao'>{produto.descricao}</p>
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
  .img{
    width: 100%;
    object-fit: cover;
    height: 90px;
  }

  .container-img{
    width: 110px;
    height: 110px;
  }
</style>