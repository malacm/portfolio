<script lang="ts">
	import '../../app.css';
</script>

<svelte:head>
	<title>Physics Sandbox</title>
</svelte:head>

<slot />

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