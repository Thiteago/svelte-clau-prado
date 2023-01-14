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
        <div class="mt-3 flex gap-2 items-center">
          <input type="text" placeholder="CEP" use:imask={optionsCEP} class="input input-bordered w-full max-w-xs" />
          <button class="btn btn-secondary">Calcular</button>
        </div>
      </div>
    </div>
    <aside></aside>
  </div>

</div>