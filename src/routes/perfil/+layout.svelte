<script>
  import { goto } from "$app/navigation";
  import {user , signed, logout, loadStorageData} from '$lib/js/stores/login.js'
  import { Hamburger } from 'svelte-hamburgers'
  import exit from '$lib/assets/icons/exit.svg'
  import { fade } from 'svelte/transition';
  import { redirect } from "@sveltejs/kit";
  import './perfil.scss'

  let open

  export function load(){
    loadStorageData()
    if($signed == false){
      redirect(300,"/")
    }
  }

  load()

</script>


<div class="containerContent">
  <div class="hamburguer-profile">
    <Hamburger bind:open />
  </div>
  <aside class="menuBar">
    <span class="returnButton" on:keyup={() => {goto("/")}} on:click={() => {goto("/")}}>Voltar</span>
    <ul class="menu">
        <li class="item" on:keyup={() => {goto('/perfil')}} on:click={() => {goto('/perfil')}}>Perfil</li>
        <li class="item" on:keyup={() => {goto('/perfil/dados')}} on:click={() => {goto('/perfil/dados')}}>Dados Cadastrais</li>
        <li class="item" on:keyup={() => {goto('/perfil/enderecos')}} on:click={() => {goto('/perfil/enderecos')}}>Endereços</li>
        <li class="item" on:keyup={() => {goto('/perfil/pedidos')}} on:click={() => {goto('/perfil/pedidos')}}>Historico de Pedidos</li>
        {#if $user.cargo == 'Admin'}
          <span class="py-10 text-center font-bold">Funções<br/> Administrativas <br/>↓</span>
          <li class="item" on:keyup={() => {goto('/perfil/admin/categorias')}} on:click={() => {goto('/perfil/admin/categorias')}}>Categorias</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/pedidos')}} on:click={() => {goto('/perfil/admin/pedidos')}}>Pedidos</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/devolucoes')}} on:click={() => {goto('/perfil/admin/devolucoes')}}>Devoluções</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/promocoes')}} on:click={() => {goto('/perfil/admin/promocoes')}}>Promoções</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/produtos')}} on:click={() => {goto('/perfil/admin/produtos')}}>Produtos</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/relatorios')}} on:click={() => {goto('/perfil/admin/relatorios')}}>Relatórios</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/despesas')}} on:click={() => {goto('/perfil/admin/despesas')}}>Fluxo de Despesas</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/usuarios')}} on:click={() => {goto('/perfil/admin/usuarios')}}>Usuarios Administrativos</li>
        {/if}
    </ul>
  </aside>
  <div class="contentWrapper">
    {#if open}
      <div transition:fade class="menu-container">
        <ul style="padding-bottom: 1rem;" class="menu bg-base-100 w-full">
          <li class="item" on:keyup={() => {goto('/')}} on:click={() => {goto('/')}}>Voltar</li>
          <li class="item" on:keyup={() => {goto('/perfil')}} on:click={() => {goto('/perfil')}}>Perfil</li>
          <li class="item" on:keyup={() => {goto('/perfil/dados')}} on:click={() => {goto('/perfil/dados')}}>Dados Cadastrais</li>
          <li class="item" on:keyup={() => {goto('/perfil/enderecos')}} on:click={() => {goto('/perfil/enderecos')}}>Endereços</li>
          <li class="item" on:keyup={() => {goto('/perfil/pedidos')}} on:click={() => {goto('/perfil/pedidos')}}>Historico de Pedidos</li>
          {#if $user.cargo == 'Admin'}
              <span class="py-10 text-center font-bold">Funções<br/> Administrativas <br/>↓</span>
              <li class="item" on:keyup={() => {goto('/perfil/admin/pedidos')}} on:click={() => {goto('/perfil/admin/pedidos')}}>Pedidos</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/devolucoes')}} on:click={() => {goto('/perfil/admin/devolucoes')}}>Devoluções</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/promocoes')}} on:click={() => {goto('/perfil/admin/promocoes')}}>Promoções</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/produtos')}} on:click={() => {goto('/perfil/admin/produtos')}}>Produtos</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/relatorios')}} on:click={() => {goto('/perfil/admin/relatorios')}}>Relatórios</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/despesas')}} on:click={() => {goto('/perfil/admin/despesas')}}>Fluxo de Despesas</li>
              <li class="item" on:keyup={() => {goto('/perfil/admin/usuarios')}} on:click={() => {goto('/perfil/admin/usuarios')}}>Usuarios Administrativos</li>
            {/if}
        </ul>
        <div class="w-full bg-white rounded-b-lg p-2">
          <div class="flex items-center justify-evenly w-full">
            <a class="" href='/perfil'>Ola! {$user.nome.split(' ')[0]}</a>
            <a href={"/"} on:click={logout}> <img width="35" src={exit} alt=""> 
            </a>
          </div>
        </div>
      </div>
    {/if}
    <slot />
  </div>
</div>
