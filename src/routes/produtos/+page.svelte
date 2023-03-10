<script>
import Header from '$lib/components/header/Header.svelte'
import Busca from '$lib/components/busca/Busca.svelte'
import Footer from '$lib/components/footer/Footer.svelte'
import Produto from '$lib/components/produto/Produto.svelte'
import './produtos.scss'
import {onMount} from 'svelte'
import { fetchProducts } from '$lib/js/helpers';

$: produtos = []

onMount(async () => {
  produtos = await fetchProducts()
})


</script>

<Header tamanho="pequeno"></Header>

<section class="product-grid">
  <Busca></Busca>

  <div class="wrapper-produto">
    <aside class="container-filter">
      <h1 class="font-bold text-xl my-3">Filtrar</h1>

      <div class="wrapper-filter">
        <div>
          <input name="Alugados" type="checkbox" /> <label for="Alugados">Alugados</label>
        </div>
        <div>
          <input name="Venda" type="checkbox" /> <label for="Venda">A Venda</label>
        </div>
      </div>
    </aside>
    <div class="container-produtos">
      {#each produtos as item}
        {#if (item.Aluguel != null && item.Aluguel.status_aluguel != 'Indisponível') || (item.Venda != null && item.Venda.status_venda != 'Indisponível')}
          <Produto id={item.id} title={item.nome} description={item.descricao} type={item.Aluguel != null ? 'Aluguel' : 'Venda'} buttonType={item.Aluguel != null ? 'Aluguel' : 'Venda'} valor={item.valor}></Produto>
          {:else}
          <div class="sem-produtos">
            <h1>Nenhum produto encontrado</h1>
          </div>
        {/if}
      {/each}
      {#if produtos.length == 0}
        <div class="sem-produtos">
          <h1>Nenhum produto encontrado</h1>
        </div>
      {/if}
    </div>
  </div>

</section>
<Footer></Footer>