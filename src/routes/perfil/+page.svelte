<script>
  import { goto } from "$app/navigation";
	import Dadoscad from "$lib/components/dadoscadastrais/Dadoscad.svelte";
  import Perfil from "$lib/components/perfil/Perfil.svelte";
	import Produtosadmin from "$lib/components/produtosadmin/Produtosadmin.svelte";
  import {user, loadStorageData, signed} from '$lib/stores/login'
	import { redirect } from "@sveltejs/kit";
  import "./style.scss"

  $: selected = 'Perfil'

  export function load(){
    loadStorageData()
    if($signed == false){
      redirect(300,"/")
    }
  }

  load()

</script>


<div class="containerContent">
  <aside class="menuBar">
    <span class="returnButton" on:keyup={() => {goto("/")}} on:click={() => {goto("/")}}>Voltar</span>
    <ul class="menu">
        <li class="item" on:keyup={() => {selected = 'Perfil'}} on:click={() => {selected = 'Perfil'}}>Perfil</li>
        <li class="item" on:keyup={() => {selected = 'Dados Cadastrais'}} on:click={() => {selected = 'Dados Cadastrais'}}>Dados Cadastrais</li>
        <li class="item" on:keyup={() => {selected = 'Pagamento'}} on:click={() => {selected = 'Pagamento'}}>Formas de Pagamento</li>
        <li class="item" on:keyup={() => {selected = 'Historico de Pedidos'}} on:click={() => {selected = 'Historico de Pedidos'}}>Historico de Pedidos</li>
        {#if $user.cargo == 'Admin'}
          <li class="item" on:keyup={() => {selected = 'Promoções'}} on:click={() => {selected = 'Promoções'}}>Promoções</li>
          <li class="item" on:keyup={() => {selected = 'Produtos'}} on:click={() => {selected = 'Produtos'}}>Produtos</li>
          <li class="item" on:keyup={() => {selected = 'Relatórios'}} on:click={() => {selected = 'Relatórios'}}>Relatórios</li>
          <li class="item" on:keyup={() => {selected = 'Estoque'}} on:click={() => {selected = 'Estoque'}}>Estoque</li>
          <li class="item" on:keyup={() => {selected = 'Permissoes'}} on:click={() => {selected = 'Permissoes'}}>Permissões</li>
          <li class="item" on:keyup={() => {selected = 'Usuarios do Sistema'}} on:click={() => {selected = 'Usuarios do Sistema'}}>Usuarios Administrativos</li>
        {/if}
    </ul>
  </aside>
  <div class="contentWrapper">
    {#if selected == 'Perfil'}
      <Perfil user={$user}/>
    {:else if selected == 'Dados Cadastrais'}
      <Dadoscad />
    {:else if selected == 'Produtos'}
      <Produtosadmin />
    {/if}
  </div>
</div>
