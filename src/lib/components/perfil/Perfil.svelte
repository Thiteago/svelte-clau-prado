<script>
  import foto from '$lib/assets/img/foto-clau.png'
  
  export let user
</script>


<div class="profileContainer">
  <div class="userWrapper">
      <div>
          <h2>Bem-vindo, {user.nome}!</h2>
          <span>{user.email}</span>
      </div>
      <div class="containerImageProfile">
          <img class="imageProfile" src={foto} alt="" />
      </div>
  </div>
  
  <div class="containerUltimoPedido">
      <h3 class="sectionTitle">Ultimo Pedido</h3>
      <div class="containerPedido">
          <div class="wrapperPedido">
              <div>
                  <h4 class="title">NÚMERO DO PEDIDO</h4>
                  <span>#1</span>
              </div>
              <div>
                  <h4 class="title">STATUS</h4>
                  <span>Concluído</span>
              </div>
              <div>
                  <h4 class="title">DATA</h4>
                  <span>01/01/2022</span>
              </div>
              <div>
                  <h4 class="title">PAGAMENTO</h4>
                  <span>Cartão de crédito</span>
              </div>
          </div>
          <a href="#">Histórico de Pedidos</a>
      </div>
      
  </div>
</div>