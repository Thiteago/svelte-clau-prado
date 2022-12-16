<script>
import styled from 'styled-components'
import './style.scss'
import avatar from '$lib/assets/img/avatar-login.png'
import logomin from '$lib/assets/img/logo-clau.png'
import logobig from '$lib/assets/img/logomin.jpg'

export let tamanho = "grande"
let logo

if(tamanho == "grande"){
    logo = logobig
}else if(tamanho == "pequeno"){
    logo = logomin
}

const ContainerOptionsProfile = styled.div`
    display: flex;
    gap: 10px;
    padding-bottom: 10px;
`

const SairBTN = styled.a`
    color: white;
    font-family: 'Viga';

    &:hover{
        color: black
    }
`


</script>


<header class="main-header">
    <img src={logo} alt="logo clau prado"/>
    <nav class="nav">
        <a class="main-action" href={"/#"}>Inicio</a>
        <a class="main-action" href={"/Produtos"}>Produtos</a>
        <a class="main-action" href={"/MandeSuaIdeia"}>Mande sua Ideia</a>
        <a class="main-action" href={"/Sobre"}>Sobre</a>
    </nav>
    
    <div class="wrapper-login">
        <a class="main-action -second" href={"/Login"}>Login</a>
        <a class="main-action -third" href={"/Login"}>ou Cadastre-se</a>
        <img src={avatar} alt="imagem para cadastro" height="105" class="img_avatar"/>
    </div>
</header>