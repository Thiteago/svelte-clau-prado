<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import BarChart from "$lib/components/barChart/BarChart.svelte";
	import { onMount } from "svelte";
  import { formatDate } from '$lib/js/helpers.js';
  import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte'
  import { jsPDF } from "jspdf";

  const today = new Date().toISOString().split('T')[0]
  let content = []
  let labels = []
  let info = []
  $: flash = {
    message: '',
    type: 'warning',
    time: 3000,
    visible: false
  }
  $: dataInicial = ''
  $: dataFinal = ''
  $: diaMaisPedidos = ''
  $: maiorLucro = ''
  $: maisVendas = {}
  $: maisAlugueis = {}
  $: pedidoMaisProdutos = {}
  $: limitInitialDate = ''
  $: limitFinalDate = ''

  $: if(dataInicial != ''){
    limitInitialDate = new Date(dataInicial).toISOString().split('T')[0]
  }

  $: if(dataFinal != ''){
    limitFinalDate = new Date(dataFinal).toISOString().split('T')[0]
  }
  
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
  
  async function searchByDate(){
    if(dataInicial != '' && dataFinal != ''){
      const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/vendasDiarias/selecionar`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataInicial,
          dataFinal
        })
      });
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
    }else if(dataFinal == '' && dataInicial != ''){
      flash.message = 'Preencha a data final'
      flash.type = 'error'
      flash.visible = true
    }else if(dataInicial == '' && dataFinal != ''){
      flash.message = 'Preencha a data inicial'
      flash.type = 'error'
      flash.visible = true
    }else{
      flash.message = 'Preencha as datas'
      flash.type = 'error'
      flash.visible = true
    }

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

  async function downloadPDF(){
    let canvas = document.querySelector('#barChart')

    let canvasImg = canvas.toDataURL("image/jpeg", 1.0);
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Relatório de Vendas Diárias", 10, 10);
    doc.addImage(canvasImg, 'PNG', 100, 20, 110, 50 );
    doc.autoTable({ 
      head: [['ID', 'Data', 'Valor', 'Aluguéis', 'Vendas']],
      body: content.map((item) => {
        return [item.id, item.data_pedido, item.valor, item.alugueis.length, item.vendas.length]
      }),
      startY: 80
    })

    doc.save("vendas_diarias.pdf");
  }

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
  <h1 class="text-2xl my-8">Esse gráfico por padrão, reflete a quantidade de vendas e aluguéis nos últimos 7 Dias</h1>
</div>
{#if flash.message != '' }
  <FlashMessage message={flash.message} type={flash.type} time={flash.time} visible={flash.visible}/>
{/if}
<div class="flex justify-center gap-3 my-6">
  <input type="date" bind:value={dataInicial} max={limitFinalDate != '' ? limitFinalDate : today} placeholder="Data Inicial" class="input input-bordered w-full max-w-xs" />
  <input type="date" bind:value={dataFinal} min={limitInitialDate} max={today} placeholder="Data Final" class="input input-bordered w-full max-w-xs" />
  <button on:click={searchByDate} class="btn">Filtrar</button>
  <button on:click={downloadPDF} class="btn btn-primary">Baixar CSV</button>
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
      <h2 class="font-bold text-2xl">R${maiorLucro.valor != undefined ? maiorLucro.valor : "-"}</h2>
      <p>Maior lucro em um pedido</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {maisVendas.id}
      </h2>
      {#if maisVendas.vendas}
        <span>Qntd de vendas: {maisVendas.vendas.length}</span>
      {/if}
      <p>Pedido com mais vendas</p>
      
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {maisAlugueis?.id != undefined ? maisAlugueis?.id : " - "}
      </h2>
      {#if maisAlugueis?.alugueis}
        <span>Qtde de Alugueis: {maisAlugueis.alugueis.length} </span>
      {/if}
      
      <p>Pedido com mais Alugueis</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {pedidoMaisProdutos.id != undefined ? pedidoMaisProdutos.id : " - "}
      </h2>
      {#if pedidoMaisProdutos.alugueis || pedidoMaisProdutos.vendas}
        <span> Qtde de produtos: {pedidoMaisProdutos.alugueis.length + pedidoMaisProdutos.vendas.length}</span>
      {/if}
      <p>Pedido com mais produtos</p>
    </div>
  </div>
  <table id="table" class="table mt-4 w-full">
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
