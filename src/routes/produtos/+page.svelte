<script>
import Header from '$lib/components/header/Header.svelte'
import Busca from '$lib/components/busca/Busca.svelte'
import Footer from '$lib/components/footer/Footer.svelte'
import Produto from '$lib/components/produto/Produto.svelte'
import './produtos.scss'
import {onMount} from 'svelte'

$: produtos = []

async function getProdutos() {
  const response = await fetch('http://localhost:3333/Produto')
  const data = await response.json()
  produtos = data
}

onMount(async () => {
  await getProdutos()
})

</script>

<Header tamanho="pequeno"></Header>

<section class="product-grid">
  <Busca></Busca>

  <div class="wrapper-produto">
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