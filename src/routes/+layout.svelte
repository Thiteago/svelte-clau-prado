<script>
  import "../app.css";
  import { loadStorageData} from '$lib/js/stores/login.js'
	import { onMount } from "svelte";


  const CLEANUP_INTERVAL =  15 * 24 * 60 * 60 * 1000;

  function clearLocalStorage() {
    console.log('clearing local storage')
    localStorage.clear();
  }

  setInterval(clearLocalStorage, CLEANUP_INTERVAL);

  onMount(async () => {
    loadStorageData()
  })
  
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Viga&display=swap" rel="stylesheet">
</svelte:head>

<slot />