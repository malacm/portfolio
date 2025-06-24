<script lang="ts">
	import '../../app.css';
	import PhysicsSandbox from '$lib/components/PhysicsSandbox.svelte';
</script>

<svelte:head>
	<title>Physics Sandbox</title>
</svelte:head>

<div class="h-screen bg-black">
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