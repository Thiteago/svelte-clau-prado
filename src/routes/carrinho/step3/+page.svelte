<script>
  import Steps from '$lib/components/steps/Steps.svelte';
  import Header from '$lib/components/header/Header.svelte';
  import { imask } from '@imask/svelte'
  import moneyIcon from '$lib/assets/icons/money.svg'
  import boletoIcon from '$lib/assets/icons/boleto.svg'
  import cardIcon from '$lib/assets/icons/card.svg'
  import { resume } from '$lib/stores/cart.js'

  $: selectedMethodPayment = 'boleto'


  $: if($resume){
    console.log($resume.total)
  }

  const maskCPF = {
    mask: '000.000.000-00',
    lazy: true
  };

  const maskCard = {
    mask: '0000 0000 0000 0000',
    lazy: true
  };

  const maskValid = {
    mask: '00/00',
    lazy: true
  };

  function handlePayment(metodo){
    if(metodo == 'boleto'){
      console.log('boleto')
    }else if(metodo == 'cartao'){
      console.log('cartao')
    }
  }



</script>

<Header />

<div class="w-full bg-white flex flex-col items-center">
  <div class="flex justify-center">
    <Steps currentStep={3} />
  </div>

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
              <h1 class="text-2xl font-bold">R$ {$resume.total},00</h1>
            </div>
            <div>
              <button on:click={() => handlePayment('boleto')} class="btn bg-[#7C3267] w-full mt-4">Prosseguir</button>
            </div>
          </div>
        {:else}
          <div>
            <h1 class="text-xl font-bold mb-2 ">Cartao de Crédito</h1>
            <p>Aceitamos as bandeiras de cartão VISA, MasterCard, ELO, HiperCard, American Express e Diners</p>
          </div>
          <div class="flex justify-between items-center">
            <form class="flex flex-col w-full gap-y-3" action="">
              <input class="input input-bordered w-full" type="text" placeholder="Nome impresso no cartão">
              <input use:imask={maskCard} class="input input-bordered w-full" type="text" placeholder="Numero do cartão">
              <div class="flex gap-x-3">
                <input use:imask={maskValid} class="input input-bordered w-1/3" type="text" placeholder="Validade">
                <input class="input input-bordered w-1/3" type="text" maxlength="3" on:input={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')}
                  placeholder="Código de Verificação (CVV)">  
                <input class="input input-bordered w-1/3" type="date" placeholder="Data de Nascimento">
              </div>
              <input use:imask={maskCPF} class="input input-bordered w-full" type="text" placeholder="CPF do titular">
              <div class="mt-2.5 relative">
                <div class="z-10 bottom-9 ml-3 bg-white absolute">Forma de pagamento</div>
                <select class="select select-bordered w-full">
                  <option value="avista" selected>À vista - R$ {$resume.total},00</option>
                  {#each Array(12) as _, i}
                    <option value="parcelado">Parcelado em {i + 2}x de R$ {($resume.total / (i + 2)).toFixed(2)} </option>
                  {/each}
                </select>
              </div>
              <button on:click={() => handlePayment('cartao')} class="btn bg-[#7C3267] w-full mt-4">Prosseguir</button>
            </form>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>