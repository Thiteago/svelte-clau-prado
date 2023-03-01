<script>
  import './perfilscreen.scss'
  import { fetchSales } from '$lib/js/helpers.js'
	import { onMount } from 'svelte';

  export let user
  let sales = []



  onMount(async () => {
    sales = await fetchSales(user.id) 
  })
  
  
</script>


<div class="profileContainer">
  <div class="userWrapper">
    <div>
        <h2>Bem-vindo, {user.nome}!</h2>
        <span>{user.email}</span>
    </div>
  </div>
  
  <div class="containerUltimoPedido">
    <h3 class="sectionTitle">Ultimos Pedidos</h3>
    <div class="containerPedido">
      <div class="grid-container">
        <div class="header col-4">Número do Pedido</div>
        <div class="header col-4">Status</div>
        <div class="header col-4">Data</div>
        <div class="header col-4">Pagamento</div>
        {#each sales as sale}
          <div class="item col-4">{sale.id}</div>
          <div class="item col-4">{sale.status}</div>
          <div class="item col-4">{sale.data_pedido}</div>
          <div class="item col-4">{sale.Pagamento.forma_pagamento}</div>
        {/each}
      </div>
      <a href="#">Histórico de Pedidos</a>
    </div>
  </div>
</div>