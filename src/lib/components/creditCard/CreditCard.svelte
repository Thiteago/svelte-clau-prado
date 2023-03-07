<script>
  import './creditCard.scss'
  import { resume } from '$lib/js/stores/cart.js'
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  
  export let submitPayment
  let vezes
  let cardName = ""
  let cardNumber = ""
  let cardMonth = ""
  let cardYear = ""
  let cardCvv = ""
  let minCardYear = new Date().getFullYear()
  let amexCardMask = "#### ###### #####"
  let otherCardMask = "#### #### #### ####"
  let cardType;
  let isCardFlipped = false
  let focusElementStyle = null
  let isInputFocused = false
  let refs = {}
  let cardNumberMask;
  
  onMount(function() {
    document.getElementById("cardNumber").focus();
  })
  
  function handlePayment(metodo){
    $resume = {...$resume, metodoPagamento: metodo, cartao: {nome: cardName, numero: cardNumber,validade: `${cardMonth}`+'/'+`${cardYear}`, bandeira: cardType, cvv: cardCvv}, vezes}
    submitPayment(metodo)
  }

  
  $: cardMonth = cardMonth < minCardMonth ? '' : cardMonth
  $: minCardMonth = cardYear === minCardYear ? new Date().getMonth() + 1 : 1
  
  $: {
    if (cardNumber.match(new RegExp("^(34|37)")) != null) cardType = "amex";
    else if (cardNumber.match(new RegExp("^5[1-5]")) != null) cardType = "mastercard";
    else if (cardNumber.match(new RegExp("^6011")) != null) cardType = "discover";
    else cardType = "visa"; // default type
  
    cardNumberMask = cardType === "amex" ? amexCardMask : otherCardMask;
  
    // Credit card input masking
    
    for (let index = 0; index < cardNumber.length; index++) {
      if (cardNumberMask[index] == ' ' && cardNumber[index] !== ' ') cardNumber = cardNumber.substr(0, index) + ' ' + cardNumber.substr(index, cardNumber.length-index)
    }
    if (cardNumber.substr('-1') == ' ') cardNumber = cardNumber.substr(0, cardNumber.length-1)
    cardNumber = cardNumber.substr(0, cardNumberMask.length).replace(/[^0-9 ]/g, '')
  }
  
  function focusInput(e) {
    isInputFocused = true;
    let targetRef = e.target.dataset.ref;
    let target = refs[targetRef];
    focusElementStyle = `opacity: 1;width: ${target.offsetWidth}px;height: ${target.offsetHeight}px;transform: translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
  }
  
  function blurInput() {
    setTimeout(() => {
      if (!isInputFocused) {
        focusElementStyle = null;
      }
    }, 300);
    isInputFocused = false;
  }
  
  
  </script>
  
  <div class="wrapper" id="app">
    <div class="card-form">
      <div class="card-list">
        <div class="card-item" class:active={isCardFlipped}>
          <div class="card-item__side front">
            <div class="card-item__focus" class:active={focusElementStyle} style={focusElementStyle} bind:this={refs.focusElement}></div>
            <div class="card-item__cover">
            </div>
            <div class="card-item__wrapper">
              <div class="card-item__top">
                <img alt="card" src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" class="card-item__chip">
                <div class="card-item__type">
                  {#if cardType}
                    {#each [cardType] as cardType (cardType)}
                      <img in:fly={{y:-20}} out:fly={{y:20}} src={'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + cardType + '.png'} alt="" class="card-item__typeImg">
                    {/each}
                  {/if}
                </div>
              </div>
              <label for="cardNumber" class="card-item__number" bind:this={refs.cardNumber}>	
                {#each cardNumberMask as n, index (index)}
                  <div class="card-item__numberItem" class:active={n.trim() === ''}>
                    {#if cardNumber.length > index}
                      <span in:fly={{y:-10}} out:fly={{y:10}}>{cardNumber[index]}</span>
                    {:else}
                      <span in:fly={{y:-10}} out:fly={{y:10}}>{n}</span>
                    {/if}
                  </div>
                {/each}
              </label>
              <div class="card-item__content">
                <label for="cardName" class="card-item__info" bind:this={refs.cardName}>
                  <div class="card-item__holder">Nome Completo</div>
                    {#if cardName.length}
                      <div class="card-item__name">
                          {#each cardName.replace(/\s\s+/g, ' ') as n, index (index + 1)}
                            {#if index == index}
                              <span in:fly={{y:-6}} class="card-item__nameItem" >{n}</span>
                            {/if}
                          {/each}
                      </div>
                    {:else}
                      <div in:fly={{y:-6}} class="card-item__name placeholder">EXEMPLO EXEMPLO</div>
                    {/if}
                </label>
                <div class="card-item__date" bind:this={refs.cardDate}>
                  <label for="cardMonth" class="card-item__dateTitle">Expires</label>
                  <label for="cardMonth" class="card-item__dateItem">
                    {#each [cardMonth] as cardMonth (cardMonth)}
                      <span in:fly={{y:-6}} out:fly={{y:6}}>{cardMonth || 'MM'}</span>
                    {/each}
                  </label>
                  <span class="text-white">/</span>
                  <label for="cardYear" class="card-item__dateItem">
                    <!-- <transition name="slide-fade-up"> -->
                    {#each [cardYear] as cardYear (cardYear)}
                      <span in:fly={{y:-6}} out:fly={{y:6}}>{cardYear ? String(cardYear).slice(2,4) : 'YY'}</span>
                    {/each}
                    
                    <!-- </transition> -->
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="card-item__side back">
            <div class="card-item__cover">
            </div>
            <div class="card-item__band"></div>
            <div class="card-item__cvv">
                <div class="card-item__cvvTitle">CVV</div>
                <div class="card-item__cvvBand">{cardCvv}</div>
                <div class="card-item__type">
                  {#if cardType}
                    {#each [cardType] as cardType (cardType)}
                      <img in:fly={{y:-20}} out:fly={{y:20}} alt="card" src={'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + cardType + '.png'} class="card-item__typeImg">
                    {/each}
                  {/if}
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-form__inner">
        <div class="card-input">
          <label for="cardNumber" class="card-input__label">Numero do Cartao</label>
          <input type="text" id="cardNumber" class="card-input__input" v-mask="generateCardNumberMask" bind:value={cardNumber} on:focus={focusInput} on:blur={blurInput} data-ref="cardNumber" autocomplete="off">
        </div>
        <div class="card-input">
          <label for="cardName" class="card-input__label">Nome impresso no Cartão</label>
          <input type="text" id="cardName" class="card-input__input" bind:value={cardName} on:focus={focusInput} on:blur={blurInput} data-ref="cardName" autocomplete="off">
        </div>
        <div class="card-form__row">
          <div class="card-form__col">
            <div class="card-form__group">
              <label for="cardMonth" class="card-input__label">Validade</label>
              <select class="card-input__input select" id="cardMonth" bind:value={cardMonth} on:focus={focusInput} on:blur={blurInput} data-ref="cardDate">
                <option value="" disabled selected>Mês</option>
                {#each Array(12) as _, n}
                  <option value={(n+1) < 10 ? '0' + (n+1) : (n+1)} disabled={(n+1) < minCardMonth}>
                      {(n+1) < 10 ? '0' + (n+1) : (n+1)}
                  </option>
                {/each}
              </select>
              <select class="card-input__input select" id="cardYear" bind:value={cardYear} on:focus={focusInput} on:blur={blurInput} data-ref="cardDate">
                <option value="" disabled selected>Ano</option>
                {#each Array(12) as _, n}
                  <option value={n + minCardYear}>
                      {n + minCardYear}
                  </option>
                {/each}
              </select>
            </div>
          </div>
          <div class="card-form__col cvv">
            <div class="card-input">
              <label for="cardCvv" class="card-input__label">CVV</label>
              <input type="text" class="card-input__input" id="cardCvv" v-mask="'####'" maxlength="4" bind:value={cardCvv} on:focus={() => isCardFlipped = true} on:blur={() => isCardFlipped = false} autocomplete="off">
            </div>
          </div>
        </div>
        <div class="card-input__label">Forma de pagamento</div>
        <select class="select select-bordered w-full" bind:value={vezes}>
          <option value="avista" selected>À vista - R$ {$resume.total},00</option>
          {#each Array(12) as _, i}
            <option value="parcelado">Parcelado em {i + 2}x de R$ {($resume.total / (i + 2)).toFixed(2)} </option>
          {/each}
        </select>
        <button on:click={() => handlePayment('cartao')} class="btn bg-[#7C3267] w-full mt-4">Prosseguir</button>
      </div>
    </div>
  </div>