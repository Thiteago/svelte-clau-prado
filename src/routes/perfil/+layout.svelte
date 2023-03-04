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
          <li class="item" on:keyup={() => {goto('/perfil/promocoes')}} on:click={() => {goto('/perfil/promocoes')}}>Promoções</li>
          <li class="item" on:keyup={() => {goto('/perfil/produtos')}} on:click={() => {goto('/perfil/produtos')}}>Produtos</li>
          <li class="item" on:keyup={() => {goto('/perfil/relatórios')}} on:click={() => {goto('/perfil/relatórios')}}>Relatórios</li>
          <li class="item" on:keyup={() => {goto('/perfil/estoque')}} on:click={() => {goto('/perfil/estoque')}}>Estoque</li>
          <li class="item" on:keyup={() => {goto('/perfil/permissoes')}} on:click={() => {goto('/perfil/permissoes')}}>Permissões</li>
          <li class="item" on:keyup={() => {goto('/perfil/usuarios')}} on:click={() => {goto('/perfil/usuarios')}}>Usuarios Administrativos</li>
        {/if}
    </ul>
  </aside>
  <div class="contentWrapper">
    <slot />
  </div>
</div>
