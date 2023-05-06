<script>
	import { onMount } from "svelte";
  import { fetchAlugueis } from "$lib/js/helpers.js";
  import ModalPedidoAdmin from "$lib/components/modalPedidoAdmin/ModalPedidoAdmin.svelte";
  import pencilIcon from '$lib/assets/icons/pencil.svg'


  $: selectedType = 'Alugado'
  $: alugueis = []
  $: selectedAluguel = {}
  $: displayedAlugueis = []
  const productsPerPage = 5;
  let totalPages = 1;
  let currentPage = 1
  let pages = [];


  $: if(selectedType){
    handleReload()
  }

  function selectAluguel(id){
    selectedAluguel = alugueis.find(aluguel => aluguel.Pedido.id === id)
    selectedAluguel = selectedAluguel.Pedido
  }

  function displayAlugueis(page, type) {
    currentPage = page;
    let filteredAlugueis = alugueis;
  
    if(type != 'Todos') {
      filteredAlugueis = alugueis.filter(aluguel => aluguel.status_aluguel === type)
      totalPages = Math.ceil(filteredAlugueis.length / productsPerPage);
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }else{
      totalPages = Math.ceil(alugueis.length / productsPerPage);
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    return filteredAlugueis.slice(startIndex, endIndex);
  }

  async function handleReload(){
    alugueis = await fetchAlugueis()
    displayedAlugueis = displayAlugueis(1, selectedType)
    selectedAluguel = []
  }

  onMount(async () => {
    alugueis = await fetchAlugueis()
  })

</script>


<section class="p-6">
  <h1 class="text-2xl font-bold">Devoluções</h1>

  <div>
    <label for="pedidos" class="label">
      <span class="label-text">Selecione o tipo de devolução</span>
    </label>
    <select bind:value={selectedType} name="pedidos" class="select select-bordered">
      <option value="Alugado">Pendentes</option>
      <option value="Atrasado">Pendentes Atrasadas</option>
      <option value="Devolvido">Enviados</option>
      <option value="Todos">Todos</option>
    </select>
    <div class="flex flex-col items-center">
      <table class="table cazuza table-zebra w-full mt-5">
        <thead>
          <tr>
            <th>Id</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Produto</th>
            {#if selectedType == 'Atrasado'}
              <th>Dias atrasados</th>
            {/if}
            <th>Status</th>
            {#if selectedType == 'Devolvido'}
              <th>Cod. Rastreio</th>
            {/if}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {#if alugueis.length == 0}
            <tr>
              <td colspan="7" class="text-center">Nenhum aluguel encontrado</td>
            </tr>
          {:else}
            {#each displayedAlugueis as aluguel}
              <tr>
                <td>{aluguel.id}</td>
                <td>{aluguel.Pedido.user.nome}</td>
                <td>R$ {aluguel.Pedido.valor}</td>
                <td>{aluguel.produto.nome}</td>
                {#if selectedType == 'Atrasado'}
                  <td>{aluguel.dias_atrasados}</td>
                {/if}
                <td>{aluguel.status_aluguel}</td>
                {#if selectedType == 'Devolvido'}
                  <td>{aluguel.codigo_rastreio_devolucao}</td>
                {/if}
                <td>
                  <div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <label for="my-modal-{aluguel.Pedido.id}" on:click={() => selectAluguel(aluguel.Pedido.id)} class="cursor-pointer">
                      <img width="30" height="30" src={pencilIcon} alt="">
                    </label>
                  </div>  
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
      <div class="btn-group mt-2">
      
      </div>
    </div>
  </div>
</section>

{#if Object.keys(selectedAluguel).length > 0}
  <ModalPedidoAdmin on:reload={handleReload} pedido={selectedAluguel} />
{/if}