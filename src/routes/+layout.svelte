<script>
  import "../app.css";
  import { loadStorageData} from '$lib/js/stores/login.js'
	import { onMount } from "svelte";

  onMount(async () => {
    loadStorageData()
  })
  
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Viga&display=swap" rel="stylesheet">
</svelte:head>

<slot />