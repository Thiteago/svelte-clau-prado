<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import pencil from "$lib/assets/icons/pencil.svg"
  import plus from "$lib/assets/icons/plus.svg"
  import { fly } from 'svelte/transition';
	import FlashMessage from '../flashMessage/FlashMessage.svelte';
	import { onMount } from 'svelte';
  
  let slides = []
  let titulo = ''
  let descricao = ''
  let link = ''
  let error = {
    titulo: '',
    descricao: '',
    link: '',
    imagens: ''
  }
  $: flashMessage = {
    message: '',
    type: '',
    time: 0,
    visible: false
  }
  let files = []

  $: open = false

  onMount(async () => {
    slides = await fetchSlides()
  })

  function validateData(){
    let errorHasOccurred = false
    if(titulo == ''){
      error.titulo = 'Titulo é obrigatório'
      errorHasOccurred = true
    }else{
      error.titulo = ''
      errorHasOccurred = false
    }

    if(descricao == ''){
      error.descricao = 'Descrição é obrigatório'
      errorHasOccurred = true
    }else{
      error.descricao = ''
      errorHasOccurred = false
    }

    if(link == ''){
      error.link = 'Link é obrigatório'
      errorHasOccurred = true
    }else{
      error.link = ''
      errorHasOccurred = false
    }

    if(files.length == 0){
      error.imagens = 'Imagem é obrigatório'
      errorHasOccurred = true
    }else{
      error.imagens = ''
      errorHasOccurred = false
    }

    return errorHasOccurred
  }

  async function handleSubmit(event){
    event.preventDefault()
    if(!validateData()){
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('descricao', descricao)
      formData.append('link', link)
      formData.append('imagens', files[0])

      const res = await fetch(`${PUBLIC_BACKEND_URL}/slide/adicionar`, {
        method: 'POST',
        body: formData
      })

      if(res.ok){
        flashMessage.message = 'Slide adicionado com sucesso'
        flashMessage.type = 'success'
        flashMessage.time = 3000
        flashMessage.visible = true
      }else{
        flashMessage.message = 'Erro ao adicionar slide'
        flashMessage.type = 'error'
        flashMessage.time = 3000
        flashMessage.visible = true
      }
    }
  }

  async function fetchSlides(){
    const res = await fetch(`${PUBLIC_BACKEND_URL}/slide/listar`)
    const data = await res.json()
    console.log(data)

    return data
  }

</script>

<input type="checkbox" id="modal-edit" class="modal-toggle" />
<div class="modal">
  <div class="flex h-fit justify-center items-start w-full">
    <div class="modal-box {open ? "rounded-r-[0px]" : ''} relative">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <label for="modal-edit" on:click={() => {open = !open}} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <h3 class="text-lg font-bold">Editar Slides</h3>
      <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="flex w-full items-center cursor-pointer gap-5">
          <div on:click={() => {open = !open}} class="flex items-center">
            <img src={pencil} class="w-8 h-8 p-1 hover:bg-gray-200 rounded-lg" alt="">
            Alterar
          </div>
          <div on:click={() => {open = !open}} class="flex items-center cursor-pointer">
            <img src={plus} class="w-8 h-8 p-1 hover:bg-gray-200 rounded-lg" alt="">
            Cadastrar
          </div>
        </div>
        <div>
          {#each slides as slide}
            <div>
              <img src="{PUBLIC_BACKEND_URL}/static/slide/{slide.imagem}" alt="">
            </div>
          {/each}
        </div>
      </div>
    </div>
    {#if open}
      <div transition:fly="{{x: -200, duration: 1000}}" class="bg-white w-4/12 rounded-r-md flex flex-col items-center">
        <FlashMessage message={flashMessage.message} type={flashMessage.type} time={flashMessage.time} visible={flashMessage.visible} />
        <form on:submit={handleSubmit} class="flex flex-col py-4 items-center gap-5 w-full">
          <input type="text" bind:value={titulo} placeholder="Titulo" class="w-11/12 p-2 border border-gray-300 rounded-md" />
          {#if error.titulo != ''}
            <p class="text-red-500 text-sm">{error.titulo}</p>
          {/if}
          <input type="text" placeholder="Descrição" bind:value={descricao} class="w-11/12 p-2 border border-gray-300 rounded-md" />
          {#if error.descricao != ''}
            <p class="text-red-500 text-sm">{error.descricao}</p>
          {/if}
          <input type="text" placeholder="Link" bind:value={link} class="w-11/12 p-2 border border-gray-300 rounded-md" />
          {#if error.link != ''}
            <p class="text-red-500 text-sm">{error.link}</p>
          {/if}
          <input type="file" bind:files accept="image/png, image/jpeg" name='imagens' class="w-11/12 p-2 border border-gray-300 rounded-md" />
          {#if error.imagens != ''}
            <p class="text-red-500 text-sm">{error.imagens}</p>
          {/if}
          <button type="submit" class="w-11/12 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Enviar</button>
      </div>
    {/if}
  </div>
</div>
