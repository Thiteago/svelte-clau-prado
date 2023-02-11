<script>
  import Header from '$lib/components/header/Header.svelte';
	import Steps from '$lib/components/steps/Steps.svelte';
  import { imask } from '@imask/svelte'
  import { cart, resume } from '$lib/stores/cart'
  import { signed } from '$lib/stores/login'
  import leftArrow from '$lib/assets/icons/left-arrow.svg'
  import rightArrow from '$lib/assets/icons/right-arrow-qtde.svg'
  import location from '$lib/assets/icons/location-pin.svg'
  import resumeIcon from '$lib/assets/icons/resume-cart.svg'
  import { goto } from '$app/navigation';
  import './carrinho.scss'

  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };
  $: cepValidates = true
  let cep = '';
  let freightInfo = {}
  $: selectedFreight = ''
  let total = 0
  let subtotal = 0

  $: if($cart){
    subtotal = 0
    $cart.forEach(element => {
      subtotal += element.quantidade * element.valor
    }
  )
};
  function handleRedirect(){
    $resume = {
      total: total,
      cartItens: $cart,
    }
    if($signed )
      goto('/carrinho/step3')
    else{
      goto('/login?origin=carrinho')
    }
  }

  async function freightCalculate(){
    if(cep?.length < 9 || cep == ''){
      cepValidates = false
      return
    }else{
      cepValidates = true
      cep = cep.replace('-', '')
    }
    if(cepValidates){
      await fetch(`http://localhost:3333/carrinho/frete/${cep}`)
      .then(res => res.json())
      .then(data => {
        freightInfo = data
        if(freightInfo?.valorpac == '0,00' && freightInfo?.valorsedex == '0,00'){
          cepValidates = false
        }
      })
    }
  }
  
  $: if(selectedFreight == 'PAC'){
    total = subtotal + parseFloat(freightInfo?.valorpac)
  }else if(selectedFreight == 'SEDEX'){
    total = subtotal + parseFloat(freightInfo?.valorsedex)
  }else{
    total = subtotal
  }

</script>

<Header />
<div class="w-full bg-white flex flex-col items-center">
  <div class="flex justify-center">
    <Steps currentStep={1} />
  </div>

  <div class="flex w-9/12 mt-8">
    <div class="flex w-full gap-10">
      <div>
        <div class="flex items-center gap-2 ">
          <img class="w-6 h-6" src={location} alt="">
          <h1 class="text-xl font-poppins font-bold">Calcular prazo e frete</h1>
        </div>
        <div class="mt-3">
          <form class="flex gap-2 items-center" on:submit={freightCalculate}>
            <input required bind:value={cep} type="text" placeholder="CEP" use:imask={optionsCEP} class="input input-bordered w-full max-w-xs" />
            <button disabled={$cart.length < 1 ? true : false} type="submit" class="btn bg-[#7C3267]">Calcular</button>
          </form>
          {#if cepValidates != true}
            <span class="text-red-500 font-bold block mt-2">CEP Inválido!</span>
          {/if}
        </div>
        {#if Object.keys(freightInfo).length > 0 && freightInfo?.valorpac != '0,00' && freightInfo?.valorsedex != '0,00'}
        <div>
          <div class="mt-4">
            <h1 class="text-xl font-poppins font-bold">Frete</h1>
            <div class="mt-2 flex flex-col justify-center">
              <div class="flex justify-between">
                <div class="flex gap-2">
                  <input bind:group={selectedFreight} name="frete" type="radio" value="PAC">
                  <label for="frete" class="text-gray-500">PAC - Até {freightInfo?.prazopac} dias úteis</label>
                </div>
                <span class="text-gray-500">R$ {freightInfo?.valorpac}</span>
              </div>
              
              <div class="flex justify-between">
                <div class="flex gap-2">
                  <input bind:group={selectedFreight} name="frete" type="radio" value="SEDEX">
                  <label for="frete" class="text-gray-500">SEDEX - Até {freightInfo?.prazosedex} dias úteis</label>
                </div>
                <span class="text-gray-500">R$ {freightInfo?.valorsedex}</span>
              </div>
            </div>
          </div>
        </div>
        {/if}
      </div>
      <div class="flex flex-col w-3/5 gap-8">
        {#if $cart.length > 0}
          {#each $cart as product}
          <div class="flex items-center justify-evenly w-full">
            <div class="w-1/12">
                <img class="w-20 h-20 object-cover" src='http://localhost:3333/static/{product.imagens}' alt="">
            </div>
            <div class="flex flex-col justify-center w-2/5">
              <span class="text-black font-bold">{product.nome}</span>
              <span class="text-gray-500 block">Voce esta <span class="font-bold text-black">{product.tipo == 'Aluguel' ? 'ALUGANDO' : 'COMPRANDO'}</span> esse produto</span>
            </div>
            <div class="flex flex-col items-center justify-center w-1/12">
              <div class="flex flex-col items-center">
                <label for="quantidade">Quant.</label>
                <div class="flex items-center justify-center">
                  <button on:click={() => {product.quantidade > 1 ? product.quantidade-- : ''}} class="w-4">
                    <img src={leftArrow} alt="">
                  </button>
                  <input name="quantidade" class="input-number w-11 text-center" min="1" type="number" value={product.quantidade} readonly>
                  <button on:click={() => product.quantidade++} class="w-4">
                    <img src={rightArrow} alt="">
                  </button>
                </div>
              </div>
            </div>
            <div class="text-right w-1/5">
              <p>Preço à vista</p>
              <p class="font-bold text-[#7C3267]">R$ {product.quantidade * product.valor},00</p>
            </div>
          </div>
          <span class="bg-slate-200 w-full h-2"></span>
          {/each}
        {/if}
        {#if $cart.length == 0}
          <div class="flex flex-col items-center absolute top-1/2 right-1/2">
            <div class="w-20 h-20">
              <img class="max-w-full" src="" alt="">
            </div>
            <span class="text-gray-500 mt-2">Seu carrinho está vazio :&#40 </span>
          </div>
        {/if}
      </div>
      <div>
        <div>
          <h1 class="flex gap-1 items-center font-bold text-2xl"><span><img class="w-5" src={resumeIcon} alt="resume logo"></span>Resumo</h1>
        </div>
        <div class="w-48">
          <div class="flex justify-between mt-4">
            <span class="text-gray-500 pr-3">Subtotal</span>
            <span class="text-gray-500">R$ {subtotal},00</span>
          </div>
          <div class="flex justify-between mt-4">
            <span class="text-gray-500">Frete</span>
            <span class="text-gray-500">R$ {selectedFreight == 'PAC' ? freightInfo?.valorpac : selectedFreight == 'SEDEX' ? freightInfo?.valorsedex : '0,00'}</span>
          </div>
          <div class="flex flex-col justify-center items-center bg-green-200 font-bold py-10 px-5 text-xl mt-4">
            <span class="text-black text-2xl">Total</span>
            <span class="text-black">R$ {total },00</span>
          </div>
          <div>
            <button on:click={handleRedirect} disabled={selectedFreight == '' ? true : false} class="btn bg-[#7C3267] w-full mt-4">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>