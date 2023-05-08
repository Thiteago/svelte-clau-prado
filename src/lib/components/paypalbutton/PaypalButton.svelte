<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { goto } from '$app/navigation';
  import { loadScript } from "@paypal/paypal-js";
  import { resume, idCart } from '$lib/js/stores/cart.js'
  import Loading from '$lib/components/loading/Loading.svelte'
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function reloadOrder(){
    dispatch('reloadOrder')
  }

  let paypal;
  export let pedido

  async function checkCartAsSaled(id){
    await fetch(`${PUBLIC_BACKEND_URL}/carrinho/marcarvenda/${id}`, {
      method: 'POST',
    })
  }

  async function loadPaypal(){
    try {
      paypal = await loadScript({ "client-id": "AcY6krCqYjlEo9idHDhjYwd-ZncH3pZvfdgFZypZKinl1J0Nn2nESCO2PXFZLMeZotoMEwg_m4MUiBMC&currency=BRL" });
    } catch (error) {
      console.error("failed to load the PayPal JS SDK script", error);
    }

    if (paypal) {
      try {
        await paypal.Buttons({
          createOrder(){
            if(pedido == undefined){
              $resume = {...$resume, metodoPagamento: 'paypal'}
              return fetch(`${PUBLIC_BACKEND_URL}/pedido/gerar`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify($resume)
              })
              .then((response) => response.json())
              .then((order) => order.id);
            }else{
              console.log('entrei aqui')
              return fetch(`${PUBLIC_BACKEND_URL}/pedido/paypal/novamente`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(pedido)
              })
              .then((response) => {console.log(console.log(response)) ;return response.json()})
              .then((order) => order.id);
            }
          },

          onApprove(data) {
            return fetch(`${PUBLIC_BACKEND_URL}/pedido/capturar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID
              })
            })
            .then((response) => response.json())
            .then((orderData) => {
              const transaction = orderData.purchase_units[0].payments.captures[0];
              if($idCart == 0 || $idCart == undefined){
                $idCart = JSON.parse(localStorage.getItem('idCart')).idCart
              }
              if(transaction.status == 'COMPLETED' && pedido == undefined){
                checkCartAsSaled($idCart)
                goto('/carrinho/step4')
              }else if(transaction.status == 'COMPLETED' && pedido != undefined){
                reloadOrder()
              }else{
                alert('Erro ao gerar pedido')
              }
            });
          },
  
          onError(err) {
            alert('Erro ao gerar pedido, tente novamente')
          }
        }).render("#paypal-button-container");

      } catch (error) {
        console.error("failed to render the PayPal Buttons", error);
      }
    }
  }
  loadPaypal()
</script>
{#if !paypal}
  <div class="flex justify-center">
    <Loading />
  </div>
{/if}
<div id="paypal-button-container"></div>