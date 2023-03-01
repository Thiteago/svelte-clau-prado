<script>
  export let pedido
  export let isOpen

  $: if(pedido){
    console.log(pedido)
  }
</script>

{#if pedido != null}
  <input type="checkbox" checked={isOpen} id="my-modal-{pedido.id}" class="modal-toggle" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label on:click={() => {isOpen = false}} for="my-modal-{pedido.id}" class="modal">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">{pedido.id} random Internet user!</h3>
      <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
    </label>
  </label>
{/if}