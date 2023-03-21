<script>
  import Header from "$lib/components/header/Header.svelte";
  import Steps from "$lib/components/steps/Steps.svelte";
  import {cart, currentStep} from "$lib/js/stores/cart.js";

  $cart = []
  $currentStep = 4;
</script>

<Header />

<div class="w-full bg-white flex flex-col items-center">
  <div class="flex justify-center">
    <Steps currentStep={$currentStep} />
  </div>
  <div class="mt-10">
    <h1 class="text-2xl font-bold text-center mt-6">Obrigado por comprar conosco!</h1>
    <p class="text-center mt-4">Seu pedido foi realizado com sucesso.</p>

  </div>

</div>