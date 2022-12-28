<script>
  import './style.scss'
  import { imask } from '@imask/svelte';
  import {user} from '$lib/stores/login'
  import { api } from '$lib/services/api';
	import { onMount } from 'svelte';
	import { createForm } from 'svelte-forms-lib';

	let data

 
  $: status = ''
  $: localUser = {}
  $: teste = {
      nome: 'ssssssss',
      email: '',
      dataNascimento: '',
      cpf: '',
      numeroCel: '',
  }

  

  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: false
  };

  async function getUserData(){
    let result = await api.get(`/Usuarios/${$user.id}/dados`)
    return result.data
  }

  onMount(async() => {
    localUser = await getUserData()
    let rawData = new Date(localUser.dataNascimento)
    data = rawData.toLocaleDateString('pt-BR')

    $form.nome = $user.nome
    $form.email = $user.email
    $form.cpf = localUser.cpf
    $form.dataNascimento = data
    $form.numeroCel = localUser.numeroCel
  })

  const {form, handleChange, handleSubmit} = createForm({
    initialValues: teste,
    onSubmit: values => {
      api.patch(`/Usuarios/${$user.id}/Alterar`, values).then((response) => {
            if(response.status == 201){
              status = 'sucesso'
            }
        }).catch((error) => {
          if(error.response?.status == 401){
            status = 'falhou'
          }
        })
    }
  })

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
            <fieldset class="fieldset">
                <legend class="legendafield" >Nome Completo *</legend>
                <input class="input-info" readOnly type="text" 
                on:change={handleChange}
                bind:value={$form.nome}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Email / Login *</legend>
                <input class="input-info" type="email" 
                on:change={handleChange}
                bind:value={$form.email}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">CPF *</legend>
                <input class="input-info" readOnly type="text" 
                on:change={handleChange}
                bind:value={$form.cpf}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Data de Nascimento *</legend>
                <input class="input-info" readOnly type="text" 
                on:change={handleChange}
                bind:value={$form.dataNascimento}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Telefone celular *</legend>
                <input class="input-info" type="tel" 
                use:imask={optionsCel}
                on:change={handleChange}
                bind:value={$form.numeroCel}
                />
            </fieldset>
            <button class="btn btn-primary mt-3" type='submit' >Alterar</button>
        </form>
    </div>
  </div>
{/if}