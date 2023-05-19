<script>
  import { Doughnut} from 'svelte-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement } from 'chart.js';
  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement);

  export let produto
  let produtoInfo = []
  produtoInfo.push(produto.statisticProduct.qtdeVendida)
  produtoInfo.push(produto.statisticProduct.qtdeAlugada)
  produtoInfo.push(produto.statisticProduct.qtdeVisualizada)
  
  let data = {
    labels: ["Quantidade Vendida", "Quantidade Alugada", "Quantidade Visualizada"],
    datasets: [
      {
        data: produtoInfo,
        backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
        hoverBackgroundColor: [
          "#FF5A5E",
          "#5AD3D1",
          "#FFC870",
        ]
      }
    ]
  };


  let options = {
    responsive: true
  }
</script>

<div class="flex gap-6 w-2/4 bg-gray-100 rounded-xl">
  <div class="w-3/12 flex items-center">
    {#if produto.statisticProduct.qtdeVendida > 0 || produto.statisticProduct.qtdeAlugada > 0 || produto.statisticProduct.qtdeVisualizada > 0}
      <Doughnut {data} {options}/>
    {:else}
      <p class="text-center">Nenhum evento para este item</p>
    {/if}
  </div>
  <div class="flex flex-col justify-between py-2 w-6/12">
    <h1 class="text-xl font-bold">{produto.nome}</h1>
    <div class="flex gap-3">
      <div class="flex flex-col">
        <p class="flex gap-1">💸 Quantidade Vendida </p>
        <p class="flex gap-1">🏠 Quantidade Alugado </p>
        <p class="flex gap-1">👀 Quantidade Visualizada </p>
      </div>
      <div class="flex items-center flex-col">
        <p class="flex gap-1">{produto.statisticProduct.qtdeVendida}</p>
        <p class="flex gap-1">{produto.statisticProduct.qtdeAlugada}</p>
        <p class="flex gap-1">{produto.statisticProduct.qtdeVisualizada}</p>
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center gap-5 py-3 pr-3 w-3/12">
    {#if produto.imagens.length > 0}
      <div class="flex justify-center">
        <img width="70" src="http://localhost:3333/static/{produto.imagens[0]}" alt="">
      </div>
    {/if}

    <div class="flex justify-center flex-col items-center">
      <p class="font-bold">Lucro total:</p>
      <p class="text-3xl">R$ {produto.statisticProduct.totalLucro}</p>
    </div>
  </div>
</div>