<script>
  export let nome
</script>

<label for="{nome}">Insira {nome}</label>
<input name="peso" type='text' class="input w-full border border-base-300" 
bind:value={nome}
required
/>