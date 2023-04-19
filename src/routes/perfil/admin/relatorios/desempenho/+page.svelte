<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';
	import ProductPerformanceCard from '$lib/components/productPerformanceCard/ProductPerformanceCard.svelte';

  let produtos = []

  onMount(async () => {
    const response = await fetch(`${PUBLIC_BACKEND_URL}/relatorio/desempenho`);
    produtos = await response.json();
  });

</script>

<section class="flex justify-center w-full mt-4">
  {#if produtos.length > 0}
    {#each produtos as produto }
      <ProductPerformanceCard {produto} />
    {/each}
  {:else}
    <div class="flex justify-center w-full">
      <h1 class="text-2xl font-bold">Nenhum produto encontrado</h1>
    </div>
  {/if}
</section>