<script>
  export let busca
</script>


<section class="w-full flex ">
  <div class="w-full justify-end flex">
      <input class="w-3/4 rounded-lg p-2 sm:w-2/4" bind:value={busca} type="text" placeholder="Digite aqui o que deseja buscar" />
      <button class="w-1/4 bg-[#7C3267] text-white rounded">Buscar</button>
  </div>
</section>