<script>
import Header from '$lib/components/header/Header.svelte'
import Busca from '$lib/components/busca/Busca.svelte'
import Footer from '$lib/components/footer/Footer.svelte'
import Produto from '$lib/components/produto/Produto.svelte'
import {api} from '$lib/services/api'
import './style.scss'
import {onMount} from 'svelte'

$: produtos = []

function getProdutos() {
  api.get("/Produto").then((response) => {
    const prod= response.data.produtos
    produtos = [...prod]
  })
}

onMount(() => {
  getProdutos()
})

</script>

<Header tamanho="pequeno"></Header>

<section class="product-grid">
  <Busca></Busca>

  <div class="wrapper-produtos">
    <aside class="container-filter">
      <h1>Filtrar</h1>

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
        <Produto id={item.id} title={item.nome} description={item.descricao} type={item.tipo} buttonType={item.tipo}></Produto>
      {/each}
    </div>
  </div>

</section>
<Footer></Footer>