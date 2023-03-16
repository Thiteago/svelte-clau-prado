<script>
	import { onMount } from "svelte";
  import { fetchOrders, formatToCurrency } from "$lib/js/helpers.js";
	import ModalPedidoAdmin from "$lib/components/modalPedidoAdmin/ModalPedidoAdmin.svelte";

  $: pedidos = []
  $: displayedPedidos = [];
  $: selectedPedido = []
  const productsPerPage = 5;
  let totalPages = 1;
  let currentPage = 1
  let pages = [];

  function selectPedido(id){
    selectedPedido = pedidos.find(pedido => pedido.id === id)
  }

  async function handleReload(){
    pedidos = await fetchOrders()
    displayedPedidos = displayPedidos(currentPage)
    selectedPedido = []
  }

  function displayPedidos(page) {
    currentPage = page;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    return pedidos.slice(startIndex, endIndex);
  }

  onMount(async () => {
    pedidos = await fetchOrders()
    displayedPedidos = displayPedidos(1)
    totalPages = Math.ceil(pedidos.length / productsPerPage);
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  })
</script>


<section class="p-6">
  <h1 class="text-2xl font-bold">Pedidos</h1>

  <div>
    <h2 class="text-left">Pendentes de pagamento</h2>
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
              {#if pedido.status === "Pendente"}
                <tr>
                  <td>{pedido.id}</td>
                  <td>{pedido.user.nome}</td>
                  <td>{formatToCurrency(pedido.valor)}</td>
                  <td>{pedido.Pagamento.forma_pagamento}</td>
                  <td>{pedido.endereco.rua}, {pedido.endereco.numeroRua}, {pedido.endereco.bairro}, {pedido.endereco.cidade}, {pedido.endereco.estado}</td>
                  <td>{pedido.status}</td>
                  <td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <label for="my-modal-{pedido.id}" on:click={() => selectPedido(pedido.id)} class="btn btn-primary rounded">Detalhes</label>
                  </td>
                </tr>
              {/if}
            {/each}
          {/if}
        </tbody>
      </table>
      <div class="btn-group mt-2">
        {#each pages as page}
          <button class="btn {currentPage == page ? 'btn-active' : ''}" on:click={() => {displayedPedidos = displayPedidos(page)}}>{page}</button>
        {/each}
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