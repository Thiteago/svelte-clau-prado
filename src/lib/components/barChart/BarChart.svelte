<script>
  import { Bar } from 'svelte-chartjs';

  export let content
  export let labels
  export let info
  let data

  $: if(content){
    content = content
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Qtde de vendas',
          data: info,
          backgroundColor: [
            'rgba(255, 134,159,0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(255, 134, 159, 1)',
          ],
        },
      ],
    };
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