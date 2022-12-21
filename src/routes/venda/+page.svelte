<script>
  import './style.scss'
  import { page } from '$app/stores';
	import { api } from '$lib/services/api';
  import Header from '$lib/components/header/Header.svelte'
  import PreviousButton from '$lib/components/previousbutton/Previousbutton.svelte'
  import Footer from '$lib/components/footer/Footer.svelte'

  const produtoId = $page.url.searchParams.get('produto_id');

  $: produto = {}
  $: images = []
  $: mainimage = images[0]


  function getInfo(){
    api.get(`/Produto/${produtoId}`).then((response) =>{
      const res = response.data.produto
      produto = {...res}
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
              <img class="h-80" src="http://localhost:3333/static/{mainimage}" alt="">
            </div>
            <div class="flex w-28">
            {#each images as img}
              <img on:click={() => {mainimage = img}} src="http://localhost:3333/static/{img}" alt="">
            {/each}
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

            </div>
            <div class='wrapper-button'>
              <button class='button'>{produto.tipo == 'Aluguel' ? 'Alugar' : 'Comprar'}</button>
            </div>
          </div>
        </div>
    </div>    
  </div>
  <div class='more-info'>
      <nav class="wrapper-menu">
          <ul class='container-menu'>
              <li class='ativo'>Descrição</li>
              <li>Especificações Técnicas</li>
              <li>Avaliações</li>
          </ul>
      </nav>

      <p class='container-descricao'>{produto.descricao}</p>
  </div> 


</section>



<Footer></Footer>
</div>
