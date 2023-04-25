<script>
import locateIcon from '$lib/assets/icons/location-pin.svg'
import card from '$lib/assets/icons/card.svg'
import locker from '$lib/assets/icons/lock.svg'

</script>
<section class="flex my-6 flex-col gap-5 sm:flex-row items-center border-2 w-9/12 py-8 px-3 justify-center m-auto border-solid border-[#e5eaee]">
	<div class="flex w-full sm:w-1/3 gap-3">
		<img width="45" src={locateIcon} alt="" />
		<div class="flex flex-col gap-3">
			<h2 class="font-bold">Entregas no Vale</h2>
			<p>Encomendas para Campos do Jordão e Região</p>
		</div>
	</div>
	<div class="flex w-full sm:w-1/3 gap-3">
		<img width="45" src={card} alt="" />
		<div class="flex flex-col gap-3">
			<h2 class="font-bold">Parcele Sem Juros</h2>
			<p>Parcele sua compra em até 12x pelo Paypal</p>
		</div>
	</div>
	<div class="flex w-full sm:w-1/3 gap-3">
		<img width="45" src={locker} alt="" />
		<div class="flex flex-col gap-3">
			<h2 class="font-bold">Compre com Segurança</h2>
			<p>Tenha total segurança durante sua compra</p>
		</div>  
	</div>
</section>