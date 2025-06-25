<script lang="ts">
	import HandDrawnBorder from './HandDrawnBorder.svelte';
	import { onMount } from 'svelte';

	interface Project {
		name: string;
		type: string;
		role: string;
		description: string;
	}

	const projects: Project[] = [
		{
			name: 'Interactive Web Experience',
			type: 'Web Application',
			role: 'Full Stack Developer',
			description: 'A playful, interactive web experience built with SvelteKit and Three.js, featuring hand-drawn animations and physics simulations.'
		},
		{
			name: 'Creative Portfolio Platform',
			type: 'Design System',
			role: 'Frontend Developer & Designer',
			description: 'A custom portfolio platform showcasing creative work with hand-drawn UI elements and micro-interactions.'
		},
		{
			name: 'Experimental Canvas Tool',
			type: 'Creative Tool',
			role: 'Creative Developer',
			description: 'A web-based drawing tool that combines Rough.js with custom physics for creating organic, hand-drawn digital art.'
		}
	];

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

<div class="flex flex-col w-full max-w-4xl gap-8 text-white px-6 py-8 sm:px-4 sm:py-6">
	<!-- Header -->
	<div class="w-full">
		<HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
			<div class="p-6 pl-10 sm:p-4 sm:pl-4">
				<h1 class="font-sharpie mb-2 text-3xl sm:text-2xl">Selected Projects</h1>
				<p class="text-base sm:text-sm">
					A collection of creative experiments and client work that showcase my approach to building expressive web experiences.
				</p>
			</div>
		</HandDrawnBorder>
	</div>

	<!-- Projects Grid -->
	<div class="flex w-full flex-col gap-6 sm:gap-4">
		{#each projects as project, index}
			<div class="relative w-full">
				<HandDrawnBorder 
					strokeWidth={2.5}
					roughness={2.2}
					width="100%"
					height="auto"
				>
					<div class="p-6 pl-10 sm:p-4 sm:pl-4">
						<!-- Project Header -->
						<div class="mb-4">
							<h2 class="font-sharpie mb-2 text-2xl sm:text-xl">{project.name}</h2>
							<div class="flex flex-wrap gap-4 sm:gap-2 text-sm">
								<span class="rounded-full bg-white/10 px-3 py-1 font-sharpie">
									{project.type}
								</span>
								<span class="rounded-full bg-white/10 px-3 py-1 font-sharpie">
									{project.role}
								</span>
							</div>
						</div>

						<!-- Project Description -->
						<p class="text-sm leading-relaxed">
							{project.description}
						</p>

						<!-- Project Actions -->
						<div class="mt-4 flex gap-3 sm:gap-2">
							<button class="rounded-full bg-white/10 px-4 py-2 text-sm font-sharpie transition-colors hover:bg-white/20 sm:px-3 sm:py-1">
								View Project →
							</button>
							<button class="rounded-full border border-white/20 px-4 py-2 text-sm font-sharpie transition-colors hover:bg-white/10 sm:px-3 sm:py-1">
								Case Study
							</button>
						</div>
					</div>
				</HandDrawnBorder>
			</div>
		{/each}
	</div>

	<!-- Footer -->
	<div class="font-sharpie mt-6 w-full pr-4 text-right text-lg sm:mt-4">More projects coming soon...</div>
</div> 