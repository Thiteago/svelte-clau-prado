<script>
  import "./style.scss"
  import {createForm} from "svelte-forms-lib"
  import {imask} from '@imask/svelte'
	import FormUpdate from "./formupdate/FormUpdate.svelte";
	import { onMount } from "svelte";

  let files
  let idSelected
  let idDeleteSelected
  let produtos = []
  let selectedProduct


  $: result = {
    alert:'',
    text: '',
  }
  
  onMount(async () => {
    await getProdutos()
  })

  function deleteProduct(id){
    fetch(`http://localhost:3333/Produto/${id}/Deletar`,{
      method: 'DELETE',
    }).then((response) => {
        if(response.status == 201){
            result.alert  = 'alert-success'
            result.text = 'Produto deletado com sucesso'
            files = []
        }
    }).catch((error) => {
        if(error.response.status == 500){
          result.alert  = 'alert-error'
          result.text = 'Erro ao deletar o produto'
          files = []
        }
    })
  }

  function handleSelectChange(){
    selectedProduct = produtos.find(p => p.id == idSelected)
  }


  async function getProdutos(){
    const response = await fetch('http://localhost:3333/Produto')
    const data = await response.json()

    produtos = await data
  }

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
      dataCriacao: "",
      tipo: "",
      valor: "",
      altura: "",
      largura: "",
      comprimento: "",
      material: "",
      imagens: [],
    },
    onSubmit: values => {
      
      let data = new FormData()

      if(files.length != null){
        for(let i = 0; i < files.length; i++){
          data.append('imagens', files[i])
        }
      }
      
      values.valor = values.valor.replace('R$', '')

      data.append('nome', values.nome)
      data.append('categoria', values.categoria)
      data.append('descricao', values.descricao)
      data.append('dataCriacao', values.dataCriacao)
      data.append('tipo', values.tipo)
      data.append('valor', values.valor)
      data.append('altura', values.altura)
      data.append('largura', values.largura)
      data.append('comprimento', values.comprimento)
      data.append('material', values.material)

      fetch('http://localhost:3333/Produto/Cadastrar',{
      method: 'POST',
      body: data
      }).then((response) => {
          if(response.status == 201){
              result.alert  = 'alert-success'
              result.text = 'Produto cadastrado com sucesso'
              files = []
          }
      }).catch((error) => {
          if(error.response.status == 500){
            result.alert  = 'alert-error'
            result.text = 'Erro ao cadastrar o produto'
            files = []
          }
      })
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
        <form enctype="multipart/form-data" on:submit={handleSubmit} class="flex flex-col gap-2 w-full">
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
          required
          on:change={handleChange}
          bind:value={$form.categoria}
          >
            <option disabled>Selecione uma Categoria</option>
            <option value="Topo de Bolo">Topo de Bolo</option>
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
          required
          />

          <label for="data-fabricacao">Data de Fabricacao</label>
          <input 
          type="date" 
          class="border border-base-300 rounded input w-full"
          name="data-fabricacao"
          on:change={handleChange}
          bind:value={$form.dataCriacao}
          required
          />

          <label for="tipo">Tipo</label>
          <select 
          name="tipo" 
          class="border border-base-300 rounded input w-full"
          id="tipo"
          on:change={handleChange}
          bind:value={$form.tipo}
          required
          >
            <option disabled selected>Selecione um tipo</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Venda">Venda</option>
          </select>

          <label for="valor">Valor</label>
          <input use:imask={optionsValor} name="valor" type="text" placeholder="R$ 00,00" class="input w-full border border-base-300" 
          on:change={handleChange}
          bind:value={$form.valor}
          required
          />

          <label for="altura">Altura (Em centimetros)</label>
          <input type="text" name="altura" placeholder="12" class="input input-bordered w-full"
          on:change={handleChange}
          bind:value={$form.altura}
          required
          />

          <label for="largura">Largura (Em centimetros)</label>
          <input type="text" name="largura" placeholder="12" class="input input-bordered w-full"
          on:change={handleChange}
          bind:value={$form.largura}
          required
          />

          <label for="comprimento">Comprimento (Em centimetros)</label>
          <input type="text" name="comprimento" placeholder="12" class="input input-bordered w-full"
          on:change={handleChange}
          bind:value={$form.comprimento}
          required
          />

          <label for="material">Material </label>
          <input type="text" name="material" placeholder="Ex: Feltro, plastico, etc..." class="input input-bordered w-full"
          on:change={handleChange}
          bind:value={$form.material}
          required
          />

          <label for="imagens">Imagens</label>
          <input bind:files accept="image/png, image/jpeg" name='imagens' type="file" class="file-input file-input-bordered w-full max-w-xs" multiple/>

          <button type="submit" class="btn mt-3">Cadastrar</button>

          {#if result.alert != ''}
            <div class="alert {result.alert} shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{result.text}</span>
              </div>
            </div>
          {/if}

        </form>
      </div>
    </div>
    <div class="collapse border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" /> 
      <div class="collapse-title text-xl font-medium">
        Alterar
      </div>
      <div class="collapse-content w-full"> 
        <select bind:value={idSelected} on:change={handleSelectChange} class="select select-bordered w-full">
          <option disabled selected>Selecione um Produto</option>
          {#if produtos.length !=  0}
            {#each produtos as produto}
              <option value={produto.id}>{produto.nome}</option>
            {/each}
          {/if}
        </select>

        {#if selectedProduct != undefined}
          <FormUpdate bind:produto={selectedProduct}/>
        {/if}
      </div>
    </div>
    <div class="collapse border border-base-300 bg-base-100 rounded-box">
      <input type="checkbox" /> 
      <div class="collapse-title text-xl font-medium">
        Excluir
      </div>
      <div class="collapse-content flex-col flex"> 
        <select on:click={getProdutos} bind:value={idDeleteSelected} class="select select-bordered w-full" name="delete" id="delete">
          {#if produtos.length !=  0}
            {#each produtos as produto}
              <option value={produto.id}>{produto.nome}</option>
            {/each}
          {/if}
        </select>
        <button on:click={() => deleteProduct(idDeleteSelected)} class="btn btn-primary w-20 mt-2">Excluir</button>

        {#if result.alert != ''}
            <div class="alert {result.alert} shadow-lg">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{result.text}</span>
              </div>
            </div>
          {/if}
      </div>
    </div>
  </div>
</div>
