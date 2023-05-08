<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { Bar } from 'svelte-chartjs';
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

  Chart.register(
    Title,
    Tooltip,
    Legend,
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
    };
  }

  async function searchByDate(){
    if(dataInicial != '' && dataFinal != ''){
      const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/conversaoDeVendas/selecionar`,{
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




  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/conversaoDeVendas`);
    content = await response.json();
    content = await formatContent(content)
  });

  async function formatContent(content){
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

    labels.forEach(label => {
      let sum = 0
      let qtdeVendasPorData = content.pedido.filter(pedido => pedido.data_pedido === label)
      let qtdeVisitantesPorData = content.visitas.filter(visita => visita.date === label).length

      qtdeVendasPorData.forEach((item) => {
        sum += item.vendas.length + item.alugueis.length
      })
      qtdeVendas.push(sum)
      qtdeVisitantes.push(qtdeVisitantesPorData)
    })
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
</div>

<div class="w-full flex justify-center">
  <div class="w-2/4">
    <Bar {data} options={{ responsive: true }} />
  </div>
</div>
