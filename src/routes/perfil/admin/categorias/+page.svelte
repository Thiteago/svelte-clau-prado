<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte';
  import { onMount } from 'svelte';

  $: isUpdating = false
  $: isCreating = false
  $: flashMessage = {
    message: '',
    type: '',
    time: 0,
    visible: false
  }
  $: categorias = []
  $: selectedCategoria = {}
  let nome

  onMount(async () => {
    categorias = await fetchCategorias()
  })

  function selectCategoria(id){
    selectedCategoria = categorias.find(categoria => categoria.id == id)
    isUpdating = true
    isCreating = false
  }

  async function fetchCategorias(){
    let response = await fetch(`${PUBLIC_BACKEND_URL}/categoria/listar`)
    let data = await response.json()
    return data
  }

  async function handleSubmit(){
    let response
    if(isCreating){
      response = await fetch(`${PUBLIC_BACKEND_URL}/categoria/cadastrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome})
      })
      if(response.ok){
        flashMessage.message = 'Categoria cadastrada com sucesso'
        flashMessage.type = 'success'
        flashMessage.time = 3000
        flashMessage.visible = true
        nome = ''
        categorias = await fetchCategorias()
      }else{
        flashMessage.message = 'Erro ao cadastrar categoria'
        flashMessage.type = 'error'
        flashMessage.time = 3000
        flashMessage.visible = true
      }
    }
    if(isUpdating){
      response = await fetch(`${PUBLIC_BACKEND_URL}/categoria/alterar/${selectedCategoria.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome: selectedCategoria.nome})
      })

      if(response.ok){
        flashMessage.message = 'Categoria alterada com sucesso'
        flashMessage.type = 'success'
        flashMessage.time = 3000
        flashMessage.visible = true
        nome = ''
        categorias = await fetchCategorias()
      }else{
        flashMessage.message = 'Erro ao alterar categoria'
        flashMessage.type = 'error'
        flashMessage.time = 3000
        flashMessage.visible = true
      }
    }
  }

</script>

<h2 class="text-3xl mb-3">Categorias</h2>
<section class="w-full flex justify-between">
  <div class="w-9/12">
    <div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="#" class="btn btn-primary btn-sm" on:click={() => {isCreating = true, isUpdating = false}}>Cadastrar</a>
    </div>
    <div class="w-full mt-3">
      {#each categorias as categoria}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={selectCategoria(categoria.id)} class="w-7/12 p-3 border-b-[1px] hover:bg-[#efefef] cursor-pointer">
          {categoria.nome}
        </div>
      {/each}
    </div>
  </div>
  <aside class="w-3/12 flex flex-col items-center px-4 {isUpdating || isCreating ? 'border-l-[1px]' : ''}">
    <FlashMessage message={flashMessage.message} type={flashMessage.type} time={flashMessage.time} visible={flashMessage.visible} />
    {#if isUpdating || isCreating}
      {#if isUpdating}
        <div class="w-full flex justify-between items-center">
          <h3 class="font-bold">Alterar Categoria</h3>
          <button on:click={() => {isUpdating = false, isCreating = false}}>Cancelar</button>
        </div>
        <div class="w-full mt-3 text-center rounded-lg">
          <form on:submit={handleSubmit} class="flex flex-col gap-2">
            <label for="nome">Nome da Categoria</label>
            <input bind:value={selectedCategoria.nome} type="text" id="nome" name="nome" class="input input-bordered">
            <button class="btn btn-primary">Alterar</button>
          </form>
        </div>
      {:else}
        <div class="w-full flex justify-between items-center">
          <h3 class="font-bold">Cadastrar Categoria</h3>
          <button on:click={() => {isCreating = false}}>Cancelar</button>
        </div>
        <div class="w-full mt-3 text-center rounded-lg">
          <form on:submit={handleSubmit} class="flex flex-col gap-2">
            <label for="nome">Nome da Categoria</label>
            <input bind:value={nome} type="text" id="nome" name="nome" class="input input-bordered">
            <button class="btn btn-primary">Cadastrar</button>
          </form>
        </div>
      {/if}
    {/if}
  </aside>
</section>