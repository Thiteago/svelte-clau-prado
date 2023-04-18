<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';

  let produtos = []

  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/desempenho`);
    produtos = await response.json();
    console.log(produtos)
  });

</script>

<section class="flex justify-center w-full">
  {#if produtos.length > 0}
    <table class="table table-striped w-full mt-5">
      <thead>
        <tr>
          <th scope="col">Produto</th>
          <th scope="col">Quantidade vendida</th>
          <th scope="col">Quantidade alugada</th>
          <th scope="col">Quantidade visualizada</th>
          <th scope="col">Valor total</th>
        </tr>
      </thead>
      <tbody>
        {#each produtos as produto}
          <tr>
            <td>{produto.nome}</td>
            <td>{produto.statisticProduct.qtdeVendida}</td>
            <td>{produto.statisticProduct.qtdeAlugada}</td>
            <td>{produto.statisticProduct.qtdeVisualizada}</td>
            <td>{produto.statisticProduct.totalLucro}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>