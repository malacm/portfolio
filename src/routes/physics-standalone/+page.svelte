<script lang="ts">
	import '../../app.css';
	import PhysicsSandbox from '$lib/components/PhysicsSandbox.svelte';
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

<svelte:head>
	<title>Physics Sandbox</title>
</svelte:head>

<div class="h-screen bg-black {isMobile ? 'pt-0' : ''}">
	<PhysicsSandbox />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
		background: black;
	}
	
	:global(html) {
		background: black;
	}
	
	:global(*) {
		box-sizing: border-box;
	}
</style> 