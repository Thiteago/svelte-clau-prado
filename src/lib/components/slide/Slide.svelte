<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import edit from '$lib/assets/icons/edit.svg'
  import './style.scss'
  import nuvem from '$lib/assets/img/nuvem-fundo.png'
  import ModalEditSlide from '$lib/components/modalEditSlide/ModalEditSlide.svelte';
  import {user} from "$lib/js/stores/login.js"
	import { onMount } from 'svelte';

$: current = 0
$: SlideData = []
$: length = SlideData.length


function nextSlide() {
  if(current == length-1){
    current = 0
  }else if(current < length-1){
    current += 1
  }
}

async function fetchSlides(){
  const response = await fetch(`${PUBLIC_BACKEND_URL}/slide/listar`)
  const data = await response.json()
  return data
}

onMount(async () => {
  SlideData = await fetchSlides()
  setInterval(nextSlide, 3000)
})


</script>



<section class="main-slide relative justify-center flex">

  {#if $user.cargo == 'Admin'}
    <label style="z-index: 300 " for="modal-edit" class="absolute cursor-pointer right-0 p-2 text-white gap-2 bg-black flex items-center">
      <img src={edit} class="w-6 h-6" alt="pencil edit icon">
      Editar Slide
    </label>

    <ModalEditSlide  on:changedSlide={async () => {SlideData = await fetchSlides()}}/>
  {/if}

  {#if SlideData.length > 0}
    <div class="wrapper-slide">
      <div class="legenda">
        {#each SlideData as slide, i}
          <div class={i === current ? 'slide active' : 'slide'}>
            {#if i === current}
              <h1> {slide.titulo} </h1>
            {/if}
          </div>
        {/each}
        {#each SlideData as slide, i}
          <div class={i === current ? 'slide active' : 'slide'}>
            {#if i === current}
            <p> {slide.descricao} </p>
          {/if}
          </div>
        {/each}
        <div class="clouds">
          <img class="max-w-none" src={nuvem} alt="nuvem esquerda"/>
          <img class="max-w-none" src={nuvem} alt="nuvem direita"/>
        </div>
      </div>
      <img class="wrapper-slide -fundo" src={nuvem} alt=""/>
      {#each SlideData as slide, i}
        <div class={i === current ? 'slide active' : 'slide'}>
          {#if i === current}
            <img class="wrapper-slide -mascara " id="teste" src={`${PUBLIC_BACKEND_URL}/static/slide/${slide.imagem}`} alt="produto imagem"/>
          {/if}
        </div>
      {/each}
    </div>
  
  {:else}
    <div class="absolute top-1/2 m-auto">
      <h1> Não há slides cadastrados 😢 </h1>
    </div>
  {/if}
  

  <div class="nuvens">
      <div class="Cloud"></div>
  </div>

  
</section>
