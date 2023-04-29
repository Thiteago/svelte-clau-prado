<script>
	import { onMount } from "svelte";
  import { fetchOrders, formatToCurrency, updateToSended } from "$lib/js/helpers.js";
  import packageIcon from '$lib/assets/icons/package.svg'
  import pencilIcon from '$lib/assets/icons/pencil.svg'
	import ModalPedidoAdmin from "$lib/components/modalPedidoAdmin/ModalPedidoAdmin.svelte";

  $: pedidos = []
  $: displayedPedidos = [];
  $: selectedPedido = {}
  $: codigorastreio = ''
  $: flashMessage = ''
  $: selectedType = "Pendente"
  const productsPerPage = 5;
  let totalPages = 1;
  let currentPage = 1
  let pages = [];

  $: if(selectedType){
    handleReload()
  }

  function selectPedido(id){
    selectedPedido = pedidos.find(pedido => pedido.id === id)
  }

  async function handleSended(id){
    if (await updateToSended(id, codigorastreio)){
      flashMessage = 'Pedido atualizado com sucesso'
      setTimeout(() => {
        flashMessage = ''
      }, 3000);
    }else{
      flashMessage = 'Erro ao atualizar pedido'
      setTimeout(() => {
        flashMessage = ''
      }, 3000);
    }
  }

  async function handleReload(){
    pedidos = await fetchOrders()
    displayedPedidos = displayPedidos(1, selectedType)
    selectedPedido = []
  }

  function displayPedidos(page, type) {
    currentPage = page;
    let filteredPedidos = pedidos;
  
    if(type != 'Todos') {
      filteredPedidos = pedidos.filter(pedido => pedido.status === type)
      totalPages = Math.ceil(filteredPedidos.length / productsPerPage);
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }else{
      totalPages = Math.ceil(pedidos.length / productsPerPage);
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    return filteredPedidos.slice(startIndex, endIndex);
  }

  onMount(async () => {
    pedidos = await fetchOrders()
    displayedPedidos = displayPedidos(1, selectedType)
    totalPages = Math.ceil(displayedPedidos.length / productsPerPage);
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  })
</script>


<section class="p-6">
  <h1 class="text-2xl font-bold">Pedidos</h1>

  <div>
    <label for="pedidos" class="label">
      <span class="label-text">Selecione o tipo de pedidos a serem mostrados</span>
    </label>
    <select bind:value={selectedType} name="pedidos" class="select select-bordered">
      <option selected value="Pendente">Pendentes de Pagamento</option>
      <option value="Aguardando Envio">Pendentes de Envio</option>
      <option value="Enviado">Enviados</option>
      <option value="Finalizado">Finalizados</option>
      <option value="Todos">Todos</option>
    </select>
    <div class="flex flex-col items-center">
      <table class="table cazuza table-zebra w-full mt-5">
        <thead>
          <tr>
            <th>Id</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Forma de Pagamento</th>
            <th>Endereço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {#if pedidos.length === 0}
            <tr>
              <td colspan="7">Nenhum pedido encontrado</td>
            </tr>
          {:else}
            {#each displayedPedidos as pedido}
              {#if pedido.status === selectedType || selectedType === 'Todos'}
                <tr>
                  <td>{pedido.id}</td>
                  <td>{pedido.user.nome}</td>
                  <td>{formatToCurrency(pedido.valor)}</td>
                  <td>{pedido.Pagamento.forma_pagamento}</td>
                  <td>{pedido.endereco.rua}, {pedido.endereco.numeroRua}, {pedido.endereco.bairro}, {pedido.endereco.cidade}, {pedido.endereco.estado}</td>
                  <td>{pedido.status}</td>
                  <td>
                    {#if selectedType != 'Aguardando Envio'}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <label for="my-modal-{pedido.id}" on:click={() => selectPedido(pedido.id)} class="btn btn-primary rounded">Detalhes</label>
                    {:else}
                      <div class="flex gap-5">  
                        <label for="my-modal-{pedido.id + '-enviar'}" class="cursor-pointer">
                          <img width="30" height="30" src={packageIcon} alt="">
                        </label>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <label for="my-modal-{pedido.id}" on:click={() => selectPedido(pedido.id)} class="cursor-pointer">
                          <img width="30" height="30" src={pencilIcon} alt="">
                        </label>
                      </div>
                    {/if}
                  </td>
                </tr>
                <input type="checkbox" id="my-modal-{pedido.id + '-enviar'}" class="modal-toggle" />
                <label for="my-modal-{pedido.id + '-enviar'}" class="modal cursor-pointer">
                  <label class="modal-box relative" for="">
                    {#if flashMessage != ''}
                      <span>{flashMessage}</span>
                    {/if}
                    <h3 class="text-lg font-bold">Informar Envio</h3>
                    <div class="flex gap-3 items-center">
                      <label for="codigo-rastreio">Código de Rastreio:</label>
                      <input bind:value={codigorastreio} type="text" name="codigo-rastreio" class="input input-bordered">
                    </div>
                    <div class="mt-3">
                      <button on:click={handleSended(pedido.id)} class="btn btn-success">Confirmar</button>
                      <label for="my-modal-{pedido.id + '-enviar'}" class="btn btn-error">Cancelar</label>
                    </div>
                  </label>
                </label>
              {/if}
            {/each}
          {/if}
        </tbody>
      </table>
      <div class="btn-group mt-2">
        {#if pages.length > 1}
          {#each pages as page}
            <button class="btn {currentPage == page ? 'btn-active' : ''}" on:click={() => {displayedPedidos = displayPedidos(page, selectedType)}}>{page}</button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>



{#if Object.keys(selectedPedido).length > 0}
  <ModalPedidoAdmin on:reload={handleReload} pedido={selectedPedido} />
{/if}

<style>
  .cazuza :where(th, td) {
    white-space: normal;
  }
</style>