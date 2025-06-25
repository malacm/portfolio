<script lang="ts">
	import HandDrawnBorder from './HandDrawnBorder.svelte';
	import { onMount } from 'svelte';
	import HandDrawnIOSWindow from './HandDrawnIOSWindow.svelte';

	interface Project {
		name: string;
		type: string;
		role: string;
		description: string;
		url: string;
	}

	const projects: Project[] = [
		{
			name: '✨ National Geographic Expeditions',
			type: 'Web Application',
			role: 'Lead Frontend Engineer',
			description:
				'Rebrand and rebuild of the National Geographic Expeditions website with modern web technologies.',
			url: 'https://www.expeditions.com/?utm_source=google&utm_medium=paidsearch&utm_campaign=G-US-BRAND-Search-Branded_LEX&utm_term=lindblad%20expeditions&utm_content=&device=c&network=g&gad_source=1&gad_campaignid=1839094478&gclid=CjwKCAjwvO7CBhAqEiwA9q2YJUeBjLDSos6BPVhzwp0x90yT1xjCLhAjJglTSpl0yq997sVPJU18axoCCg8QAvD_BwE'
		},
		{
			name: '✔️ Certifyed',
			type: 'IOS App and Web Application',
			role: 'Partner and Architect',
			description:
				'Partner and Architect of Educational technology platform with innovative learning solutions.',
			url: 'https://certifyde.com/'
		},
		{
			name: '🏠 Silo',
			type: 'Web Application',
			role: 'Motion Designer',
			description: 'Frontend development and Motion Design for Silo.',
			url: 'https://usesilo.com/'
		},
		{
			name: '🎵 Invesco QQQ ETF',
			type: 'Web Application',
			role: 'Frontend Developer',
			description: 'Frontend development for Invesco QQQ ETF. And Creative direction of NCAA collaboration project.',
			url: 'https://www.invesco.com/qqq-etf/en/home.html'
		}
	];

	let isMobile = false;
	let windowOpen = false;
	let windowProject: Project | null = null;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	function openProjectWindow(project: Project) {
		windowProject = project;
		windowOpen = true;
	}

	function closeProjectWindow() {
		windowOpen = false;
		windowProject = null;
	}
</script>

<div class="flex h-full w-full flex-col gap-8 px-6 py-8 text-white sm:px-4 sm:py-6">
	<!-- Header -->
	<div class="w-full">
		<div class="p-6 pl-10 sm:p-4 sm:pl-4">
			<h1 class="font-sharpie mb-2 text-3xl sm:text-2xl">Selected Projects</h1>
			<p class="font-sharpie text-base sm:text-sm">
				A collection of creative experiments and client work that showcase my approach to building
				expressive web experiences.
			</p>
		</div>
	</div>

	<!-- Projects Grid -->
	<div class="flex w-full flex-col gap-6 sm:gap-4">
		{#each projects as project, index}
			<div class="relative w-full">
				<HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%" height="auto">
					<div class="p-6 pl-10 sm:p-4 sm:pl-4">
						<!-- Project Header -->
						<div class="mb-4">
							<h2 class="font-sharpie mb-2 text-2xl sm:text-xl">{project.name}</h2>
							<div class="flex flex-wrap gap-4 text-sm sm:gap-2">
								<span class="font-sharpie rounded-full bg-white/10 px-3 py-1">
									{project.type}
								</span>
								<span class="font-sharpie rounded-full bg-white/10 px-3 py-1">
									{project.role}
								</span>
							</div>
						</div>

						<!-- Project Description -->
						<p class="font-sharpie text-sm leading-relaxed">
							{project.description}
						</p>

						<!-- Project Actions -->
						<div class="mt-4 flex gap-3 sm:gap-2">
							<button
								class="font-sharpie rounded-full bg-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/20 sm:px-3 sm:py-1"
								on:click={() => openProjectWindow(project)}
							>
								View Project →
							</button>
							<button
								class="font-sharpie rounded-full border border-white/20 px-4 py-2 text-sm transition-colors bg-white/10 text-gray-400 cursor-not-allowed sm:px-3 sm:py-1"
								disabled
							>
								Coming Soon
							</button>
						</div>
					</div>
				</HandDrawnBorder>
			</div>
		{/each}
	</div>

	<!-- iOS Window Modal -->
	{#if windowOpen && windowProject}
		<HandDrawnIOSWindow
			open={windowOpen}
			url={windowProject.url}
			title={windowProject.name}
			on:close={closeProjectWindow}
		/>
	{/if}

	<!-- Footer -->
	<div class="font-sharpie mt-6 w-full pr-4 text-right text-lg sm:mt-4">
		More projects coming soon...
	</div>
</div>
