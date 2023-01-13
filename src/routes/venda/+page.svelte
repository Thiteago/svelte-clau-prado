<script>
  import './venda.scss'
  import { cart } from '$lib/stores/cart.js'
  import { page } from '$app/stores';
	import { api } from '$lib/services/api';
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
      $cart = [...$cart, produto]
    }
    console.log($cart)
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

  function getInfo(){
    api.get(`/Produto/${produtoId}`).then((response) =>{
      const res = response.data
      produto = {...res}
      produto.dataCriacao = new Date(produto.dataCriacao).toLocaleDateString('pt-BR')
    })
  }

  function getImages(){
    api.get(`/Produto/ImagePath/${produtoId}`).then((response) => {
      const res = response.data.caminhos
      images = [...res]
    })
  }
  getInfo()
  getImages()

</script>

<div>
  <Header tamanho='pequeno'></Header>
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
                  <img on:click={() => {mainimage = img}} src="http://localhost:3333/static/{img}" alt="">
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
              <div class='info-situation'>Disponivel apenas para {produto.tipo}
              </div>
              <div class='price-info'>
                R${produto.valor}
              </div>
                <button on:click={addToCart} class='button'>{produto.tipo == 'Aluguel' ? 'Alugar' : 'Comprar'}</button>
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
  <Footer></Footer>
</div>
