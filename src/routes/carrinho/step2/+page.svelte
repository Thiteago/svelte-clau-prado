<script>
  import { currentStep } from "$lib/js/stores/cart.js";
  import { createNewUser, } from '$lib/js/helpers.js'
  import { temporaryAddress, resume } from '$lib/js/stores/cart.js'
  import { imask } from '@imask/svelte'
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

  $currentStep = 2;
  let response = {}	
  $: user = {}
  const optionsCPF = {
    mask: '000.000.000-00',
    lazy: true
  };

  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: true
  };

  onMount(() => {
    if($resume){
      localStorage.setItem('resume', JSON.stringify($resume))
    }else{
      localStorage.getItem('resume') ? $resume = JSON.parse(localStorage.getItem('resume')) : $resume = {}
    }
  })

  async function handleLogin(){
    goto("/login?carrinho=true")
  }

  async function handleSubmit(){
    if(Object.keys($temporaryAddress).length > 0){
      user = {
        ...user,
        endereco: $temporaryAddress
      }
    }else{
      let endereco = JSON.parse(localStorage.getItem('temporaryAddress')) 
      user = {...user, rua: endereco.rua, numeroRua: endereco.numeroRua, bairro: endereco.bairro, cep: endereco.cep, cidade: endereco.cidade, estado: endereco.estado}
    }
    response = await createNewUser(user)
    $resume = {...$resume, idUser: response[0].id}
    $resume = {...$resume, enderecoDeEntrega: response[1]}
    localStorage.setItem('resume', JSON.stringify($resume))


    if(response.length > 0){
      goto('/carrinho/step3')
    }
  }
</script>

<div class="flex mt-5 justify-center flex-col items-center">
  <div class="flex w-6/12 mt-5 items-center justify-between">
    <div class="flex flex-col gap-2">
      <p class="text-2xl">Já tem uma conta?</p>
      <button on:click={handleLogin} class="btn bg-[#7C3267]">Faça login</button>
    </div>
    <div>
      <p class="text-md font-bold">Não tem uma conta?</p>
      <p>Faça seu cadastro de forma rapida</p>

      <form on:submit={handleSubmit} class="flex flex-col mt-5 flex-wrap">
        <input
          type="text"
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Nome"
          bind:value={user.nome}
        />
        <input
          type="text"
          use:imask={optionsCPF}
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="CPF"
          bind:value={user.cpf}
        />
        <input
          type="text"
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Email"
          bind:value={user.email}
        />
        <input
          type="password"
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Senha"
          bind:value={user.senha}
        />
        <input
          type="password"
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Confirmar senha"
        />
        <input
          type="tel"
          use:imask={optionsCel}
          class="border border-gray-300 rounded-md p-2 mb-2"
          placeholder="Celular"
          bind:value={user.numeroCel}
        />
        <button
          class="bg-[#7C3267] text-white rounded-md p-2 mt-5"
          type="submit"
        >
          Cadastrar 
        </button>
        {#if response.status == 401}
          <p class="text-red-500 text-center">O CPF ou o Email informado <br/>ja esta cadastrado</p>
        {/if}
      </form>
    </div>
  </div>
</div>