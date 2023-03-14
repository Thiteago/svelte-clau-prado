<script>
  import order from '$lib/assets/icons/order-icon.svg'
  import { formatToCurrency, formatDate } from '$lib/js/helpers.js'
  export let pedido

  console.log(pedido)

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

          <div>
            <h2 class="font-bold">Endereço:</h2>
            <p>{pedido.endereco.rua}, {pedido.endereco.numeroRua} - {pedido.endereco.bairro}</p>
            <p>{pedido.endereco.cidade}, {pedido.endereco.estado} <br/> {pedido.endereco.cep}</p>
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
            <h2 class="font-bold">Método de Entrega:</h2>
            <p>Correios - {pedido.tipo_frete}</p>
            <p>Valor do frete: R${pedido.valor_frete}</p>
          </div>
        </div>

       <h1 class="font-bold text-xl">Vendas e Alugueis</h1>
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
                </tr>
              </thead>
              <tbody>
                {#each pedido.vendas as venda}
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" class="checkbox" />
                    </label>
                  </th>
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
                  <th>
                    <div>Venda</div>
                  </th>
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