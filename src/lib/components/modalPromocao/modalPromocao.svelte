<script>
  import { fetchDisable, formatDate } from "$lib/js/helpers.js";
  import { createEventDispatcher } from 'svelte';
  export let promocao

  const dispatch = createEventDispatcher();
  let today = new Date();
  let data_inicio = formatDate(promocao.data_inicio)
  let data_fim = formatDate(promocao.data_fim)
  let left = new Date(promocao.data_fim).getDate() - today.getDate()
  let started = new Date(promocao.data_inicio).getDate() - today.getDate()  

  async function handleDisable(){
    const response = await fetchDisable(promocao.id)
    if(response){
      promocao.status = "Inativo"
    }
    dispatch('disable', {});
  }


</script>
  <input type="checkbox" id="my-modal-{promocao.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label for="my-modal-{promocao.id}" class="modal">
    <label class="modal-box relative max-w-4xl" for="">
      <div class="flex justify-between">
        <h3 class="text-lg font-bold flex items-center">Promocao {promocao.nome}</h3>
        <span class="rounded p-3 {promocao.status == 'Ativo' ? 'bg-green-500' : 'bg-red-500'}">{promocao.status}</span>
      </div>
      
      <div class="mt-8 flex flex-col gap-5">

        <div>
          {#if started > 0}
            <h1 class="font-bold">Status</h1>
            <p>Ainda não iniciou</p>
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
          {#if left > 0}
            <p>{data_inicio} até {data_fim} - Faltam {left} dias para o término da promoção</p>
          {:else}
            <p>{data_inicio} até {data_fim} - Promoção encerrada</p>
          {/if}
        </div>

        <div>
          <h1 class="font-bold">Desconto</h1>
          <p>Tipo de Desconto: <i>{promocao.tipo}</i></p>
          <p>Valor do Desconto: {promocao.tipo == "porcentual" ? `${promocao.valor_desconto}%` : `R$ ${promocao.valor_desconto}`}</p>
        </div>

        <div>
          {#if promocao.categorias.length > 0}
            <p class="font-bold">Categorias Selecionadas</p>
            <ul class="list-disc list-inside">
              {#each promocao.categorias as categoria}
                <li>{categoria}</li>
              {/each}
            </ul>
          {/if}
          <p class="font-bold pt-2">Produtos incluídos na promoção</p>
          {#if promocao.produtos.length == 0}
            <p>Nenhum produto cadastrado na promoção</p>
          {/if}
          <ul class="list-disc list-inside">
            {#each promocao.produtos as produto}
              <li>{produto.nome}</li>
            {/each}
          </ul> 
        </div>
        <div class="flex justify-end">
          <button disabled={promocao.status == 'Inativo'} class="btn btn-warning" on:click={handleDisable}>Desativar promocao</button>
        </div>
      </div>
    </label>
  </label>