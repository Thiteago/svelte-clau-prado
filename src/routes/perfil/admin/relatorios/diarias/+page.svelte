<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import BarChart from "$lib/components/barChart/BarChart.svelte";
	import { onMount } from "svelte";
  import { formatDate } from '$lib/js/helpers.js';

  let content = []
  let labels = []
  let info = []
  $: diaMaisPedidos = ''
  $: maiorLucro = ''
  $: maisVendas = {}
  $: maisAlugueis = {}
  $: pedidoMaisProdutos = {}
  
  async function loadStatistics(content){
    diaMaisPedidos = content.filter((item) => 
      item.alugueis.length + item.vendas.length == Math.max(...content.map((item) => 
      item.alugueis.length + item.vendas.length)))[0]?.data_pedido
    diaMaisPedidos = formatDate(diaMaisPedidos)
    maiorLucro = content.reduce((maior, atual) => {
      if(atual.valor > maior.valor) {
        return atual;
      } else {
        return maior;
      }
    });

    maisVendas = content.reduce((maior, atual) => {
      if (atual.vendas.length > maior.vendas.length) {
        return atual;
      } else {
        return maior;
      }
    });

    maisAlugueis = content.reduce((maior, atual) => {
      if (atual.alugueis.length > maior.alugueis.length) {
        return atual;
      } else {
        return maior;
      }
    });

    pedidoMaisProdutos = content.reduce((maior, atual) => {
      if (atual.alugueis.length + atual.vendas.length > maior.alugueis.length + maior.vendas.length) {
        return atual;
      } else {
        return maior;
      }
    });
  }
  
  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/vendasDiarias`);
    content = await response.json();
    content = await formatContent()
    content.sort((a, b) => (a.id > b.id) ? 1 : -1)
    if(content.length > 0){
      loadStatistics(content)
    }else{
      diaMaisPedidos = ' - '
      maiorLucro = ' - '
      maisVendas = {
        id: ' - ',
        valor: ' - '
      }
    }
    
  });

  async function formatContent(){
    content.forEach((item) => {
      let repeatedIndex = []
      const date = formatDate(item.data_pedido)
      if(labels.includes(date)){
        repeatedIndex.push(labels.indexOf(date))
        info[repeatedIndex[0]] += item.alugueis.length + item.vendas.length
        return
      }
      let qtdeVendas = item.alugueis.length + item.vendas.length
      info.push(qtdeVendas)
      labels.push(date)
    })  
    return content
  }
</script>
<div class="text-center">
  <h1 class="text-2xl my-8">Esse gráfico reflete a quantidade de vendas e aluguéis nos últimos 7 Dias</h1>
</div>
<div class="w-6/12 flex m-auto">
  <BarChart {content} {labels} {info}/>
</div>
<section class="mt-6">
  <div class="flex items-start justify-evenly">
    <div class="text-center">
      <h2 class="font-bold text-2xl">{diaMaisPedidos}</h2>
      <p>Data com mais pedidos</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">R${maiorLucro.valor}</h2>
      <p>Maior lucro em um pedido</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {maisVendas.id}
      </h2>
      <p>Pedido com mais vendas</p>
      {#if maisVendas.vendas}
        <span>Qntd de vendas: {maisVendas.vendas.length}</span>
      {/if}
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {maisAlugueis.id}
      </h2>
      {#if maisAlugueis.alugueis}
        <span>Qtde de Alugueis: {maisAlugueis.alugueis.length} </span>
      {/if}
      
      <p>Pedido com mais Alugueis</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {pedidoMaisProdutos.id}
      </h2>
      {#if pedidoMaisProdutos.alugueis || pedidoMaisProdutos.vendas}
        <span> Qtde de produtos: {pedidoMaisProdutos.alugueis.length + pedidoMaisProdutos.vendas.length}</span>
      {/if}
      <p>Pedido com mais produtos</p>
    </div>
  </div>
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
