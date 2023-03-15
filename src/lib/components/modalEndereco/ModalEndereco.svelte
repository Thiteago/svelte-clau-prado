<script>
  import { imask } from '@imask/svelte'
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { user } from '$lib/js/stores/login.js'
  export let endereco
  export let onUpdateEndereco
  let principal = false

  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };

  async function handleSubmit(e){
    e.preventDefault()
    const response = await fetch (`${PUBLIC_BACKEND_URL}/Usuarios/${$user.id}/AtualizarEndereco`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        idEndereco: endereco.id,
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
      onUpdateEndereco()
    }
  }
</script>

<input type="checkbox" id="my-modal-{endereco.id}" class="modal-toggle" />
<label for="my-modal-{endereco.id}" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <form on:submit={handleSubmit}>
      <div class="form-control w-full">
        <label for="rua" class="label">
          <span class="label-text">Rua</span>
        </label>
        <input type="text" value={endereco.rua} name="rua" placeholder="Av Tarcísio" class="input input-bordered w-full" />

        <label for="numero" class="label">
          <span class="label-text">Numero</span>
        </label>
        <input type="number" value={endereco.numeroRua} name="numero" placeholder="254" class="input input-bordered w-full" />

        <label for="bairro" class="label">
          <span class="label-text">Bairro</span>
        </label>
        <input type="text" value={endereco.bairro} name="bairro" placeholder="Anhanguera" class="input input-bordered w-full" />

        <label for="cidade" class="label">
          <span class="label-text">Cidade</span>
        </label>
        <input type="text" value={endereco.cidade} name="cidade" placeholder="Sao Paulo" class="input input-bordered w-full" />

        <label for="estado" class="label">
          <span class="label-text">Estado</span>
        </label>
        <input type="text" value={endereco.estado} name="estado" placeholder="SP" class="input input-bordered w-full" />

        <label for="cep" class="label">
          <span class="label-text">CEP</span>
        </label>
        <input type="text" value={endereco.cep} name="cep" use:imask={optionsCEP} placeholder="12546-000" class="input input-bordered w-full" />

        {#if !endereco.principal}
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
        {/if}
      </div>

      <button type="submit" class="btn w-full mt-5">Alterar</button>
    </form>
  </label>
</label>