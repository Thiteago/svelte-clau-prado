<script>
	import { onMount } from "svelte";
  import { DateTime } from "luxon";
  import { signed, user } from '$lib/js/stores/login.js'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import quote from '$lib/assets/icons/quotes.svg'
  import left_quote from '$lib/assets/icons/left-quote.svg'
  import StarRatting from "@ernane/svelte-star-rating";

  let config = {
    readOnly: false,
    countStars: 5,
    range: {
      min: 0, 
      max: 5, 
      step: 0.001
    },
    score: 100,
    starConfig: {
      size: 20,
      fillColor: '#F9ED4F',
      strokeColor: "#BB8511",
      unfilledColor: '#FFFF',
      strokeUnfilledColor: '#000'
    }
  }

  let read_config = {
    readOnly: true,
    countStars: 5,
    range: {
      min: 0, 
      max: 5, 
      step: 0.001
    },
    score: 100,
    starConfig: {
      size: 20,
      fillColor: '#F9ED4F',
      strokeColor: "#BB8511",
      unfilledColor: '#FFFF',
      strokeUnfilledColor: '#000'
    }
  }

  export let produtoId
  let hasBuyed = false
  let hasPosted = false
  $: changeSliderInput = 0
  $: avaliacoes = []

  
  async function fetchAvaliacoes(){
    let response = await fetch(`${PUBLIC_BACKEND_URL}/avaliacoes/listar/${produtoId}`)
    let data = await response.json()
    //order data from date more recent to older
    data.sort((a, b) => {
      return new Date(b.data) - new Date(a.data);
    })

    data.map((item) => {
      item.data = DateTime.fromISO(item.data).toFormat('dd/MM/yyyy')
    })
    return data
  }

  async function handleCreateFeedback(e){
    e.preventDefault()
    let object = {
      id_usuario: $user.id, 
      descricao: e.target.avaliacao.value, 
      nota: config.score,
      titulo: e.target.titulo.value
    }

    await fetch(`${PUBLIC_BACKEND_URL}/avaliacoes/produto/cadastrar/${produtoId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    })
    avaliacoes = await fetchAvaliacoes()
    hasBuyed = await fetchHasBuyed()
    avaliacoes.map((item) => {
      if(item.userId == $user.id){
        hasPosted = true
      }
    })
  }

  async function fetchHasBuyed(){
    let response = await fetch(`${PUBLIC_BACKEND_URL}/avaliacoes/verificar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id_produto: produtoId, id_usuario: $user.id})
    })
    let data = await response.json()
    return data
  }

  onMount(async() => {
    avaliacoes = await fetchAvaliacoes()
    hasBuyed = await fetchHasBuyed()
    //check if avaliacoes has the user id
    avaliacoes.map((item) => {
      if(item.userId == $user.id){
        hasPosted = true
      }
    })
    console.log(avaliacoes)
  })
</script>

<section>
  {#if !$signed}
    <div class="flex items-center flex-col w-full">
      <h1>Para avaliar o produto, você precisa estar logado</h1>
      <a class="btn bg-[#632c52] w-4/12" href="/login?Venda={produtoId}">Clique aqui para logar</a>
    </div>
  {:else}
    {#if hasBuyed}
      {#if hasPosted}
        <div class="flex items-center flex-col w-full">
          <h1>Você já avaliou esse produto</h1>
        </div>
      {:else}
        <form on:submit={handleCreateFeedback} class="flex items-start flex-col w-full gap-2 rounded px-6">
          <input name="titulo" required id="titulo" class="input input-bordered w-full" type="text" placeholder="Título">
          <textarea name="avaliacao" class="w-full border-2 border-solid p-2 h-32" required placeholder="Escreva sua avaliação"/>
          <div class="flex w-full">
            <StarRatting bind:config on:change={changeSliderInput}/>
          </div>
          <div class="flex justify-end w-full">
            <button type="submit" class="btn bg-[#632c52] w-4/12">Enviar</button>
          </div>
        </form>
      {/if}
    {:else}
      <div class="flex items-center flex-col py-6 w-full">
        <h1>Compre o produto e Compartilhe sua experiência 😆</h1>
      </div>
    {/if}
  {/if}
  <div class="flex flex-col px-3 py-6 gap-3">
    {#each avaliacoes as item}
      <div class="w-full border-2 p-3 rounded-lg">
        <div class="flex justify-between">
          <h1 class="font-bold text-2xl flex">
            <span><img width=12 src={left_quote} alt=""></span>
              {item.titulo}
            <span><img width=12 src={quote} alt=""></span>
          </h1>
          <div>
            <StarRatting config={{...read_config, score: item.nota}}/>
          </div>
        </div>
        <p class="text-lg">{item.descricao}</p>
        <div class="flex justify-between mt-1">
          <p class="text-sm text-gray-500">
            Por {item.user.nome.split(' ')[0]} {item.user.nome.split(' ')[1] ? item.user.nome.split(' ')[1] : ''}
          </p>
          <p>Em {item.data} </p>
        </div>
      </div>
    {/each}
  </div>
</section>


