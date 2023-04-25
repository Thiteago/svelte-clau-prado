<script>
  import smallLogo from '$lib/assets/img/logo-clau.png'
  import paypal from '$lib/assets/icons/paypal.svg'
</script>

<footer class="w-full items-center flex flex-col bg-[#632c52]">
  <div class="w-8/12 pt-6">
      <a href="/" class="flex items-end font-bold text-white gap-4 text-3xl">
        <img width=100 src={smallLogo} alt="logo">
        ClauPrado
      </a>
  </div>
  <div class="w-8/12 py-12 flex flex-col sm:flex-row justify-between ">
    <div class="flex flex-col gap-2">
      <p class="text-white">📞 (12)997431974</p>
      <p class="text-white">✉️ clauprado@gmail.com</p>
      <p class="text-white">🚚 Entrega para todo o <strong>Vale do Paraíba</strong></p>
    </div>
    <div class="flex flex-col items-end">
      <span>
        <p class="text-white">Compre com segurança</p>
        <p class="text-white text-right">Pagamento via Paypal</p>
      </span>
      <img width=50 src={paypal} alt="paypal">
    </div>

  </div>
</footer>