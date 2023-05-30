<script>
  import pencil from "$lib/assets/icons/pencil.svg"
  import plus from "$lib/assets/icons/plus.svg"
  import { fly } from 'svelte/transition';

  let titulo = ''
  let descricao = ''
  let link = ''
  let error = {}
  let files = []

  $: open = false



</script>

<input type="checkbox" id="modal-edit" class="modal-toggle" />
<div class="modal">
  <div class="flex h-fit justify-center items-start w-full">
    <div class="modal-box {open ? "rounded-r-[0px]" : ''} relative">
      <label for="modal-edit" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <h3 class="text-lg font-bold">Editar Slides</h3>
      <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="flex w-full items-center gap-5">
          <img src={pencil} on:click={() => {open = !open}} class="w-8 h-8 p-1 cursor-pointer hover:bg-gray-200 rounded-lg" alt="">
          <img src={plus} on:click={() => {open = !open}} class="w-8 h-8 p-1 cursor-pointer hover:bg-gray-200 rounded-lg" alt="">
        </div>
      </div>
    </div>
    {#if open}
      <div transition:fly="{{x: -200, duration: 1000}}" class="bg-white w-4/12 rounded-r-md flex flex-col items-center">
        <!-- create form to create new slide, with titulo, descricao, link and input file -->
        <form class="flex flex-col py-4 items-center gap-5 w-full">
          <input type="text" bind:value={titulo} placeholder="Titulo" class="w-11/12 p-2 border border-gray-300 rounded-md" />
          {#if error.titulo}
            <p class="text-red-500 text-sm">{error.titulo}</p>
          {/if}
          <input type="text" placeholder="Descrição" bind:value={descricao} class="w-11/12 p-2 border border-gray-300 rounded-md" />
          <input type="text" placeholder="Link" bind:value={link} class="w-11/12 p-2 border border-gray-300 rounded-md" />
          <input type="file" bind:files accept="image/png, image/jpeg" name='imagens' class="w-11/12 p-2 border border-gray-300 rounded-md" />
          <button type="submit" class="w-11/12 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Enviar</button>
      </div>
    {/if}
  </div>
</div>
