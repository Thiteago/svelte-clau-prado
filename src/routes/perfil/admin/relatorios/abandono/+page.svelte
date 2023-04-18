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
  let qtdeCarrinhosAbandonados = []
  let qtdeCarrinhosCriados = []
  let labels = []
  let data
  

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




  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/carrinhos`);
    content = await response.json();
    content = await formatContent()
  });

  async function formatContent(){
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


    qtdeCarrinhosAbandonados.push(content.cartsAbandoned.length)
    qtdeCarrinhosCriados.push(content.cartsCreated.length)
  }
</script>
<div class="text-center">
  <h1 class="text-2xl my-8">Esse gráfico reflete a quantidade de visitantes e as de venda nos ultimos 7 dias</h1>
</div>

<div class="w-full flex justify-center">
  <div class="w-3/4">
    <Bar {data} options={{ responsive: true }} />
  </div>
</div>
