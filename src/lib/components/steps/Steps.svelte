<script>
  import './steps.scss'
  import cart from '$lib/assets/icons/cart-step.svg'
  import arrow from '$lib/assets/icons/right-arrow.svg'
  import user from '$lib/assets/icons/user-filled.svg'
  import card from '$lib/assets/icons/credit-card.svg'
  import check from '$lib/assets/icons/check-circle.svg'
  import { browser } from '$app/environment'
	import { onMount } from 'svelte';

  let mobile = false

  onMount(() => {
    if(browser){
      if(window.innerWidth <= 768){
        mobile = true
      }else{
        mobile = false
      }
    }

  function handleResize(){
    let windowWidth = window.innerWidth

    if(windowWidth <= 768){
      mobile = true
    }else{
      mobile = false
    }
  }

    window.addEventListener('resize', handleResize);
  })

  export let currentStep
</script>

<div class="container-steps">
  {#if mobile}
    {#if currentStep == 1}
      <div class="step">
        <div class="step-icon">
          <img id="carrinho" class="completed" src={cart} alt="icone do carrinho">
        </div>
        <p class="text-completed">Carrinho</p>
      </div>
      <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
      <div class="step">
        <div class="step-icon">
          <img id="identificacao" class={currentStep >= 2 ? "completed" : ''} src={user} alt="icone de Identificação">
        </div>
        <p class={currentStep >= 2 ? "text-completed" : ''}>Identificação</p>
      </div>
    {/if}

    {#if currentStep == 2}
      <div class="step">
        <div class="step-icon">
          <img id="identificacao" class={currentStep >= 2 ? "completed" : ''} src={user} alt="icone de Identificação">
        </div>
        <p class={currentStep >= 2 ? "text-completed" : ''}>Identificação</p>
      </div>
      <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
      <div class="step">
        <div class="step-icon">
          <img id="pagamento" class={currentStep >= 3 ? "completed" : ''} src={card} alt="icone de pagamento">
        </div>
        <p class={currentStep >= 3 ? "text-completed" : ''}>Pagamento</p>
      </div>
    {/if}

    {#if currentStep == 3}
      <div class="step">
        <div class="step-icon">
          <img id="pagamento" class={currentStep >= 3 ? "completed" : ''} src={card} alt="icone de pagamento">
        </div>
        <p class={currentStep >= 3 ? "text-completed" : ''}>Pagamento</p>
      </div>
      <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
      <div class="step">
        <div class="step-icon">
          <img id="concluido" class={currentStep >= 4 ? "completed" : ''} src={check} alt="icone de concluido">
        </div>
        <p class={currentStep >= 4 ? "text-completed" : ''}>Concluir</p>
      </div>
    {/if}

    {#if currentStep == 4}
      <div class="step">
        <div class="step-icon">
          <img id="concluido" class={currentStep >= 4 ? "completed" : ''} src={check} alt="icone de concluido">
        </div>
        <p class={currentStep >= 4 ? "text-completed" : ''}>Concluir</p>
      </div>
    {/if}

  {:else}
  <div class="step">
    <div class="step-icon">
      <img id="carrinho" class="completed" src={cart} alt="icone do carrinho">
    </div>
    <p class="text-completed">Carrinho</p>
  </div>
  <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
  <div class="step">
    <div class="step-icon">
      <img id="identificacao" class={currentStep >= 2 ? "completed" : ''} src={user} alt="icone de Identificação">
    </div>
    <p class={currentStep >= 2 ? "text-completed" : ''}>Identificação</p>
  </div>

  <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
  <div class="step">
    <div class="step-icon">
      <img id="pagamento" class={currentStep >= 3 ? "completed" : ''} src={card} alt="icone de pagamento">
    </div>
    <p class={currentStep >= 3 ? "text-completed" : ''}>Pagamento</p>
  </div>
  <div class="step-arrow"><img src={arrow} alt="seta para a direita"></div>
  <div class="step">
    <div class="step-icon">
      <img id="concluido" class={currentStep >= 4 ? "completed" : ''} src={check} alt="icone de concluido">
    </div>
    <p class={currentStep >= 4 ? "text-completed" : ''}>Concluir</p>
  </div>
  {/if}

 
</div>