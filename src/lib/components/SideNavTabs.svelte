<script lang="ts">
	export let activePage: string;
	export let tabList: string[] = ['About', 'Projects', 'Experience'];
	export let isFixedBottom: boolean = false;
	import { createEventDispatcher, onMount } from 'svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';

	const dispatch = createEventDispatcher();
	let isMobile = false;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	function clickTab(tab: string) {
		dispatch('tabClick', tab);
	}
</script>

{#if isMobile}
	<!-- Mobile Navigation -->
	<div class="flex {isFixedBottom ? 'flex-row justify-around w-full' : 'flex-col justify-center gap-2'} p-4">
		{#each tabList as tab}
			{#if isFixedBottom}
				<HandDrawnBorder height="60px" width="100%">
					<button
						class={`font-sharpie w-full h-full px-3 py-2 text-sm flex-1 mx-1 transition-all duration-200
						${tab === activePage ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
						on:click={() => clickTab(tab)}
					>
						{tab}
					</button>
				</HandDrawnBorder>
			{:else}
				<button
					class={`font-sharpie px-4 py-3 text-lg transition-all duration-200 border-2 border-white
					${tab === activePage ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
					on:click={() => clickTab(tab)}
				>
					{tab}
				</button>
			{/if}
		{/each}
	</div>
{:else}
	<!-- Desktop Navigation -->
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
{/if}

<style>
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
