<script>
	import Header from "$lib/components/header/Header.svelte";
  import { currentStep } from "$lib/js/stores/cart.js";
  import Steps from "$lib/components/steps/Steps.svelte";
</script>


<Header tamanho="grande" />
<div class="bg-white">
  <div class="flex justify-center">
    <Steps currentStep={$currentStep} />
  </div>
  <slot />
</div>