<script>
  import "./style.scss"
  import { imask } from '@imask/svelte'
  import Previousbutton from "$lib/components/previousbutton/Previousbutton.svelte";
  import {createForm} from "svelte-forms-lib"
  import {goto} from '$app/navigation'
  import { api } from "$lib/services/api";

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
 

  const {form, handleChange, handleSubmit} = createForm({
    initialValues: {
      nome: "",
      email: "",
      dataNascimento: "",
      senha: "",
      cpf: "",
      rua: "",
      numeroRua: "",
      bairro: "",
      cidade: "",
      cep: "",
      numeroTel: "",
      numeroCel: ""
    },
    onSubmit: values => {
      values.numeroRua = values.numeroRua.toString()
      api.post("/NovoUsuario", values).then((response) =>{
        if(response.status == 201){
          goto("/login")
        }
      });
    }
  })
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
              on:change={handleChange}
              bind:value={$form.nome}
              />
              <input 
              name="email" placeholder='EMAIL' type="text" required 
              on:change={handleChange}
              bind:value={$form.email}
              />
              <input
              name="dataNascimento" type="date" required 
              on:change={handleChange}
              bind:value={$form.dataNascimento}
              />
              <input 
              name="senha" placeholder="SENHA" type="password" required 
              on:change={handleChange}
              bind:value={$form.senha}
              />
              <input 
              name="cpf" placeholder="CPF" required use:imask={optionsCPF}
              on:change={handleChange}
              bind:value={$form.cpf}
              />
              <input placeholder="CONFIRME A SENHA" type="password" required />
              <input 
              name="rua" placeholder='Rua' type="Text" required 
              on:change={handleChange}
              bind:value={$form.rua}
              />
              <input 
              name="numeroRua:" placeholder='Numero' type="number" required 
              on:change={handleChange}
              bind:value={$form.numeroRua}
              />
              <input 
              name="bairro" placeholder='Bairro' type="text" required 
              on:change={handleChange}
              bind:value={$form.bairro}
              />
              <input 
              name="cidade" placeholder='Cidade' type="text" required 
              on:change={handleChange}
              bind:value={$form.cidade}
              />
              <input 
              name="cep" placeholder='CEP' type="text" required use:imask={optionsCEP}
              on:change={handleChange}
              bind:value={$form.cep}
              />
              <input 
              name="numeroTel" placeholder='Numero de Telefone' type="text" use:imask={optionsTel}
              on:change={handleChange}
              bind:value={$form.numeroTel}
              />
              <input 
              name="numeroCel" placeholder='Numero de Celular' type="text" required
              use:imask={optionsCel}
              on:change={handleChange}
              bind:value={$form.numeroCel}
              />
              
              <button class='submit' type="submit">Registar</button>
          </form>
      </div>
  </div>
</div>