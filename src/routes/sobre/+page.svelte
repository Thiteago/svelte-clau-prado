<script>
  import "./style.scss"
  import Header from '$lib/components/header/Header.svelte'
  import fotoClau from '$lib/assets/img/foto-clau.png'
	import SubHeader from "$lib/components/subHeader/SubHeader.svelte";

</script>
<div class="bg-white">
  <SubHeader/>
  <Header />
</div>
<section class="main-sobre">
  <div class="wrapper-sobre">
    <h1>Sobre</h1>
    <p class="text">Meu nome é Claudia e eu sou a proprietária da marca ClauPrado, tendo o projeto sido criado a 10 anos, hoje vivo da profissão e entrego qualidade e muito carinho em todos os produtos e ideias que aqui recebo. 
    <br/>
    <br/>
    Me localizo hoje na cidade de Campos do Jordão, preparando especialmente produtos pela região do Vale do Paraíba e futuramente até o Brasil.<br/>
    <br/>
    Sou formada em Artes Visuais pela UNIMES e já lecionei por alguns anos em escolas municipais de Campos do Jordão.<br/>
    <br/>
    Sou apaixonada pelo que faço , e espero que se encante o tanto quanto eu pelos meus projetos.</p>
      
    <img class="profile" src={fotoClau} alt="foto clau" />

  </div>
</section>
