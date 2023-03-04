<script>
  import order from '$lib/assets/icons/order-icon.svg'
  export let pedido
  export let isOpen

  $: if(pedido){
    console.log(pedido)
  }
</script>

{#if pedido != null}
  <input type="checkbox" checked={isOpen} id="my-modal-{pedido.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label on:click={() => {isOpen = false}} for="my-modal-{pedido.id}" class="modal">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold flex items-center"><img class="h-8 w-8" src={order} alt="order icon"/>Pedido #{pedido.id}</h3>
      <div class="mt-8 flex flex-col gap-5">
        <div>
          <h2 class="font-bold">Data do Pedido:</h2>
          <p>{pedido.data_pedido}</p>
        </div>
        
        <div>
          <h2 class="font-bold">Endereço:</h2>
          <p>{pedido.endereco.rua}, {pedido.endereco.numeroRua} - {pedido.endereco.bairro}</p>
          <p>{pedido.endereco.cidade}, {pedido.endereco.estado} <br/> {pedido.endereco.cep}</p>
        </div>

        <div>
          {#if pedido.Pagamento.forma_pagamento == 'boleto'}
          <h2 class="font-bold">Forma de pagamento: <i>Boleto</i> </h2>
            <div class="flex items-center mt-2 gap-5">
              <button class="btn btn-success">Baixar Boleto</button>
              <p>Clique no Botao para baixar seu boleto</p>
            </div>
            
          {:else if pedido.forma_pagamento == 'cartao'}
            <p>Cartão</p>
          {/if}
        </div>

        <div>
          <h2 class="font-bold">Método de Entrega:</h2>
          
        </div>
      </div>
    </label>
  </label>
{/if}