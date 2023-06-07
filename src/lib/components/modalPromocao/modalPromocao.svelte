<script>
  import { fetchDisable, formatDate } from "$lib/js/helpers.js";
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { imask } from '@imask/svelte'
  import { DateTime } from 'luxon'
  import { fetchProducts, fetchCategorias, fetchPromoById} from '$lib/js/helpers.js'
  import { createEventDispatcher, onMount } from 'svelte';
  import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte'
  export let promocao

  $: flashMessage = {
    message: '',
    type: '',
    time: 0,
    visible: false
  }

  let isUpdating = false
  let produtos = []
  let categorias = []
  let promocao_data = {...promocao}

  promocao_data.data_inicio = DateTime.fromISO(promocao_data.data_inicio).toFormat('yyyy-MM-dd')
  promocao_data.data_fim = DateTime.fromISO(promocao_data.data_fim).toFormat('yyyy-MM-dd')

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

  onMount(async() => {
    produtos = await fetchProducts();
    categorias = await fetchCategorias();
  })

  const dispatch = createEventDispatcher();
  let today = new Date();
  $: data_inicio = formatDate(promocao.data_inicio)
  $: data_fim = formatDate(promocao.data_fim)
  $: left = new Date(promocao.data_fim).getDate() - today.getDate()
  $: started = new Date(promocao.data_inicio).getDate() - today.getDate() 
  

  async function handleDisable(){
    const response = await fetchDisable(promocao.id)
    if(response){
      promocao.status = "Inativo"
    }
    dispatch('disable', {});
  }

  async function handleDelete(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/excluir/${promocao.id}`, {
      method: 'DELETE',
    })
    if(response){
      dispatch('disable', {});
    }
  }

  async function handleSubmit(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/promocao/alterar/${promocao.id}`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(promocao_data)
    })

    if(response.ok){
      flashMessage.message = 'Promoção Alterada com sucesso!'
      flashMessage.type = 'success'
      flashMessage.time = 3000
      flashMessage.visible = true
      promocao = await fetchPromoById(promocao.id)
      dispatch('changed', '')
    }else{
      flashMessage.message = 'Promoção não foi alterada!'
      flashMessage.type = 'danger'
      flashMessage.time = 3000
      flashMessage.visible = true
    }
  }


</script>
  <input type="checkbox" id="my-modal-{promocao.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label for="my-modal-{promocao.id}" class="modal">
    <label class="modal-box relative max-w-4xl" for="">
      <div class="flex justify-between">
        <h3 class="text-lg font-bold flex items-center">Promocao {promocao.nome}</h3>
        <span class="rounded p-3 {promocao.status == 'Ativo' ? 'bg-green-500' : promocao.status == 'Agendado' ? 'bg-orange-500' : 'bg-red-500'}">{promocao.status}</span>
      </div>
      
      <FlashMessage message={flashMessage.message} type={flashMessage.type} visible={flashMessage.visible} time={flashMessage.time}/>
      <form on:submit={handleSubmit} class="mt-8 flex flex-col gap-5">
        <div>
          {#if started > 0}
            <h1 class="font-bold">Status</h1>
            <p>Inativo</p>
          {:else if left > 0}
            <h1 class="font-bold">Status</h1>
            <p>Em andamento</p>
          {:else}
            <h1 class="font-bold">Status</h1>
            <p>Encerrada</p>
          {/if}
        </div>

        <div>
          <h1 class="font-bold">Data de vigência</h1>
          {#if isUpdating}
            <div class="flex items-center gap-2">
              <input bind:value={promocao_data.data_inicio} type="date" class="input input-bordered">
              <span> até </span> 
              <input bind:value={promocao_data.data_fim} type="date" class="input input-bordered">
            </div>
          {:else}
            {#if left > 0}
              <p>{data_inicio} até {data_fim} - Faltam {left} dias para o término da promoção</p>
            {:else}
              <p>{data_inicio} até {data_fim} - Promoção encerrada</p>
            {/if}
          {/if}
        </div>

        <div>
          <h1 class="font-bold">Desconto</h1>
          {#if isUpdating}
            <select bind:value={promocao_data.tipo} class="select select-bordered">
              <option value="valor_fixo">Valor Fixo</option>
              <option value="porcentual">Porcentual</option>
            </select>
            {#if promocao_data.tipo == 'porcentual'}
              <label for="valor_porcentagem" class="label">
                <span class="label-text">Porcentagem do desconto</span>
              </label>
              <input bind:value={promocao_data.valor_desconto} name="valor_porcentagem" use:imask={optionsValorPorcentual} type="text" 
                min="1" max="100" placeholder="Porcentagem do desconto" 
                class="input input-bordered w-full" 
              />
            {:else if promocao_data.tipo == 'valor_fixo'}
              <label for="valor_fixo" class="label">
                <span class="label-text">Valor do desconto</span>
              </label>
              <input bind:value={promocao_data.valor_desconto} name="valor_fixo" type="text" min="1" max="100" 
                use:imask={optionsValorValor}
                placeholder="Valor do desconto" 
                class="input input-bordered w-full" 
              />
            {/if}
          {:else}
            <p>Tipo de Desconto: <i>{promocao.tipo == 'valor_fixo' ? 'Valor Fixo' : 'Porcentual'}</i></p>
            <p>Valor do Desconto: {promocao.tipo == "porcentual" ? `${promocao.valor_desconto}%` : `R$ ${promocao.valor_desconto}`}</p>
          {/if}
        </div>

        <div>
          {#if promocao.categorias.length > 0}
            <p class="font-bold">Categorias Selecionadas</p>
            {#if isUpdating}
              <select bind:value={promocao_data.categorias} class="w-full px-1 select select-bordered select-md cursor-auto" name="categorias" multiple>
                {#each categorias as item}
                  <option value="{item.id}">{item.nome}</option>
                {/each}
              </select>
            {:else}
              <ul class="list-disc list-inside">
                {#each promocao.categorias as categoria}
                  <li>{categoria.nome}</li>
                {/each}
              </ul>
            {/if}
          {/if}
          <p class="font-bold pt-2">Produtos incluídos na promoção</p>
          {#if isUpdating}
            <select bind:value={promocao_data.produtos} class="w-full px-1 select select-bordered select-md cursor-auto" name="produtos" multiple>
              {#each produtos as item}
                <option value="{item.id}">{item.nome}</option>
              {/each}
            </select>
          {:else}
            {#if promocao.produtos.length == 0}
              <p>Nenhum produto cadastrado na promoção</p>
            {/if}
            <ul class="list-disc list-inside">
              {#each promocao.produtos as produto}
                <li>{produto.nome}</li>
              {/each}
            </ul> 
          {/if}
        </div>
        <div class="flex gap-3 justify-between">
          <div>
            {#if isUpdating}
              <button type="submit" class="btn btn-success">Salvar</button>
            {/if}
          </div>
          <div>
            <button type='button' class="btn btn-{isUpdating ? '' : 'primary'}" on:click={() => {isUpdating = !isUpdating}}>{isUpdating ? 'Cancelar' : 'Alterar'}</button>
            <button class="btn btn-error" on:click={handleDelete}>Excluir promocao</button>
            <button disabled={promocao.status == 'Inativo'} class="btn btn-warning" on:click={handleDisable}>Desativar promocao</button>
          </div>
        </div>
      </form>
    </label>
  </label>