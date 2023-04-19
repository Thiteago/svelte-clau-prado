<script>
  import twitter from '$lib/assets/icons/twitter.svg'
  import facebook from '$lib/assets/icons/facebook.svg'
  import instagram from '$lib/assets/icons/instagram.svg'
  import locationpin from '$lib/assets/icons/location-pin.svg'
  import email from '$lib/assets/icons/email.svg'
</script>

<div style="z-index: 5" class="flex relative items-center justify-between px-12 bg-white py-3 my-1 shadow-sm">
  <div class="flex gap-12">
    <div class="flex gap-1">
      <img width="15" src={email} alt="icone de arroba">
      <p>clauprado@gmail.com</p>
    </div>
    <div class="flex gap-1">
      <img width="15" src={locationpin} alt="icone de localização">
      <p>Entrega para todo o Vale do Paraíba!</p>
    </div>
  </div>
  <div class="flex gap-6">
    <span><img width="25" src={twitter} alt="logo do twitter"></span>
    <span><img width="25" src={facebook} alt="logo do facebook"/></span>
    <span><img width="25" src={instagram} alt="logo do instagram"></span>
  </div>
</div>