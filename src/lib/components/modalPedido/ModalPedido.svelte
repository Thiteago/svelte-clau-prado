<script>
  import order from '$lib/assets/icons/order-icon.svg'
  export let pedido
  export let isOpen

  async function handlePdf(){
    await fetch(`http://localhost:3333/pagamento/boleto/${pedido.Pagamento.id}`)
    .then(response => response.blob())
    .then(blob => {
    const file = new File([blob], 'file.pdf', { type: 'application/pdf' })
    window.open(URL.createObjectURL(file))
  })
  }

</script>

{#if Object.keys(pedido).length > 0}
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
              <button on:click={handlePdf} class="btn btn-success">Baixar Boleto</button>
              <p>Clique no Botao para baixar seu boleto</p>
            </div>
          {:else if pedido.Pagamento.forma_pagamento == 'cartao'}
            <h2 class="font-bold">Forma de pagamento: <i>Cartao</i> </h2>
            <div class="flex items-center mt-2 gap-5">
              <p>Cartão com final {pedido.Pagamento.cartao.numero.substr(-4)}</p>
            </div>
          {/if}
        </div>

        <div>
          <h2 class="font-bold">Método de Entrega:</h2>
          <p>Correios - {pedido.tipo_frete}</p>
          <p>Valor do frete: R${pedido.valor_frete}</p>
        </div>

        <div>
          <h2 class="font-bold">Status do Pagamento</h2>
          <p>{pedido.Pagamento.status}</p>
        </div>
      </div>
    </label>
  </label>
{/if}