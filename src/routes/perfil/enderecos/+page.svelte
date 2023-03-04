<script>
  import { user } from  '$lib/js/stores/login.js'
  import {fetchAddress} from '$lib/js/helpers.js'
	import { onMount } from 'svelte';
  import { imask } from '@imask/svelte'
	import ModalEndereco from '$lib/components/modalEndereco/ModalEndereco.svelte';

  let selectedEndereco = {id: 1}
  let principal
  let enderecos = []

  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };

  async function handleUpdateEndereco() {
    enderecos = await fetchAddress($user.id)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const response = await fetch (`http://localhost:3333/Usuarios/${$user.id}/NovoEndereco`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        rua: e.target.rua.value,
        numeroRua: e.target.numero.value,
        bairro: e.target.bairro.value,
        cidade: e.target.cidade.value,
        estado: e.target.estado.value,
        cep: e.target.cep.value,
        principal: principal
      })
    })
    if(response.status == 201){
      enderecos = await fetchAddress($user.id)
    }
  }

  function selectEndereco(id) {
    selectedEndereco = enderecos.find(endereco => endereco.id == id)
  }

  onMount(async () => {
    enderecos = await fetchAddress($user.id)
  })
</script>

<section class="p-6">
  <h1 class="text-2xl">Seus enderecos</h1>
  <div class="mt-10">
    {#each enderecos as endereco}
      <div class="endereco mt-4 py-12 px-3 flex gap-5 h-16 items-center">
        <div class="w-9/12">
          <h2 class="text-xl">{endereco.rua}, {endereco.numeroRua} - {endereco.bairro}</h2>
          <p>{endereco.cidade} - {endereco.estado}</p>
          <p>{endereco.cep}</p>
        </div>
        <div class="text-center w-3/12 flex justify-center">
          {#if endereco.principal}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <label for="my-modal-{endereco.id}" on:click={() => selectEndereco(endereco.id)} class="btn w-full">Principal / Editar</label>
          {:else}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <label for="my-modal-{endereco.id}" on:click={() => selectEndereco(endereco.id)} class="btn w-full">Editar</label>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="h-1 w-full bg-black mt-10" />
  <div class="collapse border border-base-300 mt-6 rounded-box">
    <input type="checkbox" /> 
    <div class="collapse-title flex flex-col items-center justify-center">
      <h2 class="font-bold text-xl">Cadastre um novo Endereco</h2>
    </div>

    <form class="collapse-content flex flex-col w-full" on:submit={handleSubmit}>
      <div class="form-control w-full">
        <label for="rua" class="label">
          <span class="label-text">Rua</span>
        </label>
        <input type="text" name="rua" placeholder="Av Tarcísio" class="input input-bordered w-full" />

        <label for="numero" class="label">
          <span class="label-text">Numero</span>
        </label>
        <input type="number" name="numero" placeholder="254" class="input input-bordered w-full" />

        <label for="bairro" class="label">
          <span class="label-text">Bairro</span>
        </label>
        <input type="text" name="bairro" placeholder="Anhanguera" class="input input-bordered w-full" />

        <label for="cidade" class="label">
          <span class="label-text">Cidade</span>
        </label>
        <input type="text" name="cidade" placeholder="Sao Paulo" class="input input-bordered w-full" />

        <label for="estado" class="label">
          <span class="label-text">Estado</span>
        </label>
        <input type="text" name="estado" placeholder="SP" class="input input-bordered w-full" />

        <label for="cep" class="label">
          <span class="label-text">CEP</span>
        </label>
        <input type="text" name="cep" use:imask={optionsCEP} placeholder="12546-000" class="input input-bordered w-full" />

        <label for="principal" class="label">
          <span class="label-text">Deseja definir como Principal?</span>
        </label>
        <div class="flex items-center gap-5">
          <div class="flex items-center gap-1">
            <input type="radio" name="principal" bind:group={principal} class="input input-bordered w-4" value={false}/> 
            <span>Não</span>
          </div>
          <div class="flex items-center gap-1">
            <input type="radio" name="principal" bind:group={principal} class="input input-bordered w-4" value={true}/> 
            <span>Sim</span>
          </div>
        </div>
        
      </div>

      <button type="submit" class="btn mt-5">Cadastrar</button>
    </form>
  </div>

<ModalEndereco onUpdateEndereco={handleUpdateEndereco} endereco={selectedEndereco}/>
</section>


<style>
  .endereco:nth-child(odd){
    background-color: #f5f5f5;
  }
</style>