<script>
  export let promocao

</script>
  <input type="checkbox" id="my-modal-{promocao.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label on:click={() => {isOpen = false}} for="my-modal-{promocao.id}" class="modal">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold flex items-center">promocao #{promocao.id}</h3>
      <div class="mt-8 flex flex-col gap-5">
        
      </div>
    </label>
  </label>