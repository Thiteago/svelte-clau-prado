<script>
	import { onMount } from 'svelte';
  import cifrao from '$lib/assets/icons/cifrao.svg'
  import { calculateDiscount } from '$lib/js/helpers.js'
  import './produto.scss'
  export let data

  let promotionalValue
  let formatedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.valor)


  onMount(async () => {
    promotionalValue = await calculateDiscount(data)
  })
</script>

<div class='wrapper-produtos'>
  <div class='icon-produto'>
    <img class="object-cover w-60 h-60" src={`http://localhost:3333/static/${data.caminhos[0]}`} alt="" />
  </div>
  <div class='info-produto'>
      <div class="flex justify-between pr-5">
        <div class='descricao-produto'>
          <h1 class="text-3xl font-bold">{data.nome}</h1>
          <p>{data.descricao}</p>
        </div>
        {#if data.promocao != null}
          <div >
            <span class="bg-[#7C3267] rounded p-2 text-white">Item em Promoçao</span>
          </div>
        {/if}
      </div>
      
      <div class="wrapper-additional-info">
          <div class='container-situation'>
              <div class='icon-situation'>
                  <img src={cifrao} alt="#" />
              </div>
              <div class='situation'>
                  {#if data.Aluguel != null}
                    <p>Aluguel</p>
                    {:else if data.Venda != null}
                    <p>Venda</p>
                  {/if}
              </div>
          </div>
          <div class='buy-button'>
            <div class="flex flex-col justify-end items-end">
              {#if data.promocao != null && data.promocao.status != 'Inativo'}
                <p class="text-md line-through font-bold">{formatedValue}</p>

                <p class="text-2xl font-bold">
                  {promotionalValue}
                  {#if data.Aluguel != null}
                    <span class="text-sm">/por dia</span>
                  {/if}
                </p>
              {/if}

              {#if data.promocao == null || data.promocao.status == 'Inativo'}
                <p class="text-2xl font-bold">
                  {formatedValue}
                  {#if data.Aluguel != null}
                    <span class="text-sm">/por dia</span>
                  {/if}
                </p>
              {/if}
            </div>
            <a href="/venda?produto_id={data.id}">
              <button class="botao">{data.Aluguel != null ? 'Alugar' : 'Comprar'}</button>
            </a>
          </div>
      </div>
  </div>
</div>