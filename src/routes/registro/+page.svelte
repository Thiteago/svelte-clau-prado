<script>
  import "./registro.scss"
  import { imask } from '@imask/svelte'
  import { BACKEND_URL } from '$env/static/public'
  import Previousbutton from "$lib/components/previousbutton/Previousbutton.svelte";
  import {goto} from '$app/navigation'
  import { validateCPF } from "$lib/js/helpers.js";

  let today = new Date().toISOString().substr(0, 10)
  $: nome = ''
  $: email = ''
  $: dataNascimento = ''
  $: senha = undefined
  $: confirmesenha = undefined
  $: cpf = undefined
  $: rua = ''
  $: numeroRua = ''
  $: bairro = ''
  $: cidade = ''
  $: estado = ''
  $: cep = ''
  $: numeroTel = ''
  $: numeroCel = ''
  $: validateForm = false
  $: validateSenha = true
  $: validateCpf = true

  $: if(cpf != undefined){
    validateCPF(cpf) ? validateCpf = true : validateCpf = false
  }

  $:  if(nome != '' && 
      email != '' && 
      dataNascimento != '' && 
      validateSenha &&
      confirmesenha != '' &&
      confirmesenha != undefined &&
      validateCpf &&
      rua != '' && 
      numeroRua != '' && 
      bairro != '' && 
      cidade != '' && 
      estado != '' && 
      cep != '' && 
      numeroTel != '' && 
      numeroCel != ''){
    validateForm = true
  }else{
    validateForm = false
  }

  $: if(senha != undefined && confirmesenha != undefined){
    if(senha == confirmesenha){
      validateSenha = true
    }else{
      validateSenha = false
    }
  }

  const optionsCPF = {
    mask: '000.000.000-00',
    lazy: true
  };
  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };
  const optionsTel = {
    mask: '(00)0000-0000',
    lazy: true
  };
  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: true
  };
 
  async function handleSubmit(e) {
    e.preventDefault()

    const response = await fetch(`${BACKEND_URL}/NovoUsuario`,{
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
        estado: estado,
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
      <div class="my-3">
        <h1 class="font-bold text-xl">Registre-se</h1>
      </div>
    </div>
    <div class="flex m-auto w-7/12 justify-center">
      <form on:submit={handleSubmit} class='flex w-full py-8 flex-col' action="#">
        <label for="nome" class="label">
          <span class="label-text">Nome</span>
        </label>
        <input
        class="input input-bordered w-full "
        name="nome" placeholder='NOME' type="text" required 
        bind:value={nome}
        />

        <label for="email" class="label">
          <span class="label-text">Email</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="email" placeholder='EMAIL' type="text" required 
        bind:value={email}
        />

        <label for="cpf" class="label">
          <span class="label-text">CPF</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="cpf" placeholder="CPF" required use:imask={optionsCPF}
        bind:value={cpf}
        />
        {#if validateCpf != true}
          <p class="error">CPF inválido</p>
        {/if}

        <label for="rua" class="label">
          <span class="label-text">Rua</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="rua" placeholder='Rua' type="Text" required 
        bind:value={rua}
        />

        <label for="numeroRua" class="label">
          <span class="label-text">Número</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="numeroRua" placeholder='Numero' type="number" required 
        bind:value={numeroRua}
        />

        <label for="bairro" class="label">
          <span class="label-text">Bairro</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="bairro" placeholder='Bairro' type="text" required 
        bind:value={bairro}
        />

        <label for="numeroCel" class="label">
          <span class="label-text">Numero de Celular</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="numeroCel" placeholder='Numero de Celular' type="text" required
        use:imask={optionsCel}
        bind:value={numeroCel}
        />

        <label for="numeroTel" class="label">
          <span class="label-text">Numero de Telefone</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="numeroTel" placeholder='Numero de Telefone' type="text" required
        use:imask={optionsTel}
        bind:value={numeroTel}
        />

        <label for="dataNascimento" class="label">
          <span class="label-text">Data de Nascimento</span>
        </label>
        <input
        class="input input-bordered w-full "
        name="dataNascimento" placeholder="Data de Nascimento" type="date" max={today} required 
        bind:value={dataNascimento}
        />

        <label for="senha" class="label">
          <span class="label-text">Senha</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="senha" placeholder="SENHA" type="password" required 
        bind:value={senha}
        />

        <label for="confirmesenha" class="label">
          <span class="label-text">Confirme a senha</span>
        </label>
        <input
          class="input input-bordered w-full "
          placeholder="CONFIRME A SENHA" type="password" required 
          bind:value={confirmesenha}
        />
        {#if validateSenha != true}
          <p class="error">As senhas inseridas sao diferentes</p>
        {/if}

        <label for="cidade" class="label">
          <span class="label-text">Cidade</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="cidade" placeholder='Cidade' type="text" required 
        bind:value={cidade}
        />

        <label for="estado" class="label">
          <span class="label-text">Estado</span>
        </label>
        <input 
        class="input input-bordered w-full "
        name="estado" placeholder='Estado' type="text" required 
        bind:value={estado}
        />

        <label for="cep" class="label">
          <span class="label-text">CEP</span>
        </label>
        <input 
        class="input input-bordered w-full mb-4"
        name="cep" placeholder='CEP' type="text" required use:imask={optionsCEP}
        bind:value={cep}
        />
        <button disabled={!validateForm} class='submit' type="submit">Registrar</button>
      </form>
    </div>
  </div>
</div>

<style>
  .error{
    color: red;
  }
</style>