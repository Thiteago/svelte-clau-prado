<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { Bar } from 'svelte-chartjs';
	import { onMount } from "svelte";
  import { formatDate } from '$lib/js/helpers.js';

  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';

  Chart.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  );

  let content = []
  let info = []
  let labels = []
  let data
  

  $: if(content){
    data = {
      labels: labels,
      datasets: [

      ]
    };
  }




  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/conversaoDeVendas`);
    content = await response.json();
    content = await formatContent()
  });

  async function formatContent(){
    let uniqueDates = new Set();

    content.pedido.forEach(item => {
      item.data_pedido = formatDate(item.data_pedido)
    })

    content.visitas.forEach(item => {
      item.date = formatDate(item.date)
    })

    content.pedido.forEach(pedido => {
      uniqueDates.add(pedido.data_pedido);
    });

    content.visitas.forEach(visita => {
      uniqueDates.add(visita.date);
    });

    labels = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b));
  }
</script>
<div class="text-center">
  <h1 class="text-2xl my-8">Esse gráfico reflete a quantidade de vendas e aluguéis nos últimos 7 Dias</h1>
</div>


<Bar {data} options={{ responsive: true }} />




<!-- <section>
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
</section> -->
