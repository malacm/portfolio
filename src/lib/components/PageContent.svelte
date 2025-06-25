<script lang="ts">
	export let page: string;
	import { onMount } from 'svelte';

	let isMobile = false;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}
</script>

<div class="h-full w-full">
	{#if page === 'About'}
		<div class="relative z-10 flex h-full w-full flex-col gap-8 text-white {isMobile ? 'gap-4' : ''}">
			<!-- Top Section -->
			<div class="relative w-full {isMobile ? 'h-auto' : 'h-[140px]'}">
				<div class="relative z-10 p-6 pl-10 {isMobile ? 'p-4 pl-4' : ''}">
					<h1 class="font-sharpie mb-2 text-3xl {isMobile ? 'text-2xl' : ''}">Hey, I'm Marco 👋</h1>
					<p class="{isMobile ? 'text-sm' : ''}">
						I build expressive, playful web experiences using code, creativity, and a lot of
						sketching.
					</p>
				</div>
			</div>

			<!-- Middle Section (Two Columns on desktop, single column on mobile) -->
			<div class="flex w-full gap-8 {isMobile ? 'flex-col gap-4' : ''}">
				<!-- Left Box -->
				<div class="relative flex-1 {isMobile ? 'h-auto' : 'h-[200px]'}">
					<div class="relative z-10 p-6 pl-10 {isMobile ? 'p-4 pl-4' : ''}">
						<h2 class="font-sharpie mb-2 text-2xl {isMobile ? 'text-xl' : ''}">Day to Day</h2>
						<p class="text-sm leading-relaxed {isMobile ? 'text-xs' : ''}">
							You'll usually find me sketching wireframes, tweaking CSS by hand, or experimenting
							with WebGL.
						</p>
					</div>
				</div>

				<!-- Right Box -->
				<div class="relative flex-1 {isMobile ? 'h-auto' : 'h-[200px]'}">
					<div class="relative z-10 p-6 pl-10 {isMobile ? 'p-4 pl-4' : ''}">
						<h2 class="font-sharpie mb-2 text-2xl {isMobile ? 'text-xl' : ''}">Fun Facts</h2>
						<ul class="list-inside list-disc text-sm leading-loose {isMobile ? 'text-xs' : ''}">
							<li>Collects MPCs 🎛️</li>
							<li>Loves Sharpies 🖊️</li>
							<li>Figma-free Fridays 💡</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Bottom Section -->
			<div class="relative w-full {isMobile ? 'h-auto' : 'h-[160px]'}">
				<div class="relative z-10 p-6 pl-10 {isMobile ? 'p-4 pl-4' : ''}">
					<h2 class="font-sharpie mb-4 text-2xl {isMobile ? 'text-xl' : ''}">Tools I Use</h2>
					<div class="grid gap-2 text-sm font-sharpie {isMobile ? 'grid-cols-2 text-xs' : 'grid-cols-3'}">
						<span>🧠 SvelteKit</span>
						<span>🎨 Figma</span>
						<span>🌐 Three.js</span>
						<span>🧩 Tailwind CSS</span>
						<span>🪶 Rough.js</span>
						<span>🚀 Vercel</span>
					</div>
				</div>
			</div>

			<!-- Signature -->
			<div class="font-sharpie mt-4 w-full pr-4 text-right text-2xl {isMobile ? 'text-xl' : ''}">— Marco</div>
		</div>
	{:else if page === 'Portfolio'}
		<div class="text-3xl text-white {isMobile ? 'text-2xl' : ''}">Selected Projects</div>
	{:else if page === 'Sandbox'}
		<div class="text-3xl text-white {isMobile ? 'text-2xl' : ''}">Fun Experiments</div>
	{/if}
</div>
