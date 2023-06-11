<script>
	import { onMount } from 'svelte';
  import cifrao from '$lib/assets/icons/cifrao.svg'
  import { calculateDiscount } from '$lib/js/helpers.js'
  import './produto.scss'
  export let data

  let promotionalValue
  $: formatedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.valor)


  onMount(async () => {
    promotionalValue = await calculateDiscount(data)
  })
</script>

<div class='wrapper-produtos'>
  <div class='icon-produto'>
    <img class="object-cover w-60 h-60" src={`http://localhost:3333/static/${data.imagens[0]}`} alt="" />
  </div>
  <div class='info-produto'>
      <div class="flex flex-col-reverse lg:flex-row justify-between pr-0 lg:pr-5">
        <div class='descricao-produto'>
          <a href="/venda?produto_id={data.id}" class="text-3xl font-bold hover:text-[#434343]">{data.nome}</a>
          <p>{data.descricao}</p>
        </div>
        {#if data.promocao != null && data.promocao.status != 'Inativo'}
          <div class="my-4 lg:m-0">
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
                  {#if data.tipo == 'Aluguel'}
                    <p>Aluguel</p>
                    {:else if data.tipo == 'Venda'}
                    <p>Venda</p>
                  {/if}
              </div>
          </div>

          <div class='buy-button'>
            <div class="flex flex-col justify-end items-center">
              {#if data.promocao != null && data.promocao.status != 'Inativo'}
                <div class="flex gap-1 mb-1 justify-center items-center">
                  {#if data.promocao.tipo == 'porcentual'}
                    <p class="p-1 bg-[#7C3267] text-white rounded">-{data.promocao.valor_desconto}%</p>
                  {:else}
                    <p class="p-1 bg-[#7C3267] text-white rounded">-R${data.promocao.valor_desconto}</p>
                  {/if}
                  <p class="text-md line-through font-bold">{formatedValue}</p>
                </div>
                
                <p class="text-2xl font-bold">
                  {promotionalValue}
                  {#if data.tipo == 'Aluguel'}
                    <span class="text-sm">/por dia</span>
                  {/if}
                </p>
              {/if}

              {#if data.promocao == null || data.promocao.status == 'Inativo'}
                <p class="text-2xl font-bold">
                  {formatedValue}
                  {#if data.tipo == 'Aluguel'}
                    <span class="text-sm">/por dia</span>
                  {/if}
                </p>
              {/if}
            </div>
            <a href="/venda?produto_id={data.id}">
              <button class="botao">{data.tipo == 'Aluguel' ? 'Alugar' : 'Comprar'}</button>
            </a>
          </div>
      </div>
  </div>
</div>