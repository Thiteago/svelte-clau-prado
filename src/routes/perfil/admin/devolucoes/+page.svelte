<script>
  $: selectedType = 'Pendente'

</script>


<section class="p-6">
  <h1 class="text-2xl font-bold">Devoluções</h1>

  <div>
    <label for="pedidos" class="label">
      <span class="label-text">Selecione o tipo de pedidos a serem mostrados</span>
    </label>
    <select bind:value={selectedType} name="pedidos" class="select select-bordered">
      <option value="Atrasado">Pendentes de Envio</option>
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
            <th>Dias atrasados</th>
            <th>Status</th>
            <th>Cod. Rastreio</th>
          </tr>
        </thead>
        <tbody>
          {#if pedidos.length === 0}
            <tr>
              <td colspan="7">Nenhum pedido atrasado</td>
            </tr>
          {:else}
            {#each displayedPedidos as pedido}
              {#if pedido.status === selectedType || selectedType === 'Todos'}
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              {/if}
            {/each}
          {/if}
        </tbody>
      </table>
      <div class="btn-group mt-2">
        {#if pages.length > 1}
          {#each pages as page}
            <button class="btn {currentPage == page ? 'btn-active' : ''}" on:click={() => {displayedPedidos = displayPedidos(page, selectedType)}}>{page}</button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>
