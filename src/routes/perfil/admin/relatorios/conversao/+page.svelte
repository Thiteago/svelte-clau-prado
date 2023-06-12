<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { Bar } from 'svelte-chartjs';
  import { jsPDF } from "jspdf";
  import { autoTable } from 'jspdf-autotable';
	import { onMount } from "svelte";
  import { formatDate } from '$lib/js/helpers.js';
  import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte'

  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';

  const pluginBackground = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) =>{
      let {ctx} = chart;
      ctx.fillStyle = "white";
      ctx.fillRect(0,0, chart.width, chart.height);
    }
  }

  Chart.register(
    Title,
    Tooltip,
    Legend,
    pluginBackground,
    BarElement,
    CategoryScale,
    LinearScale
  );

  const today = new Date().toISOString().split('T')[0]
  let content = []
  let qtdeVendas = []
  let qtdeVisitantes = []
  let labels = []
  let data
  let options

  $: diaMaisVisitas = ' - '
  $: maiorQuantidadeVisitas = ' - '
  $: dataMaisConversao = ' - '
  $: maiorQuantidadeVendas = ' - '
  $: dataInicial = ''
  $: dataFinal = ''
  $: limitInitialDate = ''
  $: limitFinalDate = ''
  $: flash = {
    message: '',
    type: 'warning',
    time: 3000,
    visible: false
  }
  

  $: if(content){
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Qtde de vendas/aluguel',
          data: qtdeVendas,
          backgroundColor: [
            'rgba(255, 134,159,0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(255, 134, 159, 1)',
          ],
        },
        {
          label: 'Qtde de visitantes',
          data: qtdeVisitantes,
          backgroundColor: [
            'rgba(98,  182, 239,0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(98,  182, 239, 1)',
          ],
        },
      ]
    },
    options = {
      responsive: true,
    }
  }

  async function loadStatistics(content){
    if(Object.keys(content).length > 0){
      
      let visitasPorData = {};
      let vendasPorData = {};

      content.pedido.forEach((pedido) => {
        let dataPedido = pedido.data_pedido;
        let totalVendas = pedido.vendas.length + pedido.alugueis.length;
        if (vendasPorData[dataPedido]) {
          vendasPorData[dataPedido] += totalVendas;
        } else {
          vendasPorData[dataPedido] = totalVendas;
        }
      });

      content.visitas.forEach((visita) => {
        let dataVisita = visita.date;
        if (visitasPorData[dataVisita]) {
          visitasPorData[dataVisita]++;
        } else {
          visitasPorData[dataVisita] = 1;
        }
      });

      diaMaisVisitas = null;
      maiorQuantidadeVisitas = 0;
      maiorQuantidadeVendas = 0;
      dataMaisConversao = ' - ';

      for (let dataVisita in visitasPorData) {
        if (visitasPorData[dataVisita] > maiorQuantidadeVisitas) {
          diaMaisVisitas = dataVisita;
          maiorQuantidadeVisitas = visitasPorData[dataVisita];
        }
      }
      for (let dataVenda in vendasPorData) {
        if (vendasPorData[dataVenda] > maiorQuantidadeVendas) {
          dataMaisConversao = dataVenda;
          maiorQuantidadeVendas = vendasPorData[dataVenda];
        }
      }

    }
  }

  async function searchByDate(){
    if(dataInicial != '' && dataFinal != ''){
      let response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/conversaoDeVendas/selecionar`,{
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
      content = await formatContent(content)
      
      
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

  async function downloadPDF(){
    let canvas = document.querySelector('#barChart')

    let canvasImg = canvas.toDataURL("image/jpeg", 1.0);
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Relatório de Conversão de vendas", 10, 10);
    doc.addImage(canvasImg, 'PNG', 100, 20, 110, 50 );
    doc.autoTable({ 
      head: [['Data', 'Visitas', 'Vendas/Alugueis']],
      body: content.map((item) => {
        return [item.data, item.visitantes, item.vendas]
      }),
      startY: 80
    })

    doc.save("conversao_vendas.pdf");
  }




  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/conversaoDeVendas`);
    content = await response.json();
    content = await formatContent(content)
  });

  async function formatContent(content){
    let uniqueDates = new Set();
    let formatedContent = []

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

    loadStatistics(content)

    labels = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b));


    qtdeVendas = []
    qtdeVisitantes = []

    labels.forEach(label => {
      let sum = 0
      let qtdeVisitantesPorData = 0
      let qtdeVendasPorData = 0

      qtdeVendasPorData = content.pedido.filter(pedido => pedido.data_pedido === label)

      qtdeVisitantesPorData = content.visitas.filter(visita => visita.date === label).length


      qtdeVendasPorData.forEach((item) => {
        sum += item.vendas.length + item.alugueis.length
      })
      qtdeVendas.push(sum)
      qtdeVisitantes.push(qtdeVisitantesPorData)
      formatedContent.push({
        data: label,
        visitantes: qtdeVisitantesPorData,
        vendas: sum
      })
    })

    return formatedContent
  }
</script>
<div class="text-center">
  <h1 class="text-2xl my-8">Esse gráfico por padrão, reflete a quantidade de visitantes e as de venda nos ultimos 7 dias</h1>
</div>
{#if flash.message != '' }
  <FlashMessage message={flash.message} type={flash.type} time={flash.time} visible={flash.visible}/>
{/if}
<div class="flex justify-center gap-3 my-6">
  <input type="date" bind:value={dataInicial} max={limitFinalDate != '' ? limitFinalDate : today} placeholder="Data Inicial" class="input input-bordered w-full max-w-xs" />
  <input type="date" bind:value={dataFinal} min={limitInitialDate} max={today} placeholder="Data Final" class="input input-bordered w-full max-w-xs" />
  <button on:click={searchByDate} class="btn">Filtrar</button>
  <button on:click={downloadPDF} class="btn btn-primary">Baixar PDF</button>
</div>

<div class="w-full flex justify-center">
  <div class="w-2/4">
    <Bar style="margin: 0 auto" id="barChart" width="600" {data} {options} />
  </div>
</div>
<section class="mt-6">
  <div class="flex items-start justify-evenly">
    <div class="text-center">
      <h2 class="font-bold text-2xl">{diaMaisVisitas}</h2>
      <p>Data com mais Visitas</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">{maiorQuantidadeVisitas}</h2>
      <p>Maior quantidade de visitas</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {dataMaisConversao}
      </h2>
      <p>Data com maior quantidade de vendas</p>
      
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">
        {maiorQuantidadeVendas}
      </h2>      
      <p>Pedido com mais Alugueis</p>
    </div>
  </div>
  <table id="table" class="table mt-4 w-3/4 m-auto text-center">
    <thead>
      <tr>
        <th>Data</th>
        <th>Visitas</th>
        <th>Vendas</th>
      </tr>
    </thead>
    {#if content.length > 0}
      {#each content as item}
        <tbody>
          <tr>
            <td>{item.data}</td>
            <td>{item.visitantes}</td>
            <td>{item.vendas}</td>
          </tr>
        </tbody>
      {/each}
    {/if}
  </table>
</section>
