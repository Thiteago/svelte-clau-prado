<script>
import SubHeader from '$lib/components/subHeader/SubHeader.svelte'
import Header from '$lib/components/header/Header.svelte'
import Busca from '$lib/components/busca/Busca.svelte'
import Produto from '$lib/components/produto/Produto.svelte'
import './produtos.scss'
import {onMount} from 'svelte'
import { fetchProducts } from '$lib/js/helpers';
	import Footer from '$lib/components/footer/Footer.svelte';

$: produtos = []
$: selectedOrder = 'low-price'
let filteredProducts = []
let alugadosFiltered = false
let vendaFiltered = false
$: searchInput = ''


onMount(async () => {
  produtos = await fetchProducts()
})

$: {
  if(alugadosFiltered && vendaFiltered){
    filteredProducts = produtos.filter(
      item => 
      (item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponivel') 
      || (item.Venda.length > 0 && item.Venda.status_venda != 'Indisponivel'))
    .filter(item => item.nome.toLowerCase().includes(searchInput.toLowerCase()))
  }else if(alugadosFiltered){
    filteredProducts = produtos.filter(item => 
      item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponível')
    .filter(item => item.nome.toLowerCase().includes(searchInput.toLowerCase()))
  }else if(vendaFiltered){
    filteredProducts = produtos.filter(item =>
      item.Venda.length > 0 && item.Venda.status_venda != 'Indisponível')
    .filter(item => item.nome.toLowerCase().includes(searchInput.toLowerCase()))
  }else if(searchInput !== ''){
    filteredProducts = produtos.filter(item => item.nome.toLowerCase().includes(searchInput.toLowerCase()))
  }else{
    filteredProducts = produtos
  }

  if (selectedOrder === 'low-price') {
    filteredProducts = filteredProducts.sort((a, b) => a.valor - b.valor);
  } else if (selectedOrder === 'high-price') {
    filteredProducts = filteredProducts.sort((a, b) => b.valor - a.valor);
  }
}


</script>
<div class="bg-white">
  <SubHeader/>
  <Header />
</div>

<section class="product-grid">
  <Busca bind:busca={searchInput}></Busca>

  <div class="wrapper-produto">
    <aside class="container-filter">
      <div class="wrapper-filter">
        <div class="flex flex-col">
          <h1 class="font-bold text-2xl my-3">Filtrar</h1>
          <label for="Alugados">
            <input name="Alugados" type="checkbox" bind:checked={alugadosFiltered} /> Alugados
          </label>
          <label for="Venda">
            <input name="Venda" type="checkbox" bind:checked={vendaFiltered}/> A Venda
          </label>
        </div>
        
        <div class="flex flex-col items-center">
          <h1 class="font-bold text-2xl my-3">Ordenar</h1>
          <select bind:value={selectedOrder} name="order" class="select select-bordered">
            <option default value="low-price">Mais Barato</option>
            <option value="high-price">Mais Caro</option>
          </select>
        </div>
      </div>
    </aside>
    <div class="container-produtos">
      {#each filteredProducts as item}
        {#if (item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponível') || (item.Venda.length > 0 && item.Venda.status_venda != 'Indisponível')}
          <Produto data={item}/>
        {:else if filteredProducts.length == 0 && !(alugadosFiltered || vendaFiltered)}
          <div class="m-auto">
            Infelizmente não temos nenhum produto disponível no momento 😥
          </div>
        {/if}
      {/each}
      {#if filteredProducts.length == 0 && !(alugadosFiltered || vendaFiltered)}
        <div class="sem-produtos">
          <h1>Nenhum produto encontrado</h1>
        </div>
        {:else if alugadosFiltered || vendaFiltered }
          <div class="m-auto">
            Nenhum resultado com os filtros selecionados, tente novamente 🥹
          </div>
      {/if}
    </div>
  </div>
</section>
<Footer/>

