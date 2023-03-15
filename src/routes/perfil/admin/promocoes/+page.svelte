<script>
	import ModalPromocao from "$lib/components/modalPromocao/modalPromocao.svelte";
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { fetchPromotions, fetchProducts } from '$lib/js/helpers.js'
  import { imask } from '@imask/svelte'
	import { onMount } from "svelte";
  
  let promocao = []
  let today = new Date().toISOString().split('T')[0]

  const optionsValorPorcentual = {
    mask: 'num %',
    lazy: false,
    blocks: {
      num: {
        mask: Number,
      }
    }
  }
  const optionsValorValor = {
    mask: 'R$ num',
    lazy: false,
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.'
      }
    }
  }

  let nome = ''
  let data_inicio = ''
  let data_fim = ''
  let tipo = ''
  let categorias = []
  let valor_desconto = ''
  let categoriasSelecionadas = []
  let produtosSelecionados = []
  let promocaoSelecionada = {}
  let produtos = []

  async function loadPromotions(){
    promocao = await fetchPromotions();
  }

  onMount(async () => {
    loadPromotions()
    produtos = await fetchProducts();
    if(produtos.length > 0) {
      produtos.forEach((item) => {
        if(!categorias.includes(item.categoria)){
          categorias = [...categorias, item.categoria]
        }
      })
    }
  });

  async function handleSubmit(){
    await fetch(`${PUBLIC_BACKEND_URL}/promocao/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        valor_desconto,
        data_inicio,
        data_fim,
        tipo,
        categorias: categoriasSelecionadas,
        produtos: produtosSelecionados
      })
    })

    promocao = await fetchPromotions();
  }
</script>
<section class="p-6">
  <h1 class="text-2xl font-bold">Promoções</h1>

  <div class="collapse border border-base-300 bg-base-100 rounded-box mt-2">
    <input type="checkbox" /> 
    <div class="collapse-title text-xl font-medium">
      Ver Promoções
    </div>
    <div class="collapse-content flex flex-wrap items-center gap-5"> 
      {#if promocao.length > 0}
        {#each promocao as item}
          <div class="flex justify-center items-center">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label for="my-modal-{item.id}" on:click={() => {promocaoSelecionada = item}} class="border w-full flex flex-nowrap justify-center items-center h-12 font-bold cursor-pointer px-3 rounded">
              <h2>{item.nome}</h2>
            </label>
            <div class="{item.status == 'Ativo' ? 'bg-green-500' : 'bg-red-500'} px-5 h-12 flex items-center rounded">
              {item.status}
            </div>
          </div>
        {/each}
      {:else}
        <p>Nenhuma promoção cadastrada</p>
      {/if}
    </div>
  </div>

  <div class="collapse border border-base-300 bg-base-100 rounded-box mt-2">
    <input type="checkbox" checked/> 
    <div class="collapse-title text-xl font-medium">
      Criar Promoção
    </div>
    <div class="collapse-content"> 
      <form on:submit={handleSubmit} action="">
        <div class="form-control w-full">
          <label for="nome" class="label">
            <span class="label-text">Nome</span>
          </label>
          <input bind:value={nome} name="nome" type="text" placeholder="Nome da promoção" class="input input-bordered w-full" />

          <label for="data_inicio" class="label">
            <span class="label-text">Data de Início</span>
          </label>
          <input bind:value={data_inicio} min={today} name="data_inicio" type="date" class="input input-bordered w-full" />

          <label for="data_fim" class="label">
            <span class="label-text">Data de Término</span>
          </label>
          <input bind:value={data_fim} name="data_fim" type="date" min={data_inicio} class="input input-bordered w-full" />

          <label for="tipo" class="label">
            <span class="label-text">Tipo de Desconto</span>
          </label>
          <select bind:value={tipo} class="select select-bordered" name="tipo">
            <option value="porcentual">Porcentual</option>
            <option value="valor_fixo">Valor Fixo</option>
          </select>

          {#if tipo == 'porcentual'}
            <label for="valor" class="label">
              <span class="label-text">Porcentagem do desconto</span>
            </label>
            <input bind:value={valor_desconto} name="valor" use:imask={optionsValorPorcentual} type="text" 
              min="1" max="100" placeholder="Porcentagem do desconto" 
              class="input input-bordered w-full" 
            />
          {:else if tipo == 'valor_fixo'}
            <label for="valor" class="label">
              <span class="label-text">Valor do desconto</span>
            </label>
            <input bind:value={valor_desconto} name="valor" type="text" min="1" max="100" 
              use:imask={optionsValorValor}
              placeholder="Valor do desconto" 
              class="input input-bordered w-full" 
            />
          {/if}
        </div>
        <div class="flex flex-col items-center mt-5">
          <div>
            <span class="font-bold text-lg">Vincular Produtos à Promoção</span>
          </div>
          <div class="mt-5">
            <p>Por Categoria</p>
          </div>
          <div class="w-full">
            <select bind:value={categoriasSelecionadas} class="w-full px-1 select select-bordered select-md cursor-auto" name="categorias" multiple>
             {#each categorias as item}
                <option value="{item}">{item}</option>
              {/each}
            </select>
          </div>
          <div>
            <p>Por Produto</p>
          </div>
          <div class="w-full">
            <select bind:value={produtosSelecionados} class="w-full px-1 select select-bordered select-md cursor-auto" name="produtos" multiple>
              {#each produtos as item}
                <option value="{item.id}">{item.nome}</option>
              {/each}
            </select>
          </div>
        </div>
        <button type="submit" class="btn w-full mt-4">Cadastrar</button>
      </form>
    </div>
  </div>

</section>


{#if Object.keys(promocaoSelecionada).length > 0}
  <ModalPromocao on:disable={loadPromotions} promocao={promocaoSelecionada} />
{/if}
