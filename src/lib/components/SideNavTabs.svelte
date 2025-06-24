<script lang="ts">
	export let activePage: string;
	export let tabList: string[] = ['About', 'Portfolio', 'Sandbox'];

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function clickTab(tab: string) {
		dispatch('tabClick', tab);
	}
</script>

<div class="flex flex-col justify-center gap-4 border-l-4 border-white px-2 py-6 h-full">
	{#each tabList as tab}
		<button
			class={`origin-right border-r-4 px-2 py-1 text-sm whitespace-nowrap font-sharpie
          ${tab === activePage ? 'border-white bg-white text-black' : 'border-transparent text-white'} transition-all duration-200`}
			on:click={() => clickTab(tab)}
		>
			{tab}
		</button>
	{/each}
</div>

<style>
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
