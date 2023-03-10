<script>
	import { onMount } from 'svelte';
  import cifrao from '$lib/assets/icons/cifrao.svg'
  import './style.scss'
  export let id, title, description, type, buttonType, valor

  $: images = ''
  valor = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})

  async function getImages(){
    const response = await fetch(`http://localhost:3333/Produto/ImagePath/${id}`)
    const data = await response.json()
    images = data.caminhos[0]
  }

  onMount(() => {
    getImages()
  })
</script>

<div class='wrapper-produtos'>
  <div class='icon-produto'>
      {#if images != undefined && images != ''}
        <img class="object-cover w-60 h-60" src={`http://localhost:3333/static/${images}`} alt="" />
      {/if}
  </div>
  <div class='info-produto'>
      <div class='descricao-produto'>
          <h1 class="text-3xl font-bold">{title}</h1>
          <p>{description}</p>
      </div>
      
      <div class="wrapper-additional-info">
          <div class='container-situation'>
              <div class='icon-situation'>
                  <img src={cifrao} alt="#" />
              </div>
              <div class='situation'>
                  <p>{type}</p>
              </div>
          </div>
          <div class='buy-button'>
            <div class="flex justify-end items-end">
              <p class="text-2xl font-bold">{Number.isInteger(valor) ? `${valor},00` : valor}</p>
              {#if buttonType == 'Aluguel'}
                <p class="text-md font-bold">/por dia</p>
              {/if}
            </div>
            <a href="/venda?produto_id={id}">
              <button class="botao">{buttonType == 'Venda' ? 'Comprar' : 'Alugar'}</button>
            </a>
          </div>
      </div>
  </div>
</div>