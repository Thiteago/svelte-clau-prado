<script>
import Header from '$lib/components/header/Header.svelte'
import Busca from '$lib/components/busca/Busca.svelte'
import Footer from '$lib/components/footer/Footer.svelte'
import Produto from '$lib/components/produto/Produto.svelte'
import './produtos.scss'
import {onMount} from 'svelte'
import { fetchProducts } from '$lib/js/helpers';

$: produtos = []
let filteredProducts = []
let alugadosFiltered = false
let vendaFiltered = false

onMount(async () => {
  produtos = await fetchProducts()
})

$: {
  if(produtos.length > 0){
    if(alugadosFiltered && vendaFiltered){
      filteredProducts = produtos.filter(item => (item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponível') || (item.Venda.length > 0 && item.Venda.status_venda != 'Indisponível'))
    }else if(alugadosFiltered){
      filteredProducts = produtos.filter(item => item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponível')
    }else if(vendaFiltered){
      filteredProducts = produtos.filter(item => item.Venda.length > 0 && item.Venda.status_venda != 'Indisponível')
    }
    else{
      filteredProducts = produtos
    }
  }
}

</script>

<Header tamanho="pequeno"></Header>

<section class="product-grid">
  <Busca></Busca>

  <div class="wrapper-produto">
    <aside class="container-filter">
      <h1 class="font-bold text-2xl my-3">Filtrar</h1>

      <div class="wrapper-filter">
        <div class="flex flex-col">
          <label for="Alugados">
            <input name="Alugados" type="checkbox" bind:checked={alugadosFiltered} /> Alugados
          </label>
          <label for="Venda">
            <input name="Venda" type="checkbox" bind:checked={vendaFiltered}/> A Venda
          </label>
        </div>
        
        <div class="flex flex-col items-center">
          <h1 class="font-bold text-2xl my-3">Ordenar</h1>
          <select name="order" class="select select-bordered">
            <option default value="low-price">Mais Barato</option>
            <option value="high-price">Mais Caro</option>
          </select>
        </div>
      </div>
    </aside>
    <div class="container-produtos">
      {#await produtos}
        <div class="sem-produtos">
          <h1>Nenhum produto encontrado</h1>
        </div>
        {:then}
          {#each filteredProducts as item}
            {#if (item.Aluguel.length > 0 && item.Aluguel.status_aluguel != 'Indisponível') || (item.Venda.length > 0 && item.Venda.status_venda != 'Indisponível')}
              <Produto data={item}/>
            {/if}
          {/each}
      {/await}
      {#if produtos.length == 0}
        <div class="sem-produtos">
          <h1>Nenhum produto encontrado</h1>
        </div>
      {/if}
    </div>
  </div>

</section>
<Footer></Footer>