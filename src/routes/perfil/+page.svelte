<script>
  import './perfil.scss'
  import { user } from '$lib/js/stores/login.js'
  import { fetchOrdersByUserId, formatDate, updateDevolution } from '$lib/js/helpers.js'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { DateTime } from 'luxon'
  import { Line } from 'svelte-chartjs';
	import { onMount } from 'svelte';
	import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte';
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';


  Chart.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

  const today = new Date().toISOString().split('T')[0]
  $: flashMessage = ''
  let selectedPedidoId = ''
  let selectedAluguelId = ''
  let labels = []
  let ganhosTotais = []
  let despesasTotais = []
  let data
  let content = []
  let orders = []
  $: rentedOrders = []
  $: codigorastreio = ''
  let lateReturn = []
  $: dataInicial = ''
  $: dataFinal = ''
  $: limitInitialDate = ''
  $: limitFinalDate = ''
  $: flash = {
    message: '',
    type: 'warning',
    time: 3000,
    visible: false
  }

  function verifyExpiration(){
    rentedOrders.forEach(order => {
      order.alugueis.map(aluguel => {
        let dataExpiracao = new Date(aluguel.data_expiracao).getTime()
        if(dataExpiracao < new Date()){
          lateReturn = [...lateReturn, aluguel]
        }
      })
    })

  }

  async function handleSended(id, idAluguel){
    if (await updateDevolution(id, idAluguel ,codigorastreio)){
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
  
  async function loadChartData(content){
    let uniqueDates = new Set();

    content.despesas.forEach(item => {
      //format item.data to dd/mm/yyyy with luxon
      item.data = DateTime.fromISO(item.data).toFormat('dd/MM/yyyy')
      uniqueDates.add(item.data)
    })

    content.ganhos.forEach(item => {
      item.data_pedido = DateTime.fromISO(item.data_pedido).toFormat('dd/MM/yyyy')
      uniqueDates.add(item.data_pedido)
    })

    labels = [...uniqueDates].sort((a, b) => new Date(a) - new Date(b));

    labels.forEach((label) => {
      let ganhos = 0
      let despesas = 0
      content.ganhos.forEach(item => {
        if(item.data_pedido == label){
          ganhos += item.valor_total
        }
      })
      content.despesas.forEach(item => {
        if(item.data == label){
          despesas += item.valor_total
        }
      })
      ganhosTotais = [...ganhosTotais, ganhos]
      despesasTotais = [...despesasTotais, despesas]
    })
    
  }

  $: if(content){
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Ganhos',
          data: ganhosTotais,
          backgroundColor: [
            'rgba(255, 134,159,0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(255, 134, 159, 1)',
          ],
        },
        {
          label: 'Despesas',
          data: despesasTotais,
          backgroundColor: [
            'rgba(98,  182, 239, 0.4)',
          ],
          borderWidth: 2,
          borderColor: [
            'rgba(98,  182, 239, 1)',
          ],
        },
      ],
    };
  }

  onMount(async () => {
    if($user.cargo != 'Admin'){
      orders = await fetchOrdersByUserId($user.id) 
      orders.forEach(order => {
        if(order.alugueis.length > 0){
          rentedOrders = [...rentedOrders, order]
        }
      })
      
      rentedOrders.forEach(order => {
        order.alugueis = order.alugueis.filter((aluguel, index, self) =>
          index === self.findIndex((t) => (
            t.pedidoId === aluguel.pedidoId
          ))
        )
      })
      
      verifyExpiration()
      orders = orders.slice(0, 3)
    }else{
      dataInicial = DateTime.local().startOf('month').toISODate()
      dataFinal = DateTime.local().endOf('month').toISODate()
      const response = await fetch(`${PUBLIC_BACKEND_URL}/realtorio/despesaseganhos/selecionar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataInicial,
          dataFinal
        })
      })
      content = await response.json()
      loadChartData(content)
    };

  })

  async function searchByDate(){
    if(dataInicial != '' && dataFinal != ''){
      const response = await fetch(`${PUBLIC_BACKEND_URL}/realtorio/despesaseganhos/selecionar`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataInicial,
          dataFinal
        })
      });
      const content = await response.json()
      data = loadChartData(content)
      
    }else if(dataFinal == '' && dataInicial != ''){
      flash.message = 'Preencha a data final'
      flash.type = 'error'
      flash.visible = true
    }else if(dataInicial == '' && dataFinal != ''){
      flash.message = 'Preencha a data inicial'
      flash.type = 'error'
      flash.visible = true
    }else{
      flash.message = 'Preencha as datas'
      flash.type = 'error'
      flash.visible = true
    }

  }

  
  
</script>


<div class="profileContainer">
  <div class="userWrapper">
    <div>
        <h2>Bem-vindo, {$user.nome}!</h2>
        <span>{$user.email}</span>
    </div>
  </div>
  {#if $user.cargo != 'Admin'}
    {#if rentedOrders.length >= 1}
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold">Aluguéis Ativos ⬇️</h2>
      </div>
      <div class="grid-alugueis-container justify-center">
        <div class="header col-3">Número do Pedido</div>
        <div class="header col-3">Data de Aluguel</div>
        <div class="header col-3">Data de Expiração</div>
        {#each rentedOrders as order}
          {#each order.alugueis as aluguel}
            <div class="item col-3">{order.id}</div>
            <div class="item col-3">{formatDate(aluguel.data_aluguel)}</div>
            <div class="item col-3">{formatDate(aluguel.data_expiracao)}</div>
          {/each}
        {/each}
      </div>

      {#if lateReturn.length > 0}
        <div class="flex justify-center">
          <h2 class="text-2xl font-bold">Devoluções atrasados 😢</h2>
        </div>

        <div class="grid-container justify-center">
          <div class="header col-4">Número do Pedido</div>
          <div class="header col-4">Data do Aluguel</div>
          <div class="header col-4">Dias atrasados</div>
          <div class="header col-4">Informar Devolução</div>
          {#each lateReturn as order}
            <div class="item col-4">{order.pedidoId}</div>
            <div class="item col-4">{formatDate(order.data_aluguel)}</div>
            <div class="item col-4">{Math.floor((new Date() - new Date(order.data_expiracao)) / (1000 * 60 * 60 * 24))}</div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <label for="my-modal-3" on:click={() => {selectedPedidoId = order.pedidoId, selectedAluguelId = order.id}} style="cursor: pointer;" class="item col-4">Informar</label>
          {/each}
        </div>
        <input type="checkbox" id="my-modal-3" class="modal-toggle" />
        <label for="my-modal-3" class="modal cursor-pointer">
          <label class="modal-box relative" for="">
            {#if flashMessage != ''}
              <FlashMessage message={flashMessage} />
            {/if}
            <h3 class="text-lg font-bold">Informar Envio</h3>
            <div class="flex gap-3 items-center">
              <label for="codigo-rastreio">Código de Rastreio:</label>
              <input bind:value={codigorastreio} type="text" name="codigo-rastreio" class="input input-bordered">
            </div>
            <div class="mt-3">
              <button on:click={handleSended(selectedPedidoId, selectedAluguelId)} class="btn btn-success">Confirmar</button>
              <label for="my-modal-3" class="btn btn-error">Cancelar</label>
            </div>
          </label>
        </label>
      {:else}
        <div class="flex justify-center my-12">
          Nenhuma devolução atrasada
        </div>
      {/if}
    {/if}
    <div class="containerUltimoPedido">
      <div class="containerPedido">
        {#if orders.length > 0}
          <h3 class="font-bold text-xl">Últimos Pedidos</h3>
          <div class="grid-container justify-center">
            <div class="header col-4">Número do Pedido</div>
            <div class="header col-4">Status</div>
            <div class="header col-4">Data</div>
            <div class="header col-4">Pagamento</div>
            {#each orders as order}
              <div class="item col-4">{order.id}</div>
              <div class="item col-4">{order.status}</div>
              <div class="item col-4">{order.data_pedido}</div>
              <div class="item col-4">{order.Pagamento.forma_pagamento}</div>
            {/each}
          </div>
          {:else}
            <div class="my-6">Seus últimos pedidos irão aparecer aqui</div>
          {/if}
        <a class="rounded p-4 bg-slate-500 text-white w-3/12" href="/perfil/pedidos">Histórico de Pedidos</a>
      </div>
    </div>
  {:else}
    {#if flash.message != '' }
      <FlashMessage message={flash.message} type={flash.type} time={flash.time} visible={flash.visible}/>
    {/if}
    <div class="flex justify-center gap-3 my-6">
      <input type="date" bind:value={dataInicial} max={limitFinalDate != '' ? limitFinalDate : today} placeholder="Data Inicial" class="input input-bordered w-full max-w-xs" />
      <input type="date" bind:value={dataFinal} min={limitInitialDate} max={today} placeholder="Data Final" class="input input-bordered w-full max-w-xs" />
      <button on:click={searchByDate} class="btn">Filtrar</button>
    </div>
    <div>
      <Line {data} options={{ responsive: true }} />
    </div>
  {/if}
</div>
