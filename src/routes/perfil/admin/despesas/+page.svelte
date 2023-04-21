<script>
  import {imask} from '@imask/svelte'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import { onMount } from 'svelte';

  $: selectedMonth = ''
  $: selectedDay = ''
  $: actualDespesas = []

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


  const year = new Date().getFullYear();
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
                21,22,23,24,25,26,27,28,29,30,31]
  let willAddDespesa = false
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
    const response = await fetch(`${PUBLIC_BACKEND_URL}/despesas/listar?${mes ? `mes=${mes}` : ''}${dia ? `&dia=${dia}` : ''}`)
    try{
      const data = await response.json()
      actualDespesas = data
    }catch(err){
      console.log(err)
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
      const data = await response.json()
      actualDespesas.push(data)
      if(response.status == 201){
        handleFlashMessages('success', 'Despesa cadastrada com sucesso!')
      }
    }catch(err){
      console.log(err)
      handleFlashMessages('error', 'Erro ao cadastrar despesa!')
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
    <div class="flex flex-col gap-2 my-5 items-center justify-center">
      <div class="flex gap-12 bg-[#7c3267] px-1 meses-container rounded-lg py-1"> <!--Meses-->
        {#each months as month, i}
          <button on:click={() => {selectedMonth = i+1; selectedDay = undefined}} class="text-white {i+1 == selectedMonth ? 'selecionado' : ''}">{month}</button>
        {/each}
      </div>
      <div class="flex gap-6 bg-[#7c3267] px-2 dias-container rounded-lg py-1"><!-- Dias -->
        {#each days as day}
          <button on:click={() => {selectedDay = day}} class="text-white {day == selectedDay ? 'selecionado' : ''}">{day}</button>
        {/each}
      </div>
    </div>
    <div>
      <div></div>
    </div>
    <table class="table-auto w-full">
      <thead>
        <tr>
          <th class="px-4 py-2">Valor</th>
          <th class="px-4 py-2">Descrição</th>
          <th class="px-4 py-2">Tipo</th>
          <th class="px-4 py-2">Recorrente</th>
          <th class="px-4 py-2">Tipo de recorrência</th>
        </tr>
      </thead>
      <tbody>
        {#each actualDespesas as item}
          <tr class="text-center">
            <td class="border px-4 py-2">R$ {item.valor}</td>
            <td class="border px-4 py-2">{item.descricao}</td>
            <td class="border px-4 py-2">{item.tipoDespesa}</td>
            <td class="border px-4 py-2">{item.recorrente}</td>
            <td class="border px-4 py-2">{item.tipoDeRecorrencia == null ? '' : item.tipoDeRecorrencia}</td>
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
      <button on:click={() => {willAddDespesa = !willAddDespesa}} class="bg-[#7c3267] text-white w-1/3 rounded-lg py-2 my-2">Adicionar despesa</button>
      <button class="bg-[#7c3267] text-white w-1/3 rounded-lg py-2 my-2">Baixar CSV</button>
    </div>

    <div class="flex items-center flex-col">
      {#if willAddDespesa}
        <!-- Create form to create new Despesa -->
        <form on:submit={handleCreateDespesa} class="flex flex-col gap-2 w-3/4">
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
        {#if flashMessage.message != ''}
        <div class="alert w-3/4 alert-{flashMessage.type == 'success' ? 'success ' : 'error'} shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{flashMessage.message}</span>
          </div>
        </div>
        {/if}
      {/if}
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
</style>