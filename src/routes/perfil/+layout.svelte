<script>
  import { goto } from "$app/navigation";
  import {user} from '$lib/js/stores/login.js'
  import { loadStorageData, signed } from '$lib/js/stores/login.js'
  import { redirect } from "@sveltejs/kit";
  import './perfil.scss'

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
        <li class="item" on:keyup={() => {goto('/perfil')}} on:click={() => {goto('/perfil')}}>Perfil</li>
        <li class="item" on:keyup={() => {goto('/perfil/dados')}} on:click={() => {goto('/perfil/dados')}}>Dados Cadastrais</li>
        <li class="item" on:keyup={() => {goto('/perfil/enderecos')}} on:click={() => {goto('/perfil/enderecos')}}>Endereços</li>
        <li class="item" on:keyup={() => {goto('/perfil/pagamento')}} on:click={() => {goto('/perfil/pagamento')}}>Formas de Pagamento</li>
        <li class="item" on:keyup={() => {goto('/perfil/pedidos')}} on:click={() => {goto('/perfil/pedidos')}}>Historico de Pedidos</li>
        {#if $user.cargo == 'Admin'}
          <span class="py-10 text-center font-bold">Funções<br/> Administrativas <br/>↓</span>
          <li class="item" on:keyup={() => {goto('/perfil/admin/pedidos')}} on:click={() => {goto('/perfil/admin/pedidos')}}>Pedidos</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/promocoes')}} on:click={() => {goto('/perfil/admin/promocoes')}}>Promoções</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/produtos')}} on:click={() => {goto('/perfil/admin/produtos')}}>Produtos</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/relatórios')}} on:click={() => {goto('/perfil/admin/relatórios')}}>Relatórios</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/permissoes')}} on:click={() => {goto('/perfil/admin/permissoes')}}>Permissões</li>
          <li class="item" on:keyup={() => {goto('/perfil/admin/usuarios')}} on:click={() => {goto('/perfil/admin/usuarios')}}>Usuarios Administrativos</li>
        {/if}
    </ul>
  </aside>
  <div class="contentWrapper">
    <slot />
  </div>
</div>
