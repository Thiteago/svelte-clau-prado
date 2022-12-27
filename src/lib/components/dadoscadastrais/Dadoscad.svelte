<script>
  import './style.scss'
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

  async function getUserData(){
    let result = await api.get(`/Usuarios/${$user.id}/dados`)
    return result.data
  }

  onMount(async() => {
    localUser = await getUserData()
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
      api.post("/NovoUsuario", values).then((response) =>{
        if(response.status == 201){
          
        }
      });
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
                <input class="input-info" readOnly type="text" placeholder={$user.nome}/>
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Email / Login *</legend>
                <input class="input-info" type="text" placeholder={$user.email}/>
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">CPF *</legend>
                <input class="input-info" readOnly type="text" placeholder={localUser.cpf} />
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Data de Nascimento *</legend>
                <input class="input-info" readOnly type="text" placeholder={data}/>
            </fieldset>
            <fieldset class="fieldset">
                <legend class="legendafield">Telefone celular *</legend>
                <input class="input-info" type="text" placeholder={localUser.numeroCel}/>
            </fieldset>
            <button class="btn btn-primary mt-3" type='submit' >Alterar</button>
        </form>
    </div>
  </div>
{/if}