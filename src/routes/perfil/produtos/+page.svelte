<script>
  import "./produtos.scss"
  import {imask} from '@imask/svelte'
	import FormUpdate from "$lib/components/formupdate/FormUpdate.svelte";
	import { onMount } from "svelte";

  let files
  let idSelected
  let idDeleteSelected
  let produtos = []
  let selectedProduct
  let today = new Date().toISOString().split('T')[0]

  let nome = ""
  let categoria = ""
  let descricao = ""
  let dataFabricacao = ""
  let quantidade = ""
  let dataDisponibilidade = ""
  let valorAluguel = ""
  let tipo = ""
  let valor = ""
  let altura = ""
  let largura = ""
  let comprimento = ""
  let material = ""
  let peso = ''


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

  const optionsPeso = {
    mask: 'num kg',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.'
      }
    }
  }


  async function handleSubmit(event){
    event.preventDefault()

    let data = new FormData()
    if(files.length != null){
      for(let i = 0; i < files.length; i++){
        data.append('imagens', files[i])
      }
    }

    valor = valor.replace('R$', '')
    valorAluguel = valorAluguel.replace('R$', '')

    data.append('nome', nome)
    data.append('categoria', categoria)
    data.append('descricao', descricao)
    data.append('tipo', tipo)
    data.append('quantidade', quantidade)
    data.append('dataFabricacao', dataFabricacao)
    data.append('altura', altura)
    data.append('largura', largura)
    data.append('comprimento', comprimento)
    data.append('material', material)
    data.append('peso', peso)

    if(tipo == 'Aluguel'){
      data.append('dataDisponibilidade', dataDisponibilidade)
      data.append('valor', valorAluguel)
    }else{
      data.append('valor', valor)
    }

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
          name="nome" placeholder='Ex: Topo de Bolo' type="text" required 
          class="border border-base-300 rounded pl-1 input w-full"
          bind:value={nome}
          />

          <label for="categoria">Categoria</label>
          <select name="categoria"
          id="categoria"
          class="border border-base-300 rounded input w-full"
          required
          bind:value={categoria}
          >
            <option disabled>Selecione uma Categoria</option>
            <option value="Topo de Bolo">Topo de Bolo</option>
            <option value="Painel">Painel</option>
          </select>

          <label for="descricao">Descri????o</label>
          <textarea 
          class="border border-base-300 rounded px-2 py-2 max-h-32 input w-full" 
          name="descricao" 
          id="descricao" 
          placeholder="Insira a descri????o do produto"
          bind:value={descricao}
          required
          />

          <label for="data-fabricacao">Data de Fabricacao</label>
          <input 
          type="date" 
          class="border border-base-300 rounded input w-full"
          max={today}
          name="data-fabricacao"
          bind:value={dataFabricacao}
          required
          />

          <label for="data-fabricacao">Quantidade em Estoque</label>
          <input 
          type="number" 
          min="1"
          max="1000"
          class="border border-base-300 rounded input w-full"
          name="quantidade"
          bind:value={quantidade}
          required
          />

          <label for="tipo">Tipo</label>
          <select 
          name="tipo" 
          class="border border-base-300 rounded input w-full"
          id="tipo"
          bind:value={tipo}
          required
          >
            <option disabled selected>Selecione um tipo</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Venda">Venda</option>
          </select>

          {#if tipo == 'Aluguel'}
            <label for="data-disponibilidaade">Data de disponibilidade</label>
            <input bind:value={dataDisponibilidade} min={today} type="date" class="input input-bordered">

            <label for="valor">Valor (Por dia)</label>
            <input use:imask={optionsValor} name="valor" type="text" placeholder="R$ 00,00" class="input w-full border border-base-300" 
            bind:value={valorAluguel}
            required
            />
          {:else}
            <label for="valor">Valor</label>
            <input use:imask={optionsValor} name="valor" type="text" placeholder="R$ 00,00" class="input w-full border border-base-300" 
            bind:value={valor}
            required
            />
          {/if}



          <label for="valor">Peso</label>
          <input use:imask={optionsPeso} name="peso" type="text" placeholder="0 kg" class="input w-full border border-base-300" 
          bind:value={peso}
          required
          />

          <label for="altura">Altura (Em centimetros)</label>
          <input type="text" name="altura" placeholder="12" class="input input-bordered w-full"
          bind:value={altura}
          required
          />

          <label for="largura">Largura (Em centimetros)</label>
          <input type="text" name="largura" placeholder="12" class="input input-bordered w-full"
          bind:value={largura}
          required
          />

          <label for="comprimento">Comprimento (Em centimetros)</label>
          <input type="text" name="comprimento" placeholder="12" class="input input-bordered w-full"
          bind:value={comprimento}
          required
          />

          <label for="material">Material </label>
          <input type="text" name="material" placeholder="Ex: Feltro, plastico, etc..." class="input input-bordered w-full"
          bind:value={material}
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
          <FormUpdate produto={selectedProduct}/>
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
