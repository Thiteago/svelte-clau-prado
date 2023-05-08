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
  let qtdeCarrinhosAbandonados = []
  let qtdeCarrinhosCriados = []
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
          label: 'Qtde de carrinhos abandonados',
          data: qtdeCarrinhosAbandonados,
          backgroundColor: [
            'rgba(255, 134,159,0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(255, 134, 159, 1)',
          ],
        },
        {
          label: 'Qtde de carrinhos criados',
          data: qtdeCarrinhosCriados,
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
      const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/carrinhos/selecionar`,{
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
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/carrinhos`);
    content = await response.json();
    content = await formatContent(content)
  });

  async function formatContent(content){
    qtdeCarrinhosAbandonados = []
    qtdeCarrinhosCriados = []
    let uniqueDates = new Set();

    content.cartsAbandoned.forEach(item => {
      item.date = formatDate(item.date)
      uniqueDates.add(item.date);
    })

    content.cartsCreated.forEach(item => {
      item.date = formatDate(item.date)
      uniqueDates.add(item.date);
    })


    labels = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b));

    labels.forEach(label => {
      let cartAbandoned = content.cartsAbandoned.filter(item => item.date == label)
      let cartCreated = content.cartsCreated.filter(item => item.date == label)

      if(cartAbandoned.length == 0){
        qtdeCarrinhosAbandonados.push(0)
      }else{
        qtdeCarrinhosAbandonados.push(cartAbandoned.length)
      }
      if(cartCreated.length == 0){
        qtdeCarrinhosCriados.push(0)
      }else{
        qtdeCarrinhosCriados.push(cartCreated.length)
      }
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
