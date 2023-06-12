<script>
  import { createEventDispatcher } from 'svelte';
  export let nome
  export let id

  const dispatch = createEventDispatcher();

  function handleChange(event) {
    dispatch('inputChange', { 
      name: nome,
      value: event.target.value,
      id: id
    });
  }
</script>

<label for="{nome}">Insira {nome}</label>
<input name="peso" type='text' class="input w-full border border-base-300" 
required on:input={handleChange}
/>