<script>
import {SlideData} from './SlideData.js'
import './style.scss'
import nuvem from '$lib/assets/img/nuvem-fundo.png'

$: current = 0

const length = SlideData.length

function nextSlide() {
  if(current == length-1){
    current = 0
  }else if(current < length-1){
    current += 1
  }
}
setInterval(nextSlide, 3000)


</script>



<section class="main-slide">
  <div class="wrapper-slide">
      <div class="legenda">
        {#each SlideData as slide, i}
          <div class={i === current ? 'slide active' : 'slide'}>
            {#if i === current}
              <h1> {slide.title} </h1>
            {/if}
          </div>
        {/each}
        {#each SlideData as slide, i}
          <div class={i === current ? 'slide active' : 'slide'}>
            {#if i === current}
            <p> {slide.describe} </p>
          {/if}
          </div>
        {/each}
          <div class="clouds">
              <img class="max-w-none" src={nuvem} alt="nuvem esquerda"/>
              <img class="max-w-none" src={nuvem} alt="nuvem direita"/>
          </div>
      </div>
      <img class="wrapper-slide -fundo" src={nuvem} alt=""/>
      {#each SlideData as slide, i}
        <div class={i === current ? 'slide active' : 'slide'}>
          {#if i === current}
            <img class="wrapper-slide -mascara " id="teste" src={slide.image} alt="produto imagem"/>
          {/if}
        </div>
      {/each}

  </div>

  <div class="nuvens">
      <div class="Cloud"></div>
  </div>
</section>