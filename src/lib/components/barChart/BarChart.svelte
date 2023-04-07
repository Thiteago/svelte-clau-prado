<script>
  import { Bar } from 'svelte-chartjs';
  import { formatDate } from '$lib/js/helpers.js';
  export let content
  let labels = []
  let info = []
  let data = {}

  $: if(content){
    formatContent()
    data = {
    labels: labels,
    datasets: [
      {
        label: 'Qtde de vendas',
        data: info,
        backgroundColor: [
          'rgba(255, 134,159,0.4)',
          'rgba(98,  182, 239,0.4)',
          'rgba(255, 218, 128,0.4)',
          'rgba(113, 205, 205,0.4)',
          'rgba(170, 128, 252,0.4)',
          'rgba(255, 177, 101,0.4)',
        ],
        borderWidth: 2,
        borderColor: [
          'rgba(255, 134, 159, 1)',
          'rgba(98,  182, 239, 1)',
          'rgba(255, 218, 128, 1)',
          'rgba(113, 205, 205, 1)',
          'rgba(170, 128, 252, 1)',
          'rgba(255, 177, 101, 1)',
        ],
      },
    ],
  };

  }

  async function formatContent(){
    content.forEach((item, index) => {
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
  }

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
</script>

<Bar {data} options={{ responsive: true }} />