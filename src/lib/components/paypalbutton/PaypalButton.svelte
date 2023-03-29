<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import { goto } from '$app/navigation';
  import { loadScript } from "@paypal/paypal-js";
  import { resume } from '$lib/js/stores/cart.js'

  let paypal;

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
              if(transaction.status == 'COMPLETED'){
                goto('/carrinho/step4')
              }else{
                alert('Erro ao gerar pedido')
              }
            });
          }
          
        }).render("#paypal-button-container");

      } catch (error) {
        console.error("failed to render the PayPal Buttons", error);
      }
    }
  }
  loadPaypal()
</script>

<div id="paypal-button-container"></div>