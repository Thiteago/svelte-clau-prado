<script>
  import './style.scss'
  export let busca

</script>


<section class="main-busca">
  <div class="wrapper-busca">
      <input bind:value={busca} type="text" />
      <button>Buscar</button>
  </div>
</section>