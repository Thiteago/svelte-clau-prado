<script>
  import order from '$lib/assets/icons/order-icon.svg'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import pencil from '$lib/assets/icons/pencil.svg'
  import { formatToCurrency, formatDate, fetchOrdersById, fetchAddress, changeOrderAddress } from '$lib/js/helpers.js'
  import { createEventDispatcher, onMount } from 'svelte';

  const dispatch = createEventDispatcher();
  export let pedido
  let enderecos = []
  let selectedAddress = pedido.enderecoId

  $: selectedAluguelProduct = []
  $: selectedCompraProduct = []


  function reloadOrders() {
		dispatch('reload', {});
	}

  onMount(async () => {
    enderecos = await fetchAddress(pedido.userId)
  })

  async function handleOrderCancelation(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/cancelar/${pedido.id}`, {
      method: 'DELETE',
    })
    if(response.status == 200){
      pedido = await fetchOrdersById(pedido.id)
      reloadOrders()
    }
  }

  async function handleUpdateVinculatedProducts(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/alterar/produtos/${pedido.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        produtosAlugados: selectedAluguelProduct,
        produtosVendidos: selectedCompraProduct
      })
    })
    if(response.status == 200){
      pedido = await fetchOrdersById(pedido.id)
    }
  }

  async function handleAddressChange(){
    const response = await changeOrderAddress(pedido.id, selectedAddress)
    if(response){
      pedido = await fetchOrdersById(pedido.id)
    }
  }

</script>

{#if Object.keys(pedido).length > 0}
  <input type="checkbox" id="my-modal-{pedido.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal">
    <label class="modal-box relative max-w-full" for="">
      <label on:click={reloadOrders} for="my-modal-{pedido.id}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      <div class="flex justify-between items-center mr-5">
        <div class="flex flex-col gap-3">
          <div class="flex gap-3">
            <h3 class="text-lg font-bold flex items-center"><img class="h-8 w-8" src={order} alt="order icon"/>Pedido #{pedido.id} - Data do Pedido: {pedido.data_pedido}</h3>
            <span class="{pedido.status == 'Pendente' ? 'bg-red-500' : pedido.status == 'A Enviar' ? 'bg-orange-500' : pedido.status == 'Enviado' ? 'bg-blue-500' : 'bg-green-500'} font-bold p-1 rounded">{pedido.status}</span>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}`}" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box relative">
          <label for="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}`}" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 class="text-lg font-bold">Cancelar Pedido</h3>
          <p>Voce tem certeza que deseja cancelar esse pedido?</p>
          {#if pedido.Pagamento.status == 'Confirmado'  ||  pedido.status == 'Aguardando Envio'}
            <p class="font-bold text-md text-red">Esse pedido ja esta pago!!!</p>
          {:else if pedido.status == 'Enviado'}
            <p class="font-bold text-md text-red">Esse pedido ja foi enviado ao cliente!!!</p>
          {/if}
          <div class="flex justify-end gap-3 mt-1">
            <label for="my-modal-3" class="btn btn-error">Nao</label>
            <button on:click={handleOrderCancelation} class="btn btn-success">Sim</button>
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex flex-col gap-5">
        <h1 class="font-bold text-xl">Dados do Comprador</h1>
        <div class="flex gap-5 items-center">
          <div>
            <h2 class="font-bold text-sm">Identificação</h2>
            <p>ID: {pedido.user.id}</p>
            <p>Nome: {pedido.user.nome}</p>
            <p>CPF: {pedido.user.cpf}</p>
          </div>
          
          <div>
            <h2 class="font-bold text-sm">Contato:</h2>
            <p>Email: {pedido.user.email}</p>
            <p>Celular: {pedido.user.numeroCel}</p>
            <p>Telefone: {pedido.user.numeroTel}</p>
          </div>

          <div class="bg-stone-100 rounded p-3 flex items-center gap-3">
            <div>
              <h2 class="font-bold text-sm">Endereço:</h2>
              <p>{pedido.endereco.rua}, {pedido.endereco.numeroRua} - {pedido.endereco.bairro}</p>
              <p>{pedido.endereco.cidade}, {pedido.endereco.estado} <br/> {pedido.endereco.cep}</p>
            </div>
            <label for="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}enviar`}" class="bg-stone-300 rounded-full p-2 hover:bg-stone-500 cursor-pointer">
              <img width="30" height="30" src={pencil} alt="pencil icon">
            </label>

          </div>
        </div>
        
        <h1 class="font-bold text-xl">Pagamento <span class="{pedido.Pagamento.status == 'Pendente' ? 'bg-red-500' : 'bg-green-500'} p-1 ml-2 rounded text-sm">{pedido.Pagamento.status}</span></h1>
        <div class="flex gap-5 items-baseline">
          <div>
            <h2 class="font-bold text-sm">Informações do Pagamento</h2>
            {#if pedido.Pagamento.forma_pagamento == 'boleto'}
            <h2>Forma de pagamento: <i>Boleto</i> </h2>
            {:else if pedido.Pagamento.forma_pagamento == 'cartao'}
              <h2>Forma de pagamento: <i>Cartao</i> </h2>
              <div class="flex items-center">
                <p>Cartão com final {pedido.Pagamento.cartao.numero.substr(-4)}</p>
              </div>
            {/if}
            <p>Valor da compra: {formatToCurrency(pedido.valor)}</p>
            <p>Pagamento {pedido.Pagamento.vezes == 'A vista' ? 'A Vista' : `em ${pedido.Pagamento.vezes} vezes`}</p>
          </div>
          {#if pedido.Pagamento.forma_pagamento == 'boleto'}
            <div>
              <h2 class="font-bold text-sm">Informações do boleto</h2>
              <div>
                <p>Data de vencimento: {formatDate(pedido.Pagamento.boleto.data_venc)}</p>
                <p>Linha Digitável: {pedido.Pagamento.boleto.linhaDigitavel}</p>
                <p>Status do Pagamento: {pedido.Pagamento.boleto.status}</p>
              </div>
            </div>
          {/if}

          <div>
            <h2 class="font-bold text-sm">Método de Entrega:</h2>
            <p>Correios - {pedido.tipo_frete}</p>
            <p>Valor do frete: R${pedido.valor_frete}</p>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <h1 class="font-bold text-xl">Vendas e Alugueis</h1>
          <div>
            <label for="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}`}" class="btn btn-error">Cancelar Pedido</label>
            {#if pedido.status != 'Aguardando Envio'}
              <button on:click={handleUpdateVinculatedProducts} class="btn btn-warning">Remover Item</button>
            {/if}
          </div>
        </div>

        <input type="checkbox" 
        id="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}enviar`}" 
        class="modal-toggle" 
        />

        <div class="modal">
          <div class="modal-box relative max-w-full w-2/3">
            <label 
            for="my-modal-{`${pedido.data_pedido}${pedido.id}${pedido.endereco.rua}${pedido.endereco.numeroRua}enviar`}" 
            class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
            <h3 class="text-lg font-bold">Endereço de entrega</h3>
            <div class="mt-2 flex flex-col gap-3">
              {#if enderecos.length > 0 }
                {#each enderecos as endereco}
                  <div class="flex items-center gap-3">
                    <label>
                      <input type="radio" bind:group={selectedAddress} name="endereco" value={endereco.id} />
                    </label>
                    <p>{endereco.rua}, {endereco.numeroRua} - {endereco.bairro} </p>
                    <p>{endereco.cidade}, {endereco.estado} {endereco.cep}</p>
                  </div>
                {/each}
                <button on:click={handleAddressChange} class="btn btn-success">Atualizar Endereço</button>
              {:else}
                <p class="text-center">O Usuario não possui endereços cadastrados</p>
              {/if}
            </div>
          </div>
        </div>

        <div>
          {#if pedido.vendas.length > 0  || pedido.alugueis.length > 0}
            <div class="overflow-x-auto w-full">
              <table class="table w-full">
                <!-- head -->
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" class="checkbox" />
                      </label>
                    </th>
                    <th>Nome do Produto</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                    <th>Tipo</th>
                    {#if pedido.alugueis.length > 0}
                      <th>Data de Aluguel</th>
                      <th>Data de Expiracao</th>
                      <th>Dias Alugados </th>
                    {:else}
                      <th></th>
                      <th></th>
                      <th></th>
                    {/if}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {#each pedido.vendas as venda}
                    <tr>
                      <td>
                        <label>
                          <input bind:group={selectedCompraProduct} type="checkbox" class="checkbox" value={venda.id}/>
                        </label>
                      </td>
                      <td>
                        <div class="flex items-center space-x-3">
                          <div class="avatar">
                            <div class="mask mask-squircle w-12 h-12">
                              <img src={'http://localhost:3333/static/'+ venda.produto.imagens[0]} alt="Avatar of the product" />
                            </div>
                          </div>
                          <div>
                            <div class="font-bold">{venda.produto.nome}</div>
                            <div class="text-sm opacity-50">{venda.produto.descricao}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {venda.produto.categoria}
                      </td>
                      <td>{formatToCurrency(venda.produto.valor)}</td>
                      <td>
                        <div>Venda</div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td class="flex">
                        <div class="bg-stone-200 rounded-full p-3 hover:bg-stone-500 cursor-pointer">
                          <img height="25" width="25" src={pencil} alt="icon pencil">
                        </div>
                      </td>
                    </tr>
                  {/each}

                  {#each pedido.alugueis as aluguel}
                    <tr>
                      <td>
                        <label>
                          <input bind:group={selectedAluguelProduct} type="checkbox" class="checkbox" value={aluguel.id} />
                        </label>
                      </td>
                      <td>
                        <div class="flex items-center space-x-3">
                          <div class="avatar">
                            <div class="mask mask-squircle w-12 h-12">
                              <img src={'http://localhost:3333/static/'+ aluguel.produto.imagens[0]} alt="Avatar of the product" />
                            </div>
                          </div>
                          <div>
                            <div class="font-bold">{aluguel.produto.nome}</div>
                            <div class="text-sm opacity-50">{aluguel.produto.descricao}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {aluguel.produto.categoria}
                      </td>
                      <td>{formatToCurrency(aluguel.produto.valor)}</td>
                      <td>
                        <div>Aluguel</div>
                      </td>
                      <td class="text-center">
                        {formatDate(aluguel.data_aluguel)}
                      </td>
                      <td class="text-center">
                        {formatDate(aluguel.data_expiracao)}
                      </td>
                      <td class="text-center">
                        {aluguel.dias_alugados}
                      </td>
                      <td class="flex">
                        <div class="bg-stone-200 rounded-full p-3 hover:bg-stone-500 cursor-pointer">
                          <img height="25" width="25" src={pencil} alt="icon pencil">
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div style="min-height: 20rem;" class="flex justify-center items-center">
              <h3 class="text-lg font-bold text-slate-300">Nenhum produto vinculado a este pedido</h3>
            </div>
          {/if}
        </div>
      </div>
    </label>
  </div>
{/if}