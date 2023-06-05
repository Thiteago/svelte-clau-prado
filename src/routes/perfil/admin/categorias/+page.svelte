<script>

  $: isUpdating = false
  $: isCreating = false

</script>

<h2 class="text-3xl mb-3">Categorias</h2>
<section class="w-full flex justify-between">
  <div class="w-9/12">
    <div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="#" on:click={() => {isCreating = true}}>Cadastrar</a>
    </div>
    <div class="w-full mt-3">
      <div class="w-full p-3 border-2">

      </div>
    </div>
  </div>
  <aside class="w-3/12 flex flex-col items-center px-2 ">
    {#if isUpdating || isCreating}
      {#if isUpdating}
        <div class="w-full flex justify-between items-center">
          <h3 class="font-bold">Alterar Categoria</h3>
          <button on:click={() => {isUpdating = false}}>Cancelar</button>
        </div>
        <div class="w-full mt-3">
          <div class="w-full p-3 border-2">

          </div>
        </div>
      {:else}
        <div class="w-full flex justify-between items-center">
          <h3 class="font-bold">Cadastrar Categoria</h3>
          <button on:click={() => {isCreating = false}}>Cancelar</button>
        </div>
        <div class="w-full mt-3 text-center rounded-lg">
          <form>
            <label for="nome">Nome da Categoria</label>
            <input type="text" id="nome" name="nome" class="input">
          </form>
        </div>
      {/if}
    {/if}
  </aside>
</section>