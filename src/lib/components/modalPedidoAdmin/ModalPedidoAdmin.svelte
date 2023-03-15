<script>
  import order from '$lib/assets/icons/order-icon.svg'
  import pencil from '$lib/assets/icons/pencil.svg'
  import { formatToCurrency, formatDate } from '$lib/js/helpers.js'
  export let pedido

  $: selectedAluguelProduct = []
  $: selectedCompraProduct = []

  $: if(pedido){
    console.log(selectedCompraProduct)
    console.log(selectedAluguelProduct)
  }

  //CRIAR NOVO FETCH BY ID PARA RECARREGAR PEDIDO ATUALIZADO
  

  async function handleUpdateVinculatedProducts(){
    await fetch(`http://localhost:3333/pedido/alterar/produtos/${pedido.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        produtosAlugados: selectedAluguelProduct,
        produtosVendidos: selectedCompraProduct
      })
    })

  }

</script>

{#if Object.keys(pedido).length > 0}
  <input type="checkbox"  id="my-modal-{pedido.id}" class="modal-toggle" />
  <label for="my-modal-{pedido.id}" class="modal">
    <label class="modal-box relative max-w-full" for="">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold flex items-center"><img class="h-8 w-8" src={order} alt="order icon"/>Pedido #{pedido.id} - Data do Pedido: {pedido.data_pedido}</h3>
        <span class="{pedido.status == 'Pendente' ? 'bg-red-500' : 'bg-green-500'} font-bold p-3 rounded">{pedido.status}</span>
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
            <div class="bg-stone-300 rounded-full p-2 hover:bg-stone-500 cursor-pointer">
              <img width="30" height="30" src={pencil} alt="pencil icon">
            </div>
          </div>
        </div>
        
        <h1 class="font-bold text-xl">Pagamento e Entrega  <span class="{pedido.Pagamento.status == 'Pendente' ? 'bg-red-500' : 'bg-green-500'} p-1 ml-2 rounded text-sm">{pedido.Pagamento.status}</span></h1>
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
            <button on:click={handleUpdateVinculatedProducts} class="btn btn-error">Remover</button>
          </div>
        </div>

        <div>
          {#if pedido.vendas.length > 0}
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
                    <td class="flex justify-center">
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
                    <td class="flex justify-center">
                      <div class="bg-stone-200 rounded-full p-3 hover:bg-stone-500 cursor-pointer">
                        <img height="25" width="25" src={pencil} alt="icon pencil">
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          {/if}
        </div>
      </div>
    </label>
  </label>
{/if}