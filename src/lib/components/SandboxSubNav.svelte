<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isVisible = false;
	export let activeSubNav: string | null = null;

	const dispatch = createEventDispatcher();

	const subNavItems = [
		{ key: 'canvas', label: 'CANVAS' },
		{ key: 'threejs', label: 'THREE.JS' },
		{ key: 'shaders', label: 'SHADERS' },
		{ key: 'physics', label: 'PHYSICS' },
		{ key: 'ai', label: 'AI' }
	];

	function handleSubNavClick(key: string) {
		activeSubNav = key;
		dispatch('subnavchange', { key });
	}
</script>

{#if isVisible}
	<div class="absolute top-8 left-48 z-20 flex flex-col space-y-2 transition-all duration-300 ease-out">
		{#each subNavItems as item}
			<div
				class="font-sharpie cursor-pointer transition-all duration-300 ease-out hover:opacity-80 hover:scale-105 px-4 py-2 text-lg text-white border-l-2 border-white border-opacity-30 hover:border-opacity-100"
				on:click={() => handleSubNavClick(item.key)}
				on:keydown={(e) => e.key === 'Enter' && handleSubNavClick(item.key)}
				role="button"
				tabindex="0"
				aria-label={`Switch to ${item.label} sandbox`}
				class:border-opacity-100={activeSubNav === item.key}
				class:opacity-50={activeSubNav !== item.key}
			>
				{item.label}
			</div>
		{/each}
	</div>
{/if}

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style> 