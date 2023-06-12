<script>
  import './previousButton.scss'
  export let endereco = ''
  export let cor = ''
</script>

<a href={endereco}>
  <div class="container-botao">
    <a href="/#" class="voltar botao">&#8249;</a>
    <p class="{cor}">Voltar</p>
  </div>
</a>