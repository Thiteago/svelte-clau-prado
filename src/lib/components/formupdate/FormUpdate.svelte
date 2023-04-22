<script>
  import {imask} from '@imask/svelte'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';
  import { fetchProductsById } from '$lib/js/helpers.js'
  export let produto = {}	

  $: resultUpdate = {
    alert:'',
    text: '',
  }
  let today = new Date().toISOString().split('T')[0]
  let files 
  let tipo = produto.tipo
  if(Object.keys(produto).length > 0){
    files = produto.imagens
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

  onMount(() => {
    if(produto.Aluguel != null){
      tipo == 'Aluguel'
    }else if(produto.Venda != null){
      tipo == 'Venda'
    }
  })

  async function handleSubmit(event){
    event.preventDefault()

    let data = new FormData()
    if(files?.length != null && files?.length != undefined){
      for(let i = 0; i < files.length; i++){
        data.append('imagens', files[i])
      }
    }


    data.append('nome', produto.nome)
    data.append('categoria', produto.categoria)
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

    fetch(`${PUBLIC_BACKEND_URL}/Produto/${produto.id}/Alterar`, {
      method: 'PATCH',
      body: data
    }).then(async (response) => {
      if (response.ok) {
        resultUpdate.alert = 'alert-success';
        resultUpdate.text = 'Produto Alterado com sucesso';
        files = [];
        produto = await fetchProductsById(produto.id);
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
  bind:value={produto.categoria}
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