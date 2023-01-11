<script>
import {user, signed, logout} from '$lib/stores/login'
import './style.scss'
import avatar from '$lib/assets/img/avatar-login.png'
import logomin from '$lib/assets/img/logo-clau.png'
import logobig from '$lib/assets/img/logomin.jpg'
import cart from  '$lib/assets/icons/cart2.svg'

export let tamanho = "grande"
let logo

if(tamanho == "grande"){
    logo = logobig
}else if(tamanho == "pequeno"){
    logo = logomin
}

</script>
<header class="main-header">
{#if !$signed}
    <div class="wrapper-logo">
      <img src={logo} alt="logo clau prado"/>
    </div>
    <nav class="nav">
        <a class="main-action" href={"/#"}>Inicio</a>
        <a class="main-action" href={"/produtos"}>Produtos</a>
        <a class="main-action" href={"/mandesuaideia"}>Mande sua Ideia</a>
        <a class="main-action" href={"/sobre"}>Sobre</a>
    </nav>
    
    <div class="cart-container">
      <img src={cart} alt="">
    </div>

    <div class="wrapper-login">
        <a class="main-action -second" href={"/login"}>Login</a>
        <a class="main-action -third" href={"/login"}>ou Cadastre-se</a>
        <img src={avatar} alt="imagem para cadastro" height="105" class="img_avatar"/>
    </div>
{:else}
    <img src={logo} alt="logo clau prado"/>
    <nav class="nav">
        <a class="main-action" href={"/#"}>Inicio</a>
        <a class="main-action" href={"/produtos"}>Produtos</a>
        <a class="main-action" href={"/mandesuaideia"}>Mande sua Ideia</a>
        <a class="main-action" href={"/sobre"}>Sobre</a>
    </nav>
    
    <div class="wrapper-login -logado">
        <a href={"/login"} class="main-action -secondlogado">Ola! <br /> {$user.nome.split(' ')[0]}</a>
        <div class="container-options">
            <a class="sair-btn" href={"/perfil"}>Minha conta</a>
            <a class="sair-btn" href={"/"} on:click={logout}>Sair</a>
        </div>
    </div>
{/if}
</header>