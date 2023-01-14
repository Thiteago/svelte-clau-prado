<script>
import {user, signed, logout} from '$lib/stores/login'
import { page } from '$app/stores';
import {cart} from '$lib/stores/cart.js'
import './style.scss'
import avatar from '$lib/assets/img/avatar-login.png'
import logobig from '$lib/assets/img/logo-clau.png'
import logomin from '$lib/assets/img/logomin.jpg'
import carts from  '$lib/assets/icons/cart2.svg'

export let tamanho = "grande"
let logo
let carrinhoAtivo = false

if(tamanho == "grande"){
    logo = logobig
}else if(tamanho == "pequeno"){
    logo = logomin
}

</script>
<header class="main-header">
{#if !$signed}
    <div class="container-left-content">
        <div class="wrapper-logo {tamanho == "grande" ? "" : "-pequeno"}">
        <img src={logo} alt="logo clau prado"/>
        </div>
        <nav class="nav">
            <a class="main-action" href={"/#"}>Inicio</a>
            <a class="main-action" href={"/produtos"}>Produtos</a>
            <a class="main-action" href={"/mandesuaideia"}>Mande sua Ideia</a>
            <a class="main-action" href={"/sobre"}>Sobre</a>
        </nav>
    </div>
    

    <div class="container-right-content">
        <div class="cart-container">
            {#if $page.url.pathname != "/carrinho"}
                <img on:click={() => carrinhoAtivo == true ? carrinhoAtivo = false : carrinhoAtivo = true} src={carts} alt="">
                <span>{$cart.length} itens no carrinho</span>
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
                                    <div class="adicional-info-wrapper">
                                        <span>Quantidade: 1</span>
                                        <span>R$ {produto.valor}</span>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="text-center mt-2">
                            <h3>Nenhum produto no carrinho</h3>
                        </div>
                    {/if}
                    <div class="wrapper-button-cart">
                        <a href="/carrinho">Ir para carrinho</a>
                    </div>
                </div>
            </div>
        {/if}
        <div class="wrapper-login">
            <a class="main-action -second" href={"/login"}>Login</a>
            <a class="main-action -third" href={"/login"}>ou Cadastre-se</a>
            <img src={avatar} alt="imagem para cadastro" height="105" class="img_avatar"/>
        </div>
    </div>
{:else}
    <div class="container-left-content">
        <div class="wrapper-logo {tamanho == "grande" ? "" : "-pequeno"}">
        <img src={logo} alt="logo clau prado"/>
        </div>
        <nav class="nav">
            <a class="main-action" href={"/#"}>Inicio</a>
            <a class="main-action" href={"/produtos"}>Produtos</a>
            <a class="main-action" href={"/mandesuaideia"}>Mande sua Ideia</a>
            <a class="main-action" href={"/sobre"}>Sobre</a>
        </nav>
    </div>

    <div class="container-right-content">
        <div class="cart-container">
            {#if $page.url.pathname != "/carrinho"}
                <img on:click={() => carrinhoAtivo == true ? carrinhoAtivo = false : carrinhoAtivo = true} src={carts} alt="">
                <span>{$cart.length} itens no carrinho</span>
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
                                    <div class="adicional-info-wrapper">
                                        <span>Quantidade: 1</span>
                                        <span>R$ {produto.valor}</span>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    {:else}
                        <div class="text-center mt-2">
                            <h3>Nenhum produto no carrinho</h3>
                        </div>
                    {/if}
                    <div class="wrapper-button-cart">
                        <a href="/carrinho">Ir para carrinho</a>
                    </div>
                </div>
            </div>
        {/if}
        <div class="wrapper-login -logado">
            <a href={"/login"} class="main-action -secondlogado">Ola! <br /> {$user.nome.split(' ')[0]}</a>
            <div class="container-options">
                <a class="sair-btn" href={"/perfil"}>Minha conta</a>
                <a class="sair-btn" href={"/"} on:click={logout}>Sair</a>
            </div>
        </div>
    </div>
{/if}
</header>