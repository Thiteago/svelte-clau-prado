<script>
  import { formatDate } from "$lib/js/helpers.js";
  export let promocao

  let today = new Date();
  let data_inicio = formatDate(promocao.data_inicio)
  let data_fim = formatDate(promocao.data_fim)
  let left = new Date(promocao.data_fim).getDate() - today.getDate()
  let started = new Date(promocao.data_inicio).getDate() - today.getDate()  

</script>
  <input type="checkbox" id="my-modal-{promocao.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label for="my-modal-{promocao.id}" class="modal">
    <label class="modal-box relative max-w-4xl" for="">
      <h3 class="text-lg font-bold flex items-center">Promocao {promocao.nome}</h3>
      <div class="mt-8 flex flex-col gap-5">

        <div>
          {#if started > 0}
            <h1 class="font-bold">Status</h1>
            <p>Ainda não iniciou</p>
          {:else if left > 0}
            <h1 class="font-bold">Status</h1>
            <p>Em andamento</p>
          {:else}
            <h1 class="font-bold">Status</h1>
            <p>Encerrada</p>
          {/if}
        </div>

        <div>
          <h1 class="font-bold">Data de vigência</h1>
          {#if left > 0}
            <p>{data_inicio} até {data_fim} - Faltam {left} dias para o término da promoção</p>
          {:else}
            <p>{data_inicio} até {data_fim} - Promoção encerrada</p>
          {/if}
        </div>
      </div>
    </label>
  </label>