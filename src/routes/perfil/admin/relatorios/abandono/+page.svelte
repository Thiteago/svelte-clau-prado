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
  let qtdeCarrinhosAbandonados = []
  let qtdeCarrinhosCriados = []
  let labels = []
  let data

  $: dataComMaisCarrinhos = ' - '
  $: dataComMaisAbandonos = ' - '
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
  
  function countCartsByDate(carts) {
    let cartCount = {};

    carts.forEach(cart => {
      let date = cart.date;
      if (cartCount[date]) {
        cartCount[date]++;
      } else {
        cartCount[date] = 1;
      }
    });

    return cartCount;
  }
  async function loadStatistics(content){
    if(Object.keys(content).length > 0){
      let abandonedCartsByDate = countCartsByDate(content.cartsAbandoned);
      
      let createdCartsByDate = countCartsByDate(content.cartsCreated);
      
      let maxAbandonedCount = 0;

      for (let date in abandonedCartsByDate) {
        let count = abandonedCartsByDate[date];
        if (count > maxAbandonedCount) {
          maxAbandonedCount = count;
          dataComMaisAbandonos = date;
        }
      }

      let maxCreatedCount = 0;

      for (let date in createdCartsByDate) {
        let count = createdCartsByDate[date];
        if (count > maxCreatedCount) {
          maxCreatedCount = count;
          dataComMaisCarrinhos = date;
        }
      }

    }
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

  async function downloadPDF(){
    let canvas = document.querySelector('#barChart')

    let canvasImg = canvas.toDataURL("image/jpeg", 1.0);
    const doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.text("Relatório de Carrinhos Abandonados", 10, 10);
    doc.addImage(canvasImg, 'PNG', 100, 20, 110, 50 );
    doc.autoTable({ 
      head: [['Data', 'Criados', 'Abandonados']],
      body: content.map((item) => {
        return [item.data, item.criados, item.abandonados]
      }),
      startY: 80
    })

    doc.save("abandono_carrinho.pdf");
  }

  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/carrinhos`);
    content = await response.json();
    content = await formatContent(content)
  });

  async function formatContent(content){
    let formatedContent = []
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

    loadStatistics(content)

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

      formatedContent.push({
        data: label,
        criados: cartCreated.length,
        abandonados: cartAbandoned.length
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
  <button on:click={downloadPDF} class="btn btn-primary">Baixar CSV</button>
</div>

<div class="w-full flex justify-center">
  <div class="w-2/4">
    <Bar id="barChart" {data} options={{ responsive: true }} />
  </div>
</div>
<section class="mt-6">
  <div class="flex items-start justify-evenly">
    <div class="text-center">
      <h2 class="font-bold text-2xl">{dataComMaisCarrinhos}</h2>
      <p>Data com mais Carrinhos</p>
    </div>
    <div class="text-center">
      <h2 class="font-bold text-2xl">{dataComMaisAbandonos}</h2>
      <p>Data com mais abandonos</p>
    </div>
  </div>
  <table id="table" class="table mt-4 w-3/4 m-auto text-center">
    <thead>
      <tr>
        <th>Data</th>
        <th>Criados</th>
        <th>Abandonados</th>
      </tr>
    </thead>
    {#if content.length > 0}
      {#each content as item}
        <tbody>
          <tr>
            <td>{item.data}</td>
            <td>{item.criados}</td>
            <td>{item.abandonados}</td>
          </tr>
        </tbody>
      {/each}
    {/if}
  </table>
</section>