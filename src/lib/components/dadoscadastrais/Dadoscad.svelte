<script>
  import './style.scss'
  import { imask } from '@imask/svelte';
  import {user} from '$lib/stores/login'
  import { api } from '$lib/services/api';
	import { onMount } from 'svelte';
	import { createForm } from 'svelte-forms-lib';
	
  $: localUser = {
    cpf: '',
    dataNascimento: '',
    numeroCel: ''
  }
  let data

  const optionsCel = {
    mask: '(00)00000-0000',
    lazy: false
  };

  async function getUserData(){
    let result = await api.get(`/Usuarios/${$user.id}/dados`)
    return result.data
  }

  onMount(async() => {
    console.log('oi')
    localUser = await getUserData()
    console.log(localUser)
    let rawData = new Date(localUser.dataNascimento)
    data = rawData.toLocaleDateString('pt-BR')
  })

  const {form, handleChange, handleSubmit} = createForm({
    initialValues: {
      nome: "",
      email: "",
      dataNascimento: "",
      cpf: "",
      numeroCel: ""
    },
    onSubmit: values => {
      api.patch(`/Usuarios/${$user.id}/Alterar`, values).then((response) => {
            if(response.status == 201){
                alert("Dados alterados com sucesso!")
            }
        }).catch((error) => {
          console.log(error)
        })
    }
  })
</script>

{#if localUser.cpf != '' && localUser.cpf != undefined}
  <div class="dados-container">
    <h1 class="text-3xl">Seus Dados</h1>
    <div class="dados-wrapper">
        <form on:submit={handleSubmit} >
            <fieldset class="fieldset">
                <legend class="legendafield" >Nome Completo *</legend>
                <input class="input-info" readOnly type="text" placeholder={$user.nome}
                on:change={handleChange}
                bind:value={$form.nome}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Email / Login *</legend>
                <input class="input-info" type="email" placeholder={$user.email}
                on:change={handleChange}
                bind:value={$form.email}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">CPF *</legend>
                <input class="input-info" readOnly type="text" placeholder={localUser.cpf} 
                on:change={handleChange}
                bind:value={$form.cpf}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Data de Nascimento *</legend>
                <input class="input-info" readOnly type="text" placeholder={data}
                on:change={handleChange}
                bind:value={$form.dataNascimento}
                />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Telefone celular *</legend>
                <input class="input-info" type="tel" placeholder={localUser.numeroCel}
                on:change={handleChange}
                bind:value={$form.numeroCel}
                />
            </fieldset>
            <button class="btn btn-primary mt-3" type='submit' >Alterar</button>
        </form>
    </div>
  </div>
{/if}