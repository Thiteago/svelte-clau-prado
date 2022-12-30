<script>
  import "./style.scss"
  import {createForm} from "svelte-forms-lib"
  import { api } from "$lib/services/api";
  import { goto } from "$app/navigation";
  import {imask} from '@imask/svelte'

  const optionsValor = {
    mask: 'R$num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.'
      }
    }
  }


  const {form, handleChange, handleSubmit} = createForm({
    initialValues: {
      nome: "",
      categoria: "",
      descricao: "",
      dataFabricacao: "",
      tipo: "",
      valor: "",
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

<div class="content-container">
  <h2 class="text-3xl mb-3">Produtos</h2>

  <div class="flex flex-col gap-2">
    <div class="collapse border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" /> 
      <div class="collapse-title text-xl font-medium">
        Cadastrar
      </div>
      <div class="collapse-content"> 
        <form action="#" class="flex flex-col gap-2 w-full">
          <label for="nome">Nome</label>
          <input
          name="nome" placeholder='Ex: Ciclano Antonio Silva' type="text" required 
          class="border border-base-300 rounded pl-1 input w-full"
          on:change={handleChange}
          bind:value={$form.nome}
          />

          <label for="categoria">Categoria</label>
          <select name="categoria"
          id="categoria"
          class="border border-base-300 rounded input w-full"
          on:change={handleChange}
          bind:value={$form.categoria}
          >
            <option disabled>Selecione uma Categoria</option>
            <option value="Topo de bolo">Topo de Bolo</option>
            <option value="Painel">Painel</option>
          </select>

          <label for="descricao">Descrição</label>
          <textarea 
          class="border border-base-300 rounded pl-1 max-h-32 input w-full" 
          name="descricao" 
          id="descricao" 
          placeholder="Insira a descrição do produto"
          on:change={handleChange}
          bind:value={$form.descricao}
          />

          <label for="data-fabricacao">Data de Fabricacao</label>
          <input 
          type="date" 
          class="border border-base-300 rounded input w-full"
          name="data-fabricacao"
          on:change={handleChange}
          bind:value={$form.dataFabricacao}
          />

          <label for="tipo">Tipo</label>
          <select 
          name="tipo" 
          class="border border-base-300 rounded input w-full"
          id="tipo"
          on:change={handleChange}
          bind:value={$form.tipo}
          >
            <option disabled selected>Selecione um tipo</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Venda">Venda</option>
          </select>

          <label for="valor">Valor</label>
          <input use:imask={optionsValor} name="valor" type="text" placeholder="R$ 00,00" class="input w-full border border-base-300" />

          <label for="altura">Altura (Em centimetros)</label>
          <input type="text" name="altura" placeholder="12" class="input input-bordered w-full"/>
        </form>
      </div>
    </div>
    <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <div class="collapse-title text-xl font-medium">
        Alterar
      </div>
      <div class="collapse-content"> 
        <p>tabindex="0" attribute is necessary to make the div focusable</p>
      </div>
    </div>
    <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
      <div class="collapse-title text-xl font-medium">
        Excluir
      </div>
      <div class="collapse-content"> 
        <p>tabindex="0" attribute is necessary to make the div focusable</p>
      </div>
    </div>
  </div>
</div>
