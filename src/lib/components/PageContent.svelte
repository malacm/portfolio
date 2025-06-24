<script lang="ts">
	export let page: string;
</script>

<div class="h-full w-full">
	{#if page === 'About'}
		<div class="relative z-10 flex h-full w-full flex-col gap-8 text-white">
			<!-- Top Section -->
			<div class="relative h-[140px] w-full">
				<div class="relative z-10 p-6 pl-10">
					<h1 class="font-sharpie mb-2 text-3xl">Hey, I'm Marco 👋</h1>
					<p>
						I build expressive, playful web experiences using code, creativity, and a lot of
						sketching.
					</p>
				</div>
			</div>

			<!-- Middle Section (Two Columns) -->
			<div class="flex w-full gap-8">
				<!-- Left Box -->
				<div class="relative h-[200px] flex-1">
					<div class="relative z-10 p-6 pl-10">
						<h2 class="font-sharpie mb-2 text-2xl">Day to Day</h2>
						<p class="text-sm leading-relaxed">
							You'll usually find me sketching wireframes, tweaking CSS by hand, or experimenting
							with WebGL.
						</p>
					</div>
				</div>

				<!-- Right Box -->
				<div class="relative h-[200px] flex-1">
					<div class="relative z-10 p-6 pl-10">
						<h2 class="font-sharpie mb-2 text-2xl">Fun Facts</h2>
						<ul class="list-inside list-disc text-sm leading-loose">
							<li>Collects MPCs 🎛️</li>
							<li>Loves Sharpies 🖊️</li>
							<li>Figma-free Fridays 💡</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Bottom Section -->
			<div class="relative h-[160px] w-full">
				<div class="relative z-10 p-6 pl-10">
					<h2 class="font-sharpie mb-4 text-2xl">Tools I Use</h2>
					<div class="grid grid-cols-3 gap-2 font-mono text-sm">
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
			<div class="font-sharpie mt-4 w-full pr-4 text-right text-2xl">— Marco</div>
		</div>
	{:else if page === 'Portfolio'}
		<div class="text-3xl text-white">Selected Projects</div>
	{:else if page === 'Sandbox'}
		<div class="text-3xl text-white">Fun Experiments</div>
	{/if}
</div>
