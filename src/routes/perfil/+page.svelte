<script>
  import './perfil.scss'
  import { user } from '$lib/js/stores/login.js'
  import { fetchOrdersByUserId } from '$lib/js/helpers.js'
	import { onMount } from 'svelte';

  let orders = []


  onMount(async () => {
    orders = await fetchOrdersByUserId($user.id) 
  })
  
  
</script>


<div class="profileContainer">
  <div class="userWrapper">
    <div>
        <h2>Bem-vindo, {$user.nome}!</h2>
        <span>{$user.email}</span>
    </div>
  </div>
  
  <div class="containerUltimoPedido">
    <div class="containerPedido">
      {#if orders.length > 0}
        <h3 class="font-bold text-xl">últimos Pedidos</h3>
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
</div>