<script>
  import {imask} from '@imask/svelte'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';
  import { fetchProductsById } from '$lib/js/helpers.js'
  import { createEventDispatcher } from 'svelte';
  export let produto = {}	

  const dispatch = createEventDispatcher();

  $: resultUpdate = {
    alert:'',
    text: '',
  }

  let categorias = []
  let today = new Date().toISOString().split('T')[0]
  let files 
  let novo_personalizavel
  let personalizaveis = []
  let tipo = produto.tipo
  if(Object.keys(produto).length > 0){
    files = produto.imagens
  }

  $: if(produto){
    if(produto.Aluguel != null){
      tipo == 'Aluguel'
      personalizaveis = produto.Aluguel[0].produto_mudanca.map(p => p.nome)
    }else if(produto.Venda != null){
      tipo == 'Venda'
      personalizaveis = produto.Venda[0].produto_mudanca.map(p => p.nome)
    }
  }

  let formatedDatadeCriacao = new Date(produto.dataFabricacao).toISOString().split('T')[0]

  const optionsValor = {
    mask: 'R$num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: '.'
      }
    }
  }

  onMount(async () => {
    categorias = await fetchCategorias()
    if(produto.Aluguel != null){
      tipo == 'Aluguel'
      personalizaveis = produto.Aluguel[0].produto_mudanca.map(p => p.nome)
    }else if(produto.Venda != null){
      tipo == 'Venda'
      personalizaveis = produto.Venda[0].produto_mudanca.map(p => p.nome)
    }
  })

  async function fetchCategorias(){
    const response = await fetch(`${PUBLIC_BACKEND_URL}/categoria/listar`)
    const data = await response.json()
    return data
  }

  function adicionarPersonalizavel(item){
    personalizaveis = [...personalizaveis, item]
  }

  function removerPersonalizavel(item){
    personalizaveis = personalizaveis.filter(p => p != item)
  }

  async function handleSubmit(event){
    event.preventDefault()

    let data = new FormData()
    if(files?.length != null && files?.length != undefined){
      for(let i = 0; i < files.length; i++){
        data.append('imagens', files[i])
      }
    }

    data.append('nome', produto.nome)
    data.append('categoria', produto.Categorias.id)
    data.append('descricao', produto.descricao)
    data.append('dataFabricacao', formatedDatadeCriacao)
    data.append('quantidade', produto.quantidadeEmEstoque)
    data.append('tipo', tipo)
    data.append('valor', produto.valor)
    data.append('peso', produto.peso)
    data.append('altura', produto.altura)
    data.append('largura', produto.largura)
    data.append('comprimento', produto.comprimento)
    data.append('material', produto.material)
    if(personalizaveis.length > 0){
      personalizaveis.forEach((item) => {
        data.append('personalizaveis[]', item);
      });
    }   

    fetch(`${PUBLIC_BACKEND_URL}/Produto/${produto.id}/Alterar`, {
      method: 'PATCH',
      body: data
    }).then(async (response) => {
      if (response.ok) {
        resultUpdate.alert = 'alert-success';
        resultUpdate.text = 'Produto Alterado com sucesso';
        files = [];
        produto = await fetchProductsById(produto.id);
        dispatch('updated', { 
        });
        
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }).catch((error) => {
      console.error(error);
      resultUpdate.alert = 'alert-error';
      resultUpdate.text = 'Erro ao Atualizar o produto';
      files = [];
    });

  }

</script>

<form enctype="multipart/form-data" on:submit={handleSubmit} class="flex flex-col gap-2 w-full">
  <label for="nome">Nome</label>
  <input
  name="nome" placeholder='Ex: Ciclano Antonio Silva' type="text" required 
  class="border border-base-300 rounded pl-1 input w-full"
  bind:value={produto.nome}
  />

  <label for="categoria">Categoria</label>
  <select name="categoria"
  id="categoria"
  class="border border-base-300 rounded input w-full"
  required
  bind:value={produto.Categorias.id}
  >
    <option disabled>Selecione uma Categoria</option>
    {#each categorias as categoria}
      <option value={categoria.id}>{categoria.nome}</option>
    {/each}
  </select>

  <label for="descricao">Descrição</label>
  <textarea 
  class="border border-base-300 rounded pl-1 max-h-32 input w-full" 
  name="descricao" 
  id="descricao" 
  placeholder="Insira a descrição do produto"
  bind:value={produto.descricao}
  required
  />

  <label for="data-fabricacao">Data de Fabricacao</label>
  <input 
  type="date" 
  class="border border-base-300 rounded input w-full"
  name="data-fabricacao"
  max={today}
  bind:value={formatedDatadeCriacao}
  required
  />

  <label for="data-fabricacao">Quantidade em Estoque</label>
  <input 
  type="number" 
  min="1"
  max="1000"
  class="border border-base-300 rounded input w-full"
  name="quantidade"
  bind:value={produto.quantidadeEmEstoque}
  required
  />

  <label for="tipo">Tipo</label>
  <select 
  name="tipoUpdate" 
  class="border border-base-300 rounded input w-full"
  id="tipoUpdate"
  bind:value={tipo}
  required
  >
    <option disabled>Selecione um tipo</option>
    <option value="Aluguel">Aluguel</option>
    <option value="Venda">Venda</option>
  </select>

  <label for="valor">Valor {tipo == 'Aluguel' ? '(Por dia)' : ''}</label>
  <input use:imask={optionsValor} name="valor" type="text" placeholder="R$ 00,00" class="input w-full border border-base-300" 
  bind:value={produto.valor}
  required
  />

  <label for="peso">Peso (Em quilogramas)</label>
  <input type="text" name="peso" placeholder="12" class="input input-bordered w-full"
  bind:value={produto.peso}
  required
  />

  <label for="altura">Altura (Em centimetros)</label>
  <input type="text" name="altura" placeholder="12" class="input input-bordered w-full"
  bind:value={produto.altura}
  required
  />

  <label for="largura">Largura (Em centimetros)</label>
  <input type="text" name="largura" placeholder="12" class="input input-bordered w-full"
  bind:value={produto.largura}
  required
  />

  <label for="comprimento">Comprimento (Em centimetros)</label>
  <input type="text" name="comprimento" placeholder="12" class="input input-bordered w-full"
  bind:value={produto.comprimento}
  required
  />

  <label for="material">Material </label>
  <input type="text" name="material" placeholder="Ex: Feltro, plastico, etc..." class="input input-bordered w-full"
  bind:value={produto.material}
  required
  />

  <label for="imagens">Imagens</label>
  <input bind:files accept="image/png, image/jpeg" name='imagens' type="file" class="file-input file-input-bordered w-full max-w-xs" multiple/>

  <p>Insira abaixo o que pode ser personalizável no produto: (Ex: Idade, Nome, etc ...)</p>
  <div class="flex flex-col justify-center gap-2">
    {#each personalizaveis as item}
      <div class="flex items-center">
        <span class="font-bold bg-[#3D4451] rounded-lg text-white p-2">{item}</span>
        <button type="button" class="btn btn-error btn-sm ml-2" on:click={() => removerPersonalizavel(item)}>-</button>
      </div>
    {/each}
  </div>
  <div class="flex gap-1 items-center">
    <input type="text" bind:value={novo_personalizavel} class="input input-bordered w-full max-w-xs"
    />
    <button on:click={adicionarPersonalizavel(novo_personalizavel)} class="btn" type="button">Adicionar</button>
    
  </div>

  <button type="submit" class="btn mt-3">Alterar</button>

  {#if resultUpdate.alert != ''}
    <div class="alert {resultUpdate.alert} shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{resultUpdate.text}</span>
      </div>
    </div>
  {/if}

</form>