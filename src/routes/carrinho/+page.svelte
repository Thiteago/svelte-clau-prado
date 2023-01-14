<script>
  import Header from '$lib/components/header/Header.svelte';
	import Steps from '$lib/components/steps/Steps.svelte';
  import { imask } from '@imask/svelte'
  import location from '$lib/assets/icons/location-pin.svg'
  import './carrinho.scss'

  const optionsCEP = {
    mask: '00000-000',
    lazy: true
  };
  $: cepValidates = true
  let cep = '';

  function freightCalculate(cep){
    console.log(cep.length)
    if(cep?.length < 9 || cep == ''){
      console.log(cep + 'oiii')
      cepValidates = false
      return
    }else{
      cepValidates = true
      cep = cep.replace('-', '')
      console.log(cep)
    }
    // let response = fetch(`http://localhost:3333/carrinho/frete/${cep}`)
  }


</script>

<Header />
<div class="w-full bg-white flex flex-col items-center">
  <div class="flex justify-center">
    <Steps currentStep={1} />
  </div>

  <div class="flex w-9/12 mt-8">
    <div>
      <div>
        <div class="flex items-center gap-2 ">
          <img class="w-6 h-6" src={location} alt="">
          <h1 class="text-xl font-poppins font-bold">Calcular prazo e frete</h1>
        </div>
        <div class="mt-3">
          <form  class="flex gap-2 items-center" action="#">
            <input required bind:value={cep} type="text" placeholder="CEP" use:imask={optionsCEP} class="input input-bordered w-full max-w-xs" />
            <button type="submit" class="btn btn-secondary" on:click={() => freightCalculate(cep)}>Calcular</button>
          </form>
          {#if cepValidates != true}
            <span class="text-red-500 font-bold block mt-2">CEP Inválido!</span>
          {/if}
        </div>
      </div>
    </div>
    <aside></aside>
  </div>

</div>