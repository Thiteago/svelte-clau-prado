<script>
  import {fetchOrdersByUserId} from '$lib/js/helpers.js'
  import { user } from '$lib/js/stores/login.js'
	import { onMount } from 'svelte';
	import ModalPedido from '$lib/components/modalPedido/ModalPedido.svelte';

  let isOpen = false
  $: selectedPedido = {}
  let pedidos = []


  async function loadOrders(){
    pedidos = await fetchOrdersByUserId($user.id)
  }

  onMount(async () => {
    await loadOrders()
  })

  function selectPedido(id){
    selectedPedido = pedidos.find(pedido => pedido.id === id)
    isOpen = true
  }

</script>

<section class="p-6">
  <h1 class="text-2xl">Histórico de Pedidos</h1>
  <div class="mt-10 overflow-auto">
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th class="px-4 py-2">Número do Pedido</th>
          <th class="px-4 py-2">Status</th>
          <th class="px-4 py-2">Data</th>
          <th class="px-4 py-2">Pagamento</th>
        </tr>
      </thead>
      <tbody>
        {#if pedidos.length === 0}
          <tr>
            <td class="border text-center px-4 py-2" colspan="4">Nenhum pedido encontrado</td>
          </tr>
        {:else}
          {#each pedidos as pedido}
            <tr class="text-center">
              <td class="border px-4 py-2">{pedido.id}</td>
              <td class="border px-4 py-2">{pedido.status}</td>
              <td class="border px-4 py-2">{pedido.data_pedido}</td>
              <td class="border px-4 py-2">{pedido.Pagamento.forma_pagamento}</td>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <td><label for="my-modal-{pedido.id}" on:click={() => selectPedido(pedido.id)} class="btn btn-primary rounded">Detalhes</label></td>
            </tr> 
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</section>

{#if selectedPedido != null}
  <ModalPedido pedido={selectedPedido} {isOpen}/>
{/if}
