<script>
import {user, signed, logout} from '$lib/js/stores/login.js'
import { fade } from 'svelte/transition';
import { page } from '$app/stores';
import {cart} from '$lib/js/stores/cart.js'
import trash from '$lib/assets/icons/trash-icon.svg' 
import {browser} from '$app/environment'
import { Hamburger } from 'svelte-hamburgers'
import './header.scss'
import avatar from '$lib/assets/img/avatar-login.png'
import logobig from '$lib/assets/img/logo-clau.png'
import logomin from '$lib/assets/img/logomin.jpg'
import carts from  '$lib/assets/icons/cart2.svg'
import { onMount } from 'svelte';


let currentRoute;
$: tamanho = 'grande'
let carrinhoAtivo = false
let open
let logo = logobig



onMount(() => {
  if(browser){
    currentRoute = window.location.pathname;
  }

  function handleResize(){
    let windowWidth = window.innerWidth

    if(windowWidth <= 768){
      tamanho = 'pequeno'
      logo = logomin
    }else{
      tamanho = 'grande'
      logo = logobig
    }
  }

  window.addEventListener('resize', handleResize);
});


function  handleRemoveItem(id){
  cart.update((cart) => {
    return cart.filter((item) => item.id != id)
  })
}

</script>
<header class="main-header">
  <div class="container-left-content">
    <div class="wrapper-logo {tamanho == "grande" ? "" : "-pequeno"}">
      <img class="{tamanho == "grande" ? "" : "-pequeno"}" src={logo} alt="logo clau prado"/>
    </div>
    <nav class="nav">
      <a class="main-action" href={"/#"}>Inicio</a>
      <a class="main-action" href={"/produtos"}>Produtos</a>
      <a class="main-action" href={"/sobre"}>Sobre</a>
    </nav>
  </div>

  <div class="container-right-content">
    <div class="cart-container">
      {#if $page.url.pathname != "/carrinho"}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <img on:click={() => carrinhoAtivo == true ? carrinhoAtivo = false : carrinhoAtivo = true} src={carts} alt="">
        <span class="cart-label">{$cart.length > 0 ? `${$cart.length}` : ''} {$cart.length > 1 ? ` Itens  no carrinho` : $cart.length == 0 ? 'Nenhum item no carrinho' : ` Item no carrinho`}</span>
      {/if}
    </div>
    {#if carrinhoAtivo == true}
      <div class="cart-preview-container">
        <h2 class="title">Alguns produtos no seu carrinho</h2>
        <div class="wrapper-products">
          {#if $cart.length > 0}
            {#each $cart as produto}
              <div class="produto">
                <div class="produto-info">
                  <h3>{produto.nome}</h3>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <span on:click={handleRemoveItem(produto.id)} class="trash"><img width="25" height="25" src={trash} alt="icone de lata de lixo"></span>
                </div>
              </div>
            {/each}
          {:else}
            <div class="text-center mt-2">
              <h3 class="cart-label">Nenhum produto no carrinho</h3>
            </div>
          {/if}
          <div class="wrapper-button-cart">
            <a href="/carrinho">Ir para carrinho</a>
          </div>
        </div>
      </div>
    {/if}

    <div class="hamburguer">
      <Hamburger bind:open />
    </div>
    {#if open}
      <div transition:fade class="menu-container">
        <ul class="menu rounded-lg bg-base-100 w-full">
          <li><a class={currentRoute == '/' ? 'ativo' : ''} href="/">Inicio</a></li>
          <li><a class={currentRoute == '/produtos' ? 'ativo' : ''} href="/produtos">Produtos</a></li>
          <li><a class={currentRoute == '/sobre' ? 'ativo' : ''} href="/sobre">Sobre</a></li>
        </ul>
      </div>
    {/if}
    {#if $signed == false}
      <div class="wrapper-login">
        <a class="main-action -second" href={"/login"}>Login</a>
        <a class="main-action -third" href={"/login"}>ou Cadastre-se</a>
        <img src={avatar} alt="imagem para cadastro" height="105" class="img_avatar"/>
      </div>
    {:else}
      <div class="wrapper-login -logado">
        <a href='/perfil' class="main-action -secondlogado">Ola! <br /> {$user.nome.split(' ')[0]}</a>
        <div class="container-options">
          <a class="sair-btn" href={"/perfil"}>Minha conta</a>
          <a class="sair-btn" href={"/"} on:click={logout}>Sair</a>
        </div>
      </div>
    {/if}
  </div>
</header>