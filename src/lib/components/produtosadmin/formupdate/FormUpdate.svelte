<script>
  import {createForm} from "svelte-forms-lib"
  import {imask} from '@imask/svelte'
  export let produto

  let files
  $: result = {
    alert:'',
    text: '',
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
      nome: produto.nome,
      categoria: produto.categoria,
      descricao: produto.descricao,
      dataCriacao: produto.dataCriacao,
      tipo: produto.tipo,
      valor: produto.valor,
      altura: produto.altura,
      largura: produto.largura,
      comprimento: produto.comprimento,
      material: produto.material,
      imagens: produto.imagens,
    },
    onSubmit: values => {
      let data = new FormData()
      

      if(files?.length != null && files?.length != undefined){
        for(let i = 0; i < files.length; i++){
          data.append('imagens', files[i])
        }
      }

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

      fetch(`http://localhost:3333/Produto/${produto.id}/Alterar`,{
      method: 'PATCH',
      body: data
      }).then((response) => {
          if(response.status == 201){
              result.alert  = 'alert-success'
              result.text = 'Produto Alterado com sucesso'
              files = []
          }
      }).catch((error) => {
          if(error.response.status == 500){
            result.alert  = 'alert-error'
            result.text = 'Erro ao Atualizar o produto'
            files = []
          }
      })
    }
  })

  $:{
    $form = produto
  }

</script>

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

  <button type="submit" class="btn mt-3">Alterar</button>

  {#if result.alert != ''}
    <div class="alert {result.alert} shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{result.text}</span>
      </div>
    </div>
  {/if}

</form>