<script>
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
  import PayPalButton from '$lib/components/paypalbutton/PaypalButton.svelte'
  import moneyIcon from '$lib/assets/icons/money.svg'
  import boletoIcon from '$lib/assets/icons/boleto.svg'
  import cardIcon from '$lib/assets/icons/card.svg'
  import paypalIcon from '$lib/assets/icons/paypal-icon.svg'
  import { resume, currentStep } from '$lib/js/stores/cart.js'
  import { checkIfCartIsAvailable } from '$lib/js/helpers.js'
	import { goto } from '$app/navigation';
	import CreditCard from '$lib/components/creditCard/CreditCard.svelte';
	import { onMount } from 'svelte';

  $: selectedMethodPayment = 'boleto'
  let sendedPaymentRequest = false
  $currentStep = 3
  let available = false

  onMount(async() => {
    if($resume == null || $resume == undefined || Object.keys($resume).length == 0){
      if(localStorage.getItem('resume') != null){
        $resume = JSON.parse(localStorage.getItem('resume'))
      }else{
        goto('/carrinho')
      }
    }
    available = await checkIfCartIsAvailable($resume.cartItens)
  })
  
  async function handlePayment(metodo){
    sendedPaymentRequest = true
    if(metodo == 'boleto'){
      $resume = {...$resume, metodoPagamento: 'boleto'}
    }

    const response = await fetch(`${PUBLIC_BACKEND_URL}/pedido/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify($resume)
    })
    if(response.status == 200){
      goto('/carrinho/step4')
    }else{
      alert('Erro ao gerar pedido')
    }
  }

</script>

<div class="w-full bg-white flex flex-col items-center">
  <div class="w-11/12 md:w-3/4 lg:w-1/2 flex flex-col mt-6">
    <div class="flex gap-2">
      <img class="w-8 h-8" src={moneyIcon} alt="">
      <h1 class="text-2xl">Formas de Pagamento</h1>
    </div>

    <div class="w-full flex gap-5">
      <div class="w-3/12 flex flex-col gap-2 mt-4">
        <div class="flex items-center gap-2 w-full">
          <button on:click={() => {selectedMethodPayment = 'boleto'}} class="hover:bg-fuchsia-800 hover:text-white w-full flex gap-2 border-2 rounded border-fuchsia-900 py-2 pl-2 pr-5"><img class="w-6 h-6" src={boletoIcon} alt=""> Boleto</button>
        </div>
        <div class="flex items-center gap-2 w-full">
          <button on:click={() => {selectedMethodPayment = 'cartao'}} class="hover:bg-fuchsia-800 hover:text-white w-full flex gap-2 border-2 rounded border-fuchsia-900 py-2 pl-2 pr-5"><img class="w-6 h-6" src={cardIcon} alt=""> Cartão de Crédito</button>
        </div>
        <div class="flex items-center gap-2 w-full">
          <button on:click={() => {selectedMethodPayment = 'paypal'}} class="hover:bg-fuchsia-800 hover:text-white w-full flex gap-2 border-2 rounded border-fuchsia-900 py-2 pl-2 pr-5"><img class="w-6 h-6" src={paypalIcon} alt=""> Paypal</button>
        </div>
      </div>
      <div class="w-9/12 flex flex-col gap-10 mt-4">
        {#if selectedMethodPayment == 'boleto'}
          <div>
            <h1 class="text-xl font-bold mb-2 ">Boleto Bancário</h1>
            <p>Esta é a forma mais vantajosa para quem deseja pagar à vista. Você poderá efetuar o pagamento do boleto em qualquer Banco ou Casa Lotérica em qualquer lugar do Brasil, sem necessidade de confirmação do pagamento.</p>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex flex-col justify-center">
              <p>TOTAL DA SUA COMPRA:</p>
              <h1 class="text-2xl font-bold">R$ {$resume.total}</h1>
            </div>
            <div>
              <button disabled={sendedPaymentRequest}  on:click={() => handlePayment('boleto')} class="btn bg-[#7C3267] w-full mt-4">Prosseguir</button>
            </div>
          </div>
        {:else if selectedMethodPayment == 'cartao'}
          <div class="mb-5">
            <h1 class="text-xl font-bold mb-2 ">Cartao de Crédito</h1>
            <p>Aceitamos as bandeiras de cartão VISA, MasterCard, ELO, HiperCard, American Express e Diners</p>
            <CreditCard submitPayment={handlePayment}/>
          </div>
        {:else}
          {#if available}
            <PayPalButton />
          {:else}
            <div>
              Algum item do carrinho nao esta mais disponivel , por favor, realize uma nova compra
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

