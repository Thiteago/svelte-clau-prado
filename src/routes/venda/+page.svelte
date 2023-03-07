<script>
  import './venda.scss'
  import { cart } from '$lib/js/stores/cart.js'
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Header from '$lib/components/header/Header.svelte'
  import PreviousButton from '$lib/components/previousbutton/Previousbutton.svelte'
  import Footer from '$lib/components/footer/Footer.svelte'

  const produtoId = $page.url.searchParams.get('produto_id');

  let produto = {}
  $: ativo = 'descricao'
  $: images = []
  $: mainimage = images[0]

  function addToCart(){
    if(!$cart.find(produtos => produtos.id == produto.id)){
      let product = {...produto, imagens: images[0], quantidade: 1}
      $cart = [...$cart, product]
    }
  }

  function toggleActive(e){
    let liList = document.getElementsByTagName("li")
    if(!(e.target.className  == "ativo")){
      for(let i = 0; i < liList.length; i++){
        if(liList[i] != e.target){
          liList[i].className = ""
        }
      }
      e.target.className = "ativo"
      if(e.target.innerHTML == "Descrição"){
        ativo = "descricao"
      }else if(e.target.innerHTML == "Especificações Técnicas"){
        ativo = "especificacoes"
      }else{
        ativo = "avaliacoes"
      }
    }
  }

  async function getInfo(){

    const response = await fetch(`http://localhost:3333/Produto/${produtoId}`)
    const data = await response.json()
    produto = {...data}
    produto.dataCriacao = new Date(produto.dataCriacao).toLocaleDateString('pt-BR')
    
  }

  async function getImages(){

    const response = await fetch(`http://localhost:3333/Produto/ImagePath/${produtoId}`)
    const data = await response.json()
    images = [...data.caminhos]

  }

  onMount(() => {
    getInfo()
    getImages()
  })


</script>

<div>
  <Header tamanho='pequeno'></Header>
  {#if Object.keys(produto).length > 0}
  <section class="container-produto">
    <div class="container-info">
      <PreviousButton endereco={'/produtos'}></PreviousButton>
        <div class='wrapper-info'>
          <aside class='imagem-produto'>
              <div class="max-w-full justify-center flex pb-2">
                {#if images.length > 0}
                  <img class="h-80" src="http://localhost:3333/static/{mainimage}" alt="">
                {/if}
              </div>
              <div class="flex w-28 gap-3">
              {#if images.length > 0}
                {#each images as img}
                  <div class="container-img">
                    <img class="img" on:click={() => {mainimage = img}} src="http://localhost:3333/static/{img}" alt="">
                  </div>
                {/each}
              {/if}
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
              <div class='info-situation'>Disponivel apenas para {produto.Aluguel != null ? 'aluguel' : 'venda'}
              </div>
              <div class='price-info'>
                R${produto.valor}
              </div>
                <button on:click={() => {addToCart(), goto('/carrinho')}} class='button'>{produto.Aluguel != null ? 'Alugar' : 'Comprar'}</button>
              {/if}
            </div>
          </div>
      </div>    
    </div>
    <div class='more-info'>
        <nav class="wrapper-menu">
            <ul class='container-menu'>
                <li on:click={toggleActive} class='ativo'>Descrição</li>
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
                <!-- row 1 -->
                <tr>
                  <td>Data de fabricação:</td>
                  <td>{produto.dataCriacao}</td>
                </tr>
                <!-- row 2 -->
                <tr>
                  <td>Material:</td>
                  <td>{produto.material}</td>
                </tr>
                <!-- row 3 -->
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
            <p class='container-descricao'>{produto.avaliações}</p>
          {/if}
        {/if}
    </div> 
  </section>
  {/if}
  <Footer></Footer>
</div>


<style>
  .img{
    width: 100%;
    object-fit: contain;
    height: 90px;
  }

  .container-img{
    width: 110px;
    height: 110px;
  }
</style>