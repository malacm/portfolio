<script lang="ts">
	export let page: string;
	import { onMount } from 'svelte';
	import Projects from './Projects.svelte';
	import Experience from './Experience.svelte';
	import About from './About.svelte';

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

<div class="h-full w-full {isMobile ? 'p-0 m-0' : ''}">
	{#if page === 'About'}
		<About />
	{:else if page === 'Projects'}
		<Projects />
	{:else if page === 'Experience'}
		<Experience />
	{/if}
</div>
