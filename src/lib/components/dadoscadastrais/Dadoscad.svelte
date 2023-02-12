<script>
  import './dadoscad.scss'
  import { imask } from '@imask/svelte';
  import {user} from '$lib/stores/login'
	import { onMount } from 'svelte';

	let data
  $: status = ''
  $: localUser = {}

  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: true
  };

  async function getUserData(){
    let result = await fetch(`http://localhost:3333/Usuarios/${$user.id}/dados`)
    let data = await result.json()
    return data
  }

  onMount(async() => {
    localUser = await getUserData()
    let rawData = new Date(localUser.dataNascimento)
    data = rawData.toLocaleDateString('pt-BR')
  })

  async function handleSubmit(e) {

  }

    // onSubmit: values => {
    //   fetch(`http://localhost:3333/Usuarios/${$user.id}/Alterar`, {
    //     method: 'PATCH',
    //     body: JSON.stringify(values),
    //   }).then((response) => {
    //         if(response.status == 201){
    //           status = 'sucesso'
    //         }
    //     }).catch((error) => {
    //       if(error.response?.status == 401){
    //         status = 'falhou'
    //       }
    //     })


</script>
{#if status == 'sucesso'}
  <div class="alert alert-success shadow-lg">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>Informação atualizada com sucesso!</span>
    </div>
  </div>

{:else if status == 'falhou'}
  <div class="alert alert-error shadow-lg">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>O Email informado ja esta sendo utilizado.</span>
    </div>
  </div>
{/if}

{#if localUser.cpf != '' && localUser.cpf != undefined}
  <div class="dados-container">
    <h1 class="text-3xl">Seus Dados</h1>
    <div class="dados-wrapper">
        <form on:submit={handleSubmit} >
  
              <label for="nome" class="label">
                <span class="label-text">Nome Completo</span>
              </label>
              <input name="nome" type="text" bind:value={localUser.nome} disabled  class="input input-bordered w-full max-w-xs" />

              <label for="email" class="label">
                <span class="label-text">Email / Login</span>
              </label>
              <input name="email" type="text" bind:value={localUser.email} class="input input-bordered w-full max-w-xs" />

              <label for="cpf" class="label">
                <span class="label-text">CPF *</span>
              </label>
              <input name="cpf" type="text" bind:value={localUser.cpf} disabled  class="input input-bordered w-full max-w-xs" />

              <label for="dataNascimento" class="label">
                <span class="label-text">Data de Nascimento *</span>
              </label>
              <input name="dataNascimento" type="text" bind:value={localUser.dataNascimento}  disabled  class="input input-bordered w-full max-w-xs" />

              <label for="dataNascimento" class="label">
                <span class="label-text">Telefone celular</span>
              </label>
              <input name="dataNascimento" type="text" bind:value={localUser.numeroCel} use:imask={optionsCel} class="input input-bordered w-full max-w-xs" />

            <button class="btn btn-primary mt-3" type='submit' >Alterar</button>
        </form>
    </div>
  </div>
{/if}