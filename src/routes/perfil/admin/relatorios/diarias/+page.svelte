<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import BarChart from "$lib/components/barChart/BarChart.svelte";
	import { onMount } from "svelte";
  import { formatDate } from '$lib/js/helpers.js';

  let content = []

  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/vendasDiarias`);
    content = await response.json();
  });
</script>
<div class="text-center">
  <h1 class="text-2xl my-8">Esse gráfico reflete a quantidade de vendas e aluguéis nos últimos 7 Dias</h1>
</div>
<BarChart {content}/>
<section>
  <h2 class="text-2xl">Pedidos</h2>
  <table class="table mt-4 w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>Data do Pedido</th>
        <th>Valor Total</th>
        <th>Qtde. Vendidos</th>
        <th>Qtde. Alugados</th>
      </tr>
    </thead>
    {#each content as item}
      <tbody>
        <tr>
          <th>{item.id}</th>
          <td>{formatDate(item.data_pedido)}</td>
          <td>R${item.valor}</td>
          <td>{item.vendas.length}</td>
          <td>{item.alugueis.length}</td>
        </tr>
      </tbody>
    {/each}
  </table>
</section>
