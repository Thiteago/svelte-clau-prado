<script>
  import './style.scss'
  import Previousbutton from '$lib/components/previousbutton/Previousbutton.svelte';
  import {createForm} from "svelte-forms-lib"
  import { goto } from '$app/navigation';
  import { api } from '$lib/services/api';

  let email = ''
  let senha = ''

  $: current = "container"
  $: statusAuth = false

  const {form, handleChange, handleSubmit} = createForm({
    initialValues: {
      email: "",
      senha: ""
    },
    onSubmit: values => {
      api.post("/Autenticar", values).then((response) =>{
        if(response.status == 200){
          localStorage.setItem('@Auth:user', JSON.stringify(response.data.user))
          localStorage.setItem('@Auth:token', JSON.stringify(response.data.token))
          goto("/")
        }
      }).catch((error) => {
        if(error.response.status == 401){
          statusAuth = true
        }
      });
    }
  })
</script>

<div class="body">
  <div class={current} id="container">
      <div class="form-container sign-up-container">
          <form class="form" action="#">
              <h1 class="h1">Criar uma Conta</h1>
              <a href={"/registro"}><button class="button">Cadastrar-se</button></a>
          </form>
      </div>
      <div class="form-container sign-in-container">
      <Previousbutton endereco='/' />
          <form on:submit={handleSubmit} class="form" action="#">
              <h1 class="h1">Login</h1>
              <span class="span">acesse sua conta</span>
              <input 
              class="input" type="email" placeholder="Email" 
              on:change={handleChange}
              bind:value={$form.email}
              />
              <input class="input" type="password" placeholder="Senha" 
              on:change={handleChange}
              bind:value={$form.senha}
              />
              {#if statusAuth == true}
                <p style="color: red">Falha na Autenticação</p>
              {/if}
              <a class="a" href="/#">Esqueceu a senha?</a>
              <button class="button">Login</button>
          </form>
      </div>
      <div class="overlay-container">
          <div class="overlay">
              <div class="overlay-panel overlay-left">
                  <h1 class="h1">Ola!</h1>
                  <p class="p">Para realizar o cadastro , clique em Cadastrar!</p>
                  <span style="color: white; padding-bottom: 1rem">Ja possui cadastro?</span>
                  <button on:click={() => current = 'container'} class="ghost button" id="signIn">Login</button>
              </div>
              <div class="overlay-panel overlay-right">
                  <h1 class="h1-registro">Bem-Vindo de Volta!</h1>
                  <p class="p">para acessar sua conta , por favor , informe as seguintes informações.</p>
                  <span style="color: white; padding-bottom: 1rem">ou</span>
                  <button on:click={() => current = "container right-panel-active"} class="ghost button" id="signUp">Cadastrar-se</button>
              </div>
          </div>
      </div>
  </div>
</div>