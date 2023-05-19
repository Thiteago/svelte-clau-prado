<script>
  import { Bar } from 'svelte-chartjs';

  export let content
  export let labels
  export let info
  let data
  let options

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
    },
    options = {
      responsive: true,
    }
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

</script>

<Bar id="barChart" width="600" {data} {options} />