<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import {fetchOrdersById} from '$lib/js/helpers.js'
  import order from '$lib/assets/icons/order-icon.svg'
	import PaypalButton from '../paypalbutton/PaypalButton.svelte';
  export let pedido
  export let isOpen

  async function handlePdf(){
    await fetch(`${PUBLIC_BACKEND_URL}/pagamento/boleto/${pedido.Pagamento.id}`)
      .then(response => response.blob())
      .then(blob => {
      const file = new File([blob], 'file.pdf', { type: 'application/pdf' })
      window.open(URL.createObjectURL(file))
    })
  }

  async function handleReload(){
    pedido = await fetchOrdersById(pedido.id)
  }

</script>

{#if Object.keys(pedido).length > 0}
  <input type="checkbox" checked={isOpen} id="my-modal-{pedido.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label on:click={() => {isOpen = false}} for="my-modal-{pedido.id}" class="modal">
    <label class="modal-box max-w-full relative" for="">
      <h3 class="text-lg font-bold flex items-center"><img class="h-8 w-8" src={order} alt="order icon"/>Pedido #{pedido.id}</h3>
      <div class="mt-8 flex flex-col sm:flex-row gap-5">
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
          {#if pedido.Pagamento.forma_pagamento == 'paypal' && pedido.Pagamento.status == 'Pendente'}
            <div class="flex items-center mt-2 gap-5">
              <PaypalButton on:reloadOrder={handleReload} pedido={pedido}/>
              <p>Clique no Botao para tentar o pagamento via paypal</p>
            </div>
          {/if}
        </div>
      </div>
      <div>
        {#if pedido.vendas.length > 0 || pedido.alugueis.length > 0}
        <h2>Itens :</h2>
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {#if pedido.vendas.length > 0}
                {#each pedido.vendas as venda}
                  <tr>
                    <th class="mask mask-squircle w-32 h-32"><img src={'http://localhost:3333/static/' + venda.produto.imagens[0]} alt=""></th>
                    <td>
                      <div>{venda.produto.nome}</div>
                      {#each venda.produto_mudanca as info}
                        <div>{info.nome}: {info.valor}</div>
                      {/each}
                    </td>
                    <td>{venda.produto.valor}</td>
                    <td>Comprado</td>
                  </tr>
                {/each}
              {/if}
              {#if pedido.alugueis.length > 0}
                {#each pedido.alugueis as aluguel}
                  <tr>
                    <th class="mask mask-squircle w-32 h-32"><img src={'http://localhost:3333/static/' + aluguel.produto.imagens[0]} alt=""></th>
                    <td>
                      <div>{aluguel.produto.nome}</div>
                      {#each aluguel.produto_mudanca as info}
                        <div>{info.nome}: {info.valor}</div>
                      {/each}
                    </td>
                    <td>{aluguel.produto.valor}</td>
                    <td>Alugado</td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        {/if}
      </div>
    </label>
  </label>
{/if}