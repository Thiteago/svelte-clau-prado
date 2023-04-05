<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { getUsers} from '$lib/js/helpers.js';
	import { onMount } from 'svelte';
	import FlashMessage from '$lib/components/flashMessage/FlashMessage.svelte';

  let usuarios = [];
  let selectedUsuario
  let role
  let alert = {
    message: '',
    type: '',
    time: 0
  }
  let userId
  let clicked = false

  async function handleUpdate(){
    clicked = false
    let id = userId === undefined ? selectedUsuario : userId
    const response = await fetch(`${PUBLIC_BACKEND_URL}/Usuarios/alterar/cargo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cargo: role
      })
    })
    if(response.ok){
      alert.message = 'Usuário atualizado com sucesso'
      alert.type = 'success'
      alert.time = 3000
    }else{
      alert.message = 'Erro ao atualizar usuário'
      alert.type = 'error'
      alert.time = 3000
    }
    clicked = true
  }

  onMount(async() => {
    usuarios = await getUsers();
  })

</script>

<h1 class="text-3xl mb-4 font-bold">Usuários</h1>
<div>
  <h2>Selecione o usuário</h2>
  <div class="flex items-center my-3 gap-3">
    <select bind:value={selectedUsuario} on:change={() => {userId = undefined}} class="select select-bordered" name="usuarios">
      {#if usuarios.length === 0}
        <option value="0">Nenhum usuário encontrado</option>
      {:else}
      <option default disabled value="0">Selecione um usuário</option>
        {#each usuarios as usuario}
          <option value="{usuario.id}">{usuario.nome}</option>
        {/each}
      {/if}
    </select>
    <span> Ou </span>
    <input bind:value={userId} placeholder="Informe o ID" type="text" class="input input-bordered max-w-xs">
  </div>
  <div>
    <p>Tornar</p>
    <select bind:value={role} class="select select-bordered my-3" name="cargo">
      <option value="Admin">Administrador</option>
      <option value="Usuario">Usuário</option>
    </select>
  </div>

  <button disabled={selectedUsuario == 0 && userId == undefined} 
  on:click={handleUpdate} 
  class="btn mt-1">Atualizar</button>

  {#if alert.message !== ''}
    <FlashMessage message={alert.message} type={alert.type} visible={clicked} time={alert.time}/>
  {/if}
</div>