<script>
  import './style.scss'
  import Previousbutton from '$lib/components/previousbutton/Previousbutton.svelte';
  let email = ''
  let senha = ''

  $: current = "container"
  $: message = 'none'

  const {form, handleChange, handleSubmit} = createForm({
    initialValues: {
      email: "",
      senha: "",
    },
    onSubmit: values => {
      api.post("/NovoUsuario", values).then((response) =>{
        console.log(response)
        if(response.status == 201){
          goto("/login")
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
          <form on:submit={handleLogin} class="form" action="#">
              <h1 class="h1">Login</h1>
              <span class="span">acesse sua conta</span>
              <input class="input" bind:value={email} type="email" placeholder="Email" />
              <input class="input" bind:value={senha} type="password" placeholder="Senha" />
              <p style="color: red; display: {message}">Credenciais Inválidas</p>
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