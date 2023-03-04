<script>
  import "./registro.scss"
  import { imask } from '@imask/svelte'
  import Previousbutton from "$lib/components/previousbutton/Previousbutton.svelte";
  import {goto} from '$app/navigation'
  import { validateCPF } from "$lib/js/helpers.js";

  let nome = ''
  let email = ''
  let dataNascimento = ''
  let senha = ''
  $: cpf = undefined
  let rua = ''
  let numeroRua = ''
  let bairro = ''
  let cidade = ''
  let estado = ''
  let cep = ''
  let numeroTel = ''
  let numeroCel = ''
  $: validateForm = false
  $: validateCpf = false

  $: if(cpf){
    validateCPF(cpf) ? validateCpf = true : validateCpf = false

    console.log(validateCpf)
  }

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
      <form on:submit={handleSubmit} class='flex w-full py-8 flex-col gap-3' action="#">
            <input
            class="input input-bordered w-full "
            name="nome" placeholder='NOME' type="text" required 
            bind:value={nome}
            />
            <input 
            class="input input-bordered w-full "
            name="email" placeholder='EMAIL' type="text" required 
            bind:value={email}
            />
            <input 
            class="input input-bordered w-full "
            name="cpf" placeholder="CPF" required use:imask={optionsCPF}
            bind:value={cpf}
            />
            {#if validateCpf == false}
              <p class="error">CPF inválido</p>
            {/if}

            <input 
            class="input input-bordered w-full "
            name="rua" placeholder='Rua' type="Text" required 
            bind:value={rua}
            />
            <input 
            class="input input-bordered w-full "
            name="numeroRua:" placeholder='Numero' type="number" required 
            bind:value={numeroRua}
            />
            <input 
            class="input input-bordered w-full "
            name="bairro" placeholder='Bairro' type="text" required 
            bind:value={bairro}
            />
            <input 
            class="input input-bordered w-full "
            name="numeroCel" placeholder='Numero de Celular' type="text" required
            use:imask={optionsCel}
            bind:value={numeroCel}
            />
            <input
            class="input input-bordered w-full "
            name="dataNascimento" type="date" required 
            bind:value={dataNascimento}
            />
            <input 
            class="input input-bordered w-full "
            name="senha" placeholder="SENHA" type="password" required 
            bind:value={senha}
            />
            <input
              class="input input-bordered w-full "
              placeholder="CONFIRME A SENHA" type="password" required 
            />

            <input 
            class="input input-bordered w-full "
            name="cidade" placeholder='Cidade' type="text" required 
            bind:value={cidade}
            />
            <input 
            class="input input-bordered w-full "
            name="estado" placeholder='Estado' type="text" required 
            bind:value={estado}
            />
            <input 
            class="input input-bordered w-full "
            name="cep" placeholder='CEP' type="text" required use:imask={optionsCEP}
            bind:value={cep}
            />
            <button disabled class='submit' type="submit">Registrar</button>
      </form>
    </div>
  </div>
</div>