<script>
  import "./registro.scss"
  import { imask } from '@imask/svelte'
  import Previousbutton from "$lib/components/previousbutton/Previousbutton.svelte";
  import {goto} from '$app/navigation'

  let nome = ''
  let email = ''
  let dataNascimento = ''
  let senha = ''
  let cpf = ''
  let rua = ''
  let numeroRua = ''
  let bairro = ''
  let cidade = ''
  let cep = ''
  let numeroTel = ''
  let numeroCel = ''

  

  const optionsCPF = {
    mask: '000.000.000-00',
    lazy: false
  };
  const optionsCEP = {
    mask: '00000-000',
    lazy: false
  };
  const optionsTel = {
    mask: '(00)0000-0000',
    lazy: false
  };
  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: false
  };
 
  async function handleSubmit(e) {
    e.preventDefault()

    const response = await fetch("http://localhost:3333/NovoUsuario",{
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        nome: nome,
        email: email,
        dataNascimento: dataNascimento,
        senha: senha,
        cpf: cpf,
        rua: rua,
        numeroRua: numeroRua.toString(),
        bairro: bairro,
        cidade: cidade,
        cep: cep,
        numeroTel: numeroTel,
        numeroCel: numeroCel
      })
    })
    if(response.status == 201){
      goto("/login")
    }
  }
</script>

<div class="body">
  <div class="container">
      <div class='header'>
          <Previousbutton endereco='/login'/>
          <div class="title">
              <h1>Registre-se</h1>
          </div>
      </div>
      <div class='wrapper-form'>
          <form on:submit={handleSubmit} class='form-subscribe' action="#">
              <input
              name="nome" placeholder='NOME' type="text" required 
              bind:value={nome}
              />
              <input 
              name="email" placeholder='EMAIL' type="text" required 
              bind:value={email}
              />
              <input
              name="dataNascimento" type="date" required 
              bind:value={dataNascimento}
              />
              <input 
              name="senha" placeholder="SENHA" type="password" required 
              bind:value={senha}
              />
              <input 
              name="cpf" placeholder="CPF" required use:imask={optionsCPF}
              bind:value={cpf}
              />
              <input placeholder="CONFIRME A SENHA" type="password" required />
              <input 
              name="rua" placeholder='Rua' type="Text" required 
              bind:value={rua}
              />
              <input 
              name="numeroRua:" placeholder='Numero' type="number" required 
              bind:value={numeroRua}
              />
              <input 
              name="bairro" placeholder='Bairro' type="text" required 
              bind:value={bairro}
              />
              <input 
              name="cidade" placeholder='Cidade' type="text" required 
              bind:value={cidade}
              />
              <input 
              name="cep" placeholder='CEP' type="text" required use:imask={optionsCEP}
              bind:value={cep}
              />
              <input 
              name="numeroTel" placeholder='Numero de Telefone' type="text" use:imask={optionsTel}
              bind:value={numeroTel}
              />
              <input 
              name="numeroCel" placeholder='Numero de Celular' type="text" required
              use:imask={optionsCel}
              bind:value={numeroCel}
              />
              
              <button class='submit' type="submit">Registrar</button>
          </form>
      </div>
  </div>
</div>