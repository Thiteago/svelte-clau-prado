<script>
  import Header from '$lib/components/header/Header.svelte';
  import { PUBLIC_BACKEND_URL } from '$env/static/public'
	import Steps from '$lib/components/steps/Steps.svelte';
  import { fetchAddress, formatToCurrency } from '$lib/js/helpers';
  // @ts-ignore
  import { imask } from '@imask/svelte'
  import { cart, resume } from '$lib/js/stores/cart.js'
  import { user, signed } from '$lib/js/stores/login.js'
  import leftArrow from '$lib/assets/icons/left-arrow.svg'
  import trash from '$lib/assets/icons/trash-icon.svg'
  import rightArrow from '$lib/assets/icons/right-arrow-qtde.svg'
  import location from '$lib/assets/icons/location-pin.svg'
  import truck from '$lib/assets/icons/truck-icon.svg'
  import resumeIcon from '$lib/assets/icons/resume-cart.svg'
  import { goto } from '$app/navigation';
  import './carrinho.scss'
	import { onMount } from 'svelte';
	import Loading from '$lib/components/loading/Loading.svelte';

  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };

  let today = new Date().toISOString().substr(0, 10)
  let loading = false
  let freightInfo = {}
  let total = 0
  let subtotal = 0
  let selectedEndereco
  let enderecos = []

  $: limitDate = ''
  $: validateForm = true
  $: cepValidates = true
  $: selectedFreight = ''
  $: cep = '';
  $: alugados = $cart.filter(element => element.Aluguel.length > 0)
  $: comprados = $cart.filter(element => element.Venda.length > 0)
  $: data_inicio_aluguel = ''
  $: data_final_aluguel = ''
  $: diasAlugados = data_inicio_aluguel != '' && data_final_aluguel != '' ? (new Date(data_final_aluguel).getTime() - new Date(data_inicio_aluguel).getTime()) / (1000 * 3600 * 24) : 0
  
  $: if(alugados.length > 0 && data_inicio_aluguel != ''){
    const initialDate = new Date(data_inicio_aluguel);
    limitDate = new Date(initialDate.getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString().substr(0, 10);
  }

  $: if (selectedEndereco){
    freightInfo = {}
    cep = selectedEndereco.cep
  }

  $: if(selectedFreight != ''){
    validateForm = true
    if(alugados.length > 0){
      if(data_inicio_aluguel == '' || data_final_aluguel == ''){
        validateForm = false
      }
    }
  }else{
    validateForm = false
  }

  $: if($cart){
    subtotal = 0
    alugados.forEach(element => {
      subtotal += element.quantidade * element.valor
      if(diasAlugados > 0){
        subtotal = subtotal * (diasAlugados+1)
      }
    })
    comprados.forEach(element => {
      subtotal += element.quantidade * element.valor
    })
};

  function createResume(){

    if(alugados.length > 0){
      alugados.forEach(element => {
        element.Aluguel.forEach(item => {
          item.data_aluguel = data_inicio_aluguel
          item.data_expiracao =  data_final_aluguel
          item.dias_alugados = diasAlugados
        })
      })
    }

    $resume = {
      total: total,
      tipo_frete: selectedFreight,
      valor_frete: selectedFreight == 'PAC' ? freightInfo?.valorpac : freightInfo?.valorsedex,
      cartItens: $cart, 
      idUser: $user.id,
      endereco: selectedEndereco,
    }
  }

  function handleRedirect(){
    createResume()
    if($signed )
      goto('/carrinho/step3')
    else{
      goto('/login?origin=carrinho')
    }
  }

  function removeProduct(id){
    $cart = $cart.filter(element => element.id != id)
  }

  async function freightCalculate(){
    loading = true
    if(cep?.length < 9 || cep == ''){
      cepValidates = false
      return
    }else{
      cepValidates = true
      cep = cep.replace('-', '')
    }
    if(cepValidates){
      await fetch(`${PUBLIC_BACKEND_URL}/carrinho/frete/${cep}`)
      .then(res => res.json())
      .then(data => {
        freightInfo = data
        if(freightInfo?.valorpac == '0,00' && freightInfo?.valorsedex == '0,00'){
          cepValidates = false
        }
      })
    }
    loading = false
  }

  $: if(selectedFreight == 'PAC'){
    total = subtotal + parseFloat(freightInfo?.valorpac)
  }else if(selectedFreight == 'SEDEX'){
    total = subtotal + parseFloat(freightInfo?.valorsedex)
  }else{
    total = subtotal
  }

  onMount(async () => {
    enderecos = await fetchAddress($user.id)
    selectedEndereco = enderecos.find(element => element.principal == true)
  })

</script>

<Header />
<div class="w-full bg-white flex flex-col items-center">
  <div class="flex justify-center">
    <Steps currentStep={1} />
  </div>

  <div class="flex w-11/12 mt-8">
    <div class="flex w-full gap-10">
      <div class="w-4/12">
        <div class="flex items-center gap-2 ">
          <img class="w-6 h-6" src={truck} alt="">
          <h1 class="text-xl font-poppins font-bold">Calcular prazo e frete</h1>
        </div>
        <div class="mt-3">
          <form class="flex w-11/12 gap-2 items-center" on:submit={freightCalculate}>
            <input required bind:value={cep} type="text" placeholder="CEP" use:imask={optionsCEP} class="input input-bordered w-full max-w-xs" />
            <button disabled={$cart.length < 1 ? true : false} type="submit" class="btn bg-[#7C3267]">Calcular</button>
          </form>
          {#if cepValidates != true}
            <span class="text-red-500 font-bold block mt-2">CEP Inválido!</span>
          {/if}
        </div>
        {#if loading}
          <div class="w-9/12 flex justify-center mt-4">
            <Loading />
          </div>
        {/if}
        {#if Object.keys(freightInfo).length > 0 && freightInfo?.valorpac != '0,00' && freightInfo?.valorsedex != '0,00'}
          <div>
            <div class="mt-4">
              <h1 class="text-xl font-poppins font-bold">Frete</h1>
              <div class="mt-2 w-9/12 flex flex-col justify-center">
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
        <div class="w-full flex items-center gap-5 py-5">
          <div class="w-1/2 h-px bg-black"></div>
          <span>Ou</span>
          <div class="w-1/2 h-px bg-black"></div>
        </div>
        <div>
          <div class="flex gap-2">
            <img class="w-6 h-6" src={location} alt="">
            <h1 class="text-xl font-poppins font-bold">Selecione seu endereço</h1>
          </div>
          <div>
            {#each enderecos as endereco}
              {#if endereco.principal}
                <div class="flex flex-col bg-[#7C3267] py-2 rounded px-2 w-full my-2">
                  <div class="flex">
                    <div class="w-11/12 text-white">
                      {endereco.rua}, {endereco.numeroRua}, {endereco.bairro}, {endereco.cidade} - {endereco.estado}, {endereco.cep}
                    </div>
                    <div class="w-1/12">
                      <input name="endereco" bind:group={selectedEndereco} type="radio" value={endereco}>
                    </div>
                  </div>
                  <div class="flex justiy-left pt-3">
                    <span class="text-white font-bold text-left">PRINCIPAL</span>
                  </div>
                </div>
              {:else}
                <div class="flex py-2 px-2 w-3/4 items-center my-2 justify-center">
                  <div class="w-11/12">
                    {endereco.rua}, {endereco.numeroRua}, {endereco.bairro}, {endereco.cidade} - {endereco.estado}, {endereco.cep}
                  </div>
                  <div class="w-1/12">
                    <input name="endereco" bind:group={selectedEndereco} type="radio" value={endereco}>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
      <div class="flex gap-3 flex-col w-3/5">
        {#if $cart.length > 0}
          {#if comprados.length > 0}
            <h1 class="bg-[#7C3267] rounded w-1/2 text-white pl-3 py-2">Voce esta <b>Comprando</b></h1>
            {#each comprados as product}
              <div class="flex gap-8 items-center justify-evenly w-full">
                <div class="w-1/12">
                    <img class="w-20 h-20 object-cover" src='http://localhost:3333/static/{product.imagens}' alt="">
                </div>
                <div class="flex flex-col justify-center w-2/5">
                  <span class="text-black font-bold">{product.nome}</span>
                  <span class="text-gray-500 block">Voce esta <span class="font-bold text-black">COMPRANDO</span> esse produto</span>
                </div>
                <div class="flex flex-col items-center justify-center w-1/12">
                  <div class="flex flex-col items-center">
                    <label for="quantidade">Quant.</label>
                    <div class="flex items-center justify-center">
                      <button on:click={() => {product.quantidade > 1 ? product.quantidade-- : ''}} class="w-4">
                        <img src={leftArrow} alt="">
                      </button>
                      <input name="quantidade" class="input-number w-11 text-center" min="1" type="number" value={product.quantidade} readonly>
                      <button on:click={() => {product.quantidade != product.Venda.length ? product.quantidade++ : ''}} class="w-4">
                        <img src={rightArrow} alt="">
                      </button>
                    </div>
                  </div>
                </div>
                <div class="text-right w-1/5">
                  <p>Preço à vista</p>
                  <p class="font-bold text-[#7C3267]">{formatToCurrency(product.quantidade * product.valor)}</p>
                </div>

                  <div>
                    <button on:click={() => {removeProduct(product.id)}} class="bg-[#7C3267] text-white px-3 py-1 rounded"><img width="25" height="25" src={trash} class="white-icon" alt="icon representing an trash"></button>
                  </div>
              </div>
              <span class="bg-slate-200 w-full h-2"></span>
            {/each}
          {/if}
          {#if alugados.length > 0}
            <h1 class="bg-[#7C3267] mb-5 rounded w-1/2 text-white pl-3 py-2">Voce esta <b>Alugando</b></h1>
            {#each alugados as product}
            <div class="flex items-center justify-evenly w-full">
              <div class="w-1/12">
                <img class="w-20 h-20 object-cover" src='http://localhost:3333/static/{product.imagens}' alt="">
              </div>
              <div class="flex flex-col justify-center w-2/5">
                <span class="text-black font-bold">{product.nome}</span>
                <span class="text-gray-500 block">Voce esta <span class="font-bold text-black">ALUGANDO</span> esse produto</span>
              </div>
              <div class="flex flex-col items-center justify-center w-1/12">
                <div class="flex flex-col items-center">
                  <label for="quantidade">Quant.</label>
                  <div class="flex items-center justify-center">
                    <button on:click={() => {product.quantidade > 1 ? product.quantidade-- : ''}} class="w-4">
                      <img src={leftArrow} alt="">
                    </button>
                    <input name="quantidade" class="input-number w-11 text-center" min="1" type="number" value={product.quantidade} readonly>
                    <button on:click={() => {product.quantidade != product.Aluguel.length ? product.quantidade++ : ''}} class="w-4">
                      <img src={rightArrow} alt="">
                    </button>
                  </div>
                </div>
              </div>
              <div class="text-right w-1/5">
                <p>Preço à vista</p>
                <div class="flex justify-end gap-2">
                  {#if diasAlugados > 0}
                    <span>{diasAlugados+1}x</span>
                  {/if}
                  <p class="font-bold text-[#7C3267]">{ formatToCurrency(product.quantidade * product.valor)}</p>
                </div>
              </div>

              <div>
                <button on:click={() => {removeProduct(product.id)}} class="bg-[#7C3267] text-white px-3 py-1 rounded"><img width="25" height="25" src={trash} class="white-icon" alt="icon representing an trash"></button>
              </div>
            </div>
            <span class="bg-slate-200 w-full h-2"></span>
            {/each}
            <div class="text-center">
              <h2 class="rounded text-xl w-full text-black font-bold pl-3">Para quais dias voce precisa</h2>
              <span class="text-sm">(válido para os itens alugados)</span>
            </div>
            <div class="w-11/12 flex flex-col m-auto">
              <div class="w-full flex flex-col">
                <span>Do dia</span>
                <input bind:value={data_inicio_aluguel} class="input input-bordered input-date" min={today} type="date">
              </div>
              <div class="w-full flex flex-col">
                <span>Até o dia</span>
                <input bind:value={data_final_aluguel} class="input input-bordered input-date" min={data_inicio_aluguel} max={limitDate} type="date">
                <span class="mt-1">(Limite de Aluguel de no máximo 16 dias)</span>
              </div>
              {#if data_inicio_aluguel && data_final_aluguel}
                <div class="mt-2">
                  <span class="font-bold text-lg">Voce esta alugando por {diasAlugados+1} dia(s)</span>
                </div>
              {/if}
            </div>
          {/if}
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
            <span class="text-gray-500">{formatToCurrency(subtotal)}</span>
          </div>
          <div class="flex justify-between mt-4">
            <span class="text-gray-500">Frete</span>
            <span class="text-gray-500">R$ {selectedFreight == 'PAC' ? freightInfo?.valorpac : selectedFreight == 'SEDEX' ? freightInfo?.valorsedex : '0,00'}</span>
          </div>
          <div class="flex flex-col justify-center items-center bg-green-200 font-bold py-10 px-5 text-xl mt-4">
            <span class="text-black text-2xl">Total</span>
            <span class="text-black">{formatToCurrency(total) }</span>
          </div>
          <div>
            <button on:click={handleRedirect} disabled={!validateForm} class="btn bg-[#7C3267] w-full mt-4">Finalizar compra</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .white-icon{
    filter: invert(99%) sepia(0%) saturate(7500%) hue-rotate(228deg) brightness(102%) contrast(99%)
  }
</style>