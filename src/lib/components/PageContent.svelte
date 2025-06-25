<script lang="ts">
	export let page: string;
	import { onMount } from 'svelte';
	import Projects from './Projects.svelte';
	import Experience from './Experience.svelte';
	import About from './About.svelte';
	import HandDrawnScrollbar from './HandDrawnScrollbar.svelte';

	let isMobile = false;
	let projectsContainer: HTMLDivElement;
	let experienceContainer: HTMLDivElement;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}
</script>

<div class="h-full w-full {isMobile ? 'p-0 m-0' : ''}">
	{#if page === 'About'}
		<About />
	{:else if page === 'Projects'}
		<div class="relative h-full w-full">
			<div bind:this={projectsContainer} class="h-full w-full overflow-y-auto pr-4">
				<Projects />
			</div>
			{#if projectsContainer}
				<HandDrawnScrollbar container={projectsContainer} />
			{/if}
		</div>
	{:else if page === 'Experience'}
		<div class="relative h-full w-full">
			<div bind:this={experienceContainer} class="h-full w-full overflow-y-auto pr-4">
				<Experience />
			</div>
			{#if experienceContainer}
				<HandDrawnScrollbar container={experienceContainer} />
			{/if}
		</div>
	{/if}
</div>
