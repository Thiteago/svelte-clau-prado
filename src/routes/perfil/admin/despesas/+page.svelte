<script>
  import {imask} from '@imask/svelte'
  import { DateTime } from "luxon";
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import deleteIcon from '$lib/assets/icons/delete.svg'
  import editIcon from '$lib/assets/icons/edit.svg'


  $: selectedMonth = ''
  $: selectedDay = ''
  $: actualDespesas = []
  $: valorTotalDespesas = 0
  $: valorTotalRecorrentes = 0
  $: quantidadeDespesas = 0
  $: tipoMaisRecorrente = ''
  $: quantidadeRecorrentes = 0
  $: willSelectDate = false
  $: willEditDespesa = false
  $: selectedItems = []

  let flashMessage = {
    message: '',
    type: ''
  }

  $: if(selectedDay || selectedMonth){
    if(selectedDay && selectedMonth){
      fetchDespesas(selectedMonth, selectedDay)
    }else if(selectedMonth){
      fetchDespesas(selectedMonth)
    }
  }

  $: if(selectedItems.length == 0){
    willEditDespesa = false
  }


  const year = new Date().getFullYear();
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                21,22,23,24,25,26,27,28,29,30,31]
  let willAddDespesa = false
  let today = DateTime.local()
  let recorrente = false

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
    await fetchDespesas()
  })

  function handleFlashMessages(type, message){
    flashMessage = {
      message: message,
      type: type
    }
    setTimeout(() => {
      flashMessage = {
        message: '',
        type: ''
      }
    }, 10000)
  }

  async function fetchDespesas(mes, dia){
    if(mes && mes.length == 2 && mes[0] == 0){
      mes = mes[1]
    }
    const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/listar?${mes ? `mes=${mes}` : ''}${dia ? `&dia=${dia}` : ''}`)
    try{
      const data = await response.json()
      if(mes || dia){
        selectedDay = dia
        selectedMonth = mes
      }else{
        selectedDay = today.day
        selectedMonth = today.month
      }

      if(data.length > 0){
        actualDespesas = data
        actualDespesas.forEach(despesa => {
          despesa.data = DateTime.fromISO(despesa.data).toFormat('dd/MM/yyyy')
        })
        valorTotalDespesas = data.reduce((acc, despesa) => acc + despesa.valor, 0)
        quantidadeDespesas = data.length
        valorTotalRecorrentes = data.filter(despesa => despesa.recorrente).reduce((acc, despesa) => acc + despesa.valor, 0)
        quantidadeRecorrentes = data.filter(despesa => despesa.recorrente).length
        let quantidadeTipos = data.reduce((acc, obj) => {
            const tipo = obj.tipoDespesa;
            if (!acc[tipo]) {
              acc[tipo] = 0;
            }
            acc[tipo]++;
            return acc;
          }, {});
        const entries = Object.entries(quantidadeTipos);
        tipoMaisRecorrente = entries.reduce((a, e) => e[1] > a[1] ? e : a)[0];
      }else{
        actualDespesas = []
        valorTotalDespesas = 0
        quantidadeDespesas = 0
        valorTotalRecorrentes = 0
        quantidadeRecorrentes = 0
        tipoMaisRecorrente = ''
      }
    
    }catch(err){
      console.log(err)
      throw new Error(err)
    }
  }

  async function handleCreateDespesa(e){
    let object = {
      valor: e.target.elements.valor.value,
      descricao: e.target.elements.descricao.value,
      tipo: e.target.elements.tipo.value,
      recorrente: e.target.elements.recorrente.value
    }

    if(e.target.elements.tiporecorrencia != undefined){
      object = {...object, tipoRecorrencia: e.target.elements.tiporecorrencia.value}
    }
    if(e.target.elements.data != undefined){
      object = {...object, data: e.target.elements.data.value}
    }
  
    const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        object
      )
    })
    try{
      if(object.hasOwnProperty('data')){
        await fetchDespesas(object.data.split('-')[1], object.data.split('-')[2])
      }else{
        await fetchDespesas(selectedMonth, selectedDay)
      }

      if(response.status == 201){
        handleFlashMessages('success', 'Despesa cadastrada com sucesso!')
      }
    }catch(err){
      console.log(err)
      handleFlashMessages('error', 'Erro ao cadastrar despesa!')
    }
  }

  async function handleDeleteDespesa(){
    try{
      const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/deletar`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedItems)        
      })
        if(response.status == 201){
          selectedItems = []
          handleFlashMessages('success', 'Despesa(s) deletada(s) com sucesso!')
          await fetchDespesas(selectedMonth, selectedDay)
        }
    }catch(err){
      console.log(err)
      handleFlashMessages('error', 'Erro ao deletar despesa(s)!')
      throw new Error(err)
    }
  }

  async function handleEditDespesa(e, id){
    let object = {
      valor: e.target.elements.valor.value,
      descricao: e.target.elements.descricao.value,
      tipo: e.target.elements.tipo.value,
      recorrente: e.target.elements.recorrente.value
    }

    if(e.target.elements.tiporecorrencia != undefined){
      object = {...object, tipoRecorrencia: e.target.elements.tiporecorrencia.value}
    }
    if(e.target.elements.data != undefined){
      object = {...object, data: e.target.elements.data.value}
    }
  
    const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/editar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        object
      )
    })
    try{
      if(object.hasOwnProperty('data')){
        await fetchDespesas(object.data.split('-')[1], object.data.split('-')[2])
        selectedItems = []
      }else{
        await fetchDespesas(today.month, today.day)
        selectedItems = []
      }
      if(response.status == 201){
        handleFlashMessages('success', 'Despesa alterada com sucesso!')
      }
    }catch(err){
      console.log(err)
      handleFlashMessages('error', 'Erro ao alterar despesa!')
    }
  }

  function selectAll(){
    if(selectedItems.length == actualDespesas.length){
      selectedItems = []
    }else{
      selectedItems = actualDespesas
    }
  }

</script>

<section class="flex w-full">
  <div class="w-3/4 pr-5">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="font-italic text-3xl">Despesas</h1>
        <p>Veja suas despesas e adicione novas despesas! 🥹</p>
      </div>
      <div class="font-bold text-4xl">
        {year}
      </div>
    </div>
    <div class="flex flex-col w-full gap-2 my-5 items-center justify-center">
      <div class="flex gap-2 justify-center 4xl:gap-12 w-full bg-[#7c3267] px-1 meses-container rounded-lg py-1"> <!--Meses-->
        {#each months as month, i}
          <button on:click={() => {selectedMonth = i+1; selectedDay = undefined}} class="text-white {i+1 == selectedMonth ? 'selecionado' : ''}">{month}</button>
        {/each}
      </div>
      <div class="flex justify-center gap-0.5 4xl:gap-6 w-full bg-[#7c3267] px-2 dias-container rounded-lg py-1"><!-- Dias -->
        {#each days as day}
          <button on:click={() => {selectedDay = day}} class="text-white {day == selectedDay ? 'selecionado' : ''}">{day}</button>
        {/each}
      </div>
    </div>
    <div class="flex mb-2 justify-evenly">
      <div class="text-center">
        <span class="font-bold text-4xl">R${valorTotalDespesas}</span>
        <p>Valor total de Despesas</p>
      </div>
      <div class="text-center">
        <span class="font-bold text-4xl">{quantidadeDespesas}</span>
        <p>Quantidade de Despesas</p>
      </div>
      <div class="text-center">
        <span class="font-bold text-4xl">R${valorTotalRecorrentes}</span>
        <p>Valor total de Recorrentes</p>
      </div>
      <div class="text-center">
        <span class="font-bold text-4xl">{quantidadeRecorrentes}</span>
        <p>Quantidade de Recorrentes</p>
      </div>
      <div class="text-center">
        <span class="font-bold text-4xl">{tipoMaisRecorrente == '' ? '-' : tipoMaisRecorrente}</span>
        <p>Tipo de despesa mais usada</p>
      </div>
    </div>
    <table class="table w-full">
      <thead>
        <tr class="text-center">
          <th>
            <label class="flex justify-center">
              <input type="checkbox" class="checkbox" on:click={selectAll} />
            </label>
          </th>
          <th class="px-4 py-2">Valor</th>
          <th class="px-4 py-2">Descrição</th>
          <th class="px-4 py-2">Tipo</th>
          <th class="px-4 py-2">Recorrente</th>
          <th class="px-4 py-2">Tipo de recorrência</th>
          <th class="px-4 py-2">Data</th>
        </tr>
      </thead>
      <tbody>
        {#each actualDespesas as item}
          <tr class="text-center">
            <td class="border px-4 py-2">
              <label>
                <input bind:group={selectedItems} type="checkbox" class="checkbox" value={item}/>
              </label>
            </td>
            <td class="border px-4 py-2">R$ {item.valor}</td>
            <td class="border px-4 py-2">{item.descricao}</td>
            <td class="border px-4 py-2">{item.tipoDespesa}</td>
            <td class="border px-4 py-2">{item.recorrente == true ? 'Sim' : 'Não'}</td>
            <td class="border px-4 py-2">{item.tipoDeRecorrencia == null ? '' : item.tipoDeRecorrencia}</td>
            <td class="border px-4 py-2">{item.data}</td>
          </tr>
        {/each}
      </tbody>
  </div>
  <aside class="w-1/4 flex  flex-col gap-3 border-l">
    <div class="text-right">
      <h1 class="font-italic text-3xl">Ações</h1>
      <p>👇 Escolha uma das opções abaixo</p>
    </div>
    <div class="flex justify-end gap-2">
      <button on:click={() => {willAddDespesa = !willAddDespesa; willEditDespesa = false}} class="bg-[#7c3267] text-white w-1/3 rounded-lg py-2 my-2">Adicionar despesa</button>
      <button class="bg-[#7c3267] text-white w-1/3 rounded-lg py-2 my-2">Baixar CSV</button>
    </div>

    <div style="min-height: 500px" class="items-start px-2 justify-end relative gap-12 mt-3 flex">
      <div style="width: 300px" class="absolute left-2 gap-1 flex flex-col">
        <a class="z-10" href={selectedItems.length > 0 ? '#my-modal-2' : ''}>
          <button 
            on:mouseenter={(e) => 
              { e.target.classList.add('w-6/12'); 
                e.target.classList.add('z-10'); 
                e.target.classList.remove('w-2/12');
                e.target.children[1].classList.remove('hidden');
              }
            }
            on:mouseleave={(e) => {
              e.target.classList.remove('w-6/12');
              e.target.classList.remove('z-10'); 
              e.target.classList.add('w-2/12')
              e.target.children[1].classList.add('hidden');
            }}
            id="edit-button"
            class="bg-[#7c3267] items-center justify-between flex w-2/12 rounded-lg disabled:opacity-50"
            disabled={selectedItems.length == 0}
          >
            <img width=40 src={deleteIcon} alt="">
            <span class="hidden text-white font-bold pr-6">Deletar</span>
          </button>
        </a>

        <div class="modal" id="my-modal-2">
          <div class="modal-box">
            <h3 class="font-bold text-lg">Voce está deletando {selectedItems.length} item(s)</h3>
            <p class="py-4">
              Tem certeza que deseja deletar?
            </p>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <div class="modal-action">
              <a href="#" class="btn">Cancelar</a>
              <a href="#"><button on:click={handleDeleteDespesa} class="btn btn-error">Deletar</button></a>
            </div>
          </div>
        </div>

        <button 
          on:mouseenter={(e) => 
            { e.target.classList.add('w-6/12'); 
              e.target.classList.add('z-10'); 
              e.target.classList.remove('w-2/12');
              e.target.children[1].classList.remove('hidden');
            }
          }
          on:mouseleave={(e) => {
            e.target.classList.remove('w-6/12');
            e.target.classList.remove('z-10');
            e.target.classList.add('w-2/12')
            e.target.children[1].classList.add('hidden');
          }}
          on:click={() => {willEditDespesa = !willEditDespesa; willAddDespesa = false}}
          id="edit-button"
          class="bg-[#7c3267] items-center justify-between flex w-2/12 rounded-lg disabled:opacity-50"
          disabled={selectedItems.length == 0 || selectedItems.length > 1}
        >
          <img class="p-2" width=40 src={editIcon} alt="">
          <span class="hidden text-white font-bold pr-6">Editar</span>
        </button>
      </div>
      <div class="flex items-end flex-col w-full">
      {#if willAddDespesa}
        <form style="z-index: 5" on:submit={handleCreateDespesa} in:fly="{{ y: 200, duration: 1000 }}" class="flex flex-col gap-2 w-3/4">
          <span>Data da despesa</span>
          <select bind:value={willSelectDate} class="border rounded-lg px-2 py-1">
            <option value={false}>Hoje</option>
            <option value={true}>Selecionar uma data</option>
          </select>
          {#if willSelectDate}
            <label for="data">Selecione a data de despesa</label>
            <input type="date" name="data" id="data" class="border rounded-lg px-2 py-1">
          {/if}
          <label for="valor">Valor</label>
          <input use:imask={optionsValor} type="text" name="valor" id="valor" class="border rounded-lg px-2 py-1">
          <label for="descricao">Descrição</label>
          <input type="text" name="descricao" id="descricao" class="border rounded-lg px-2 py-1">
          <label for="tipo">Tipo</label>
          <select name="tipo" id="tipo" class="border rounded-lg px-2 py-1">
            <option value="reposicao">Reposição</option>
            <option value="investimento">Investimento</option>
            <option value="contas">Contas</option>
          </select>
          <label for="recorrente">Recorrente</label>
          <select name="recorrente" bind:value={recorrente} id="recorrente" class="border rounded-lg px-2 py-1">
            <option value={true}>Sim</option>
            <option value={false}>Não</option>
          </select>
          {#if recorrente == true}
            <label for="tipo-recorrencia">Tipo de recorrência</label>
            <select name="tiporecorrencia" id="tipo-recorrencia" class="border rounded-lg px-2 py-1">
              <option value="dia">Diária</option>
              <option value="mes">Mensal</option>
              <option value="ano">Anual</option>
            </select>
          {/if}
          <button type="submit" class="bg-[#7c3267] text-white w-full rounded-lg py-2 my-2">Adicionar despesa</button>
        </form>
      {/if}
      {#if willEditDespesa}
        <form style="z-index: 5" on:submit={(e) => handleEditDespesa(e, selectedItems[0].id)} in:fly="{{ y: 200, duration: 1000 }}" class="flex flex-col gap-2 w-3/4">
          <span>Data da despesa</span>
          <select bind:value={willSelectDate} class="border rounded-lg px-2 py-1">
            <option value={false}>Hoje</option>
            <option value={true}>Selecionar uma data</option>
          </select>
          {#if willSelectDate}
            <label for="data">Selecione a data de despesa</label>
            <input type="date" name="data" id="data" class="border rounded-lg px-2 py-1">
          {/if}
          <label for="valor">Valor</label>
          <input use:imask={optionsValor} type="text" value={selectedItems[0].valor} name="valor" id="valor" class="border rounded-lg px-2 py-1">
          <label for="descricao">Descrição</label>
          <input type="text" name="descricao" value={selectedItems[0].descricao} id="descricao" class="border rounded-lg px-2 py-1">
          <label for="tipo">Tipo</label>
          <select name="tipo" id="tipo" value={selectedItems[0].tipoDespesa} class="border rounded-lg px-2 py-1">
            <option value="reposicao">Reposição</option>
            <option value="investimento">Investimento</option>
            <option value="contas">Contas</option>
          </select>
          <label for="recorrente">Recorrente</label>
          <select name="recorrente" bind:value={recorrente} id="recorrente" class="border rounded-lg px-2 py-1">
            <option value={true}>Sim</option>
            <option value={false}>Não</option>
          </select>
          {#if recorrente == true}
            <label for="tipo-recorrencia">Tipo de recorrência</label>
            <select name="tiporecorrencia" id="tipo-recorrencia" value={selectedItems[0].tipoDeRecorrencia} class="border rounded-lg px-2 py-1">
              <option value="dia">Diária</option>
              <option value="mes">Mensal</option>
              <option value="ano">Anual</option>
            </select>
          {/if}
          <button on:click={willEditDespesa = false} type="submit" class="bg-[#7c3267] text-white w-full rounded-lg py-2 my-2">Editar despesa</button>
        </form>
      {/if}
      {#if flashMessage.message != ''}
      <div class="alert w-3/4 alert-{flashMessage.type == 'success' ? 'success ' : 'error'} shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{flashMessage.message}</span>
        </div>
      </div>
      {/if}
      </div>
    </div>
  </aside>
</section>

<style>
  .meses-container button {
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
  }

  @media (max-width: 1921px) {
    .meses-container button {
      padding: 0 2px;
    }
  }

  .selecionado{
    background-color: #92397a;
  }

  .meses-container button:hover {
    background-color: #92397a;
  }

  .dias-container button {
    color: white;
    border: none;
    border-radius: 5px;
    padding: 2.5px 5px;
  }

  .dias-container button:hover {
    background-color: #92397a;
  }

  .hidden{
    display: none;
  }
</style>