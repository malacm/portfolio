<script lang="ts">
	import '../app.css';
	import BackgroundDoodles from '$lib/components/BackgroundDoodles.svelte';
	import HandDrawnCircleBorder from '$lib/components/HandDrawnCircleBorder.svelte';
	import HandDrawnSquareBorder from '$lib/components/HandDrawnSquareBorder.svelte';
	import AnimatedBottomBorder from '$lib/components/AnimatedBottomBorder.svelte';
	import SandboxSubNav from '$lib/components/SandboxSubNav.svelte';
	import CanvasSandbox from '$lib/components/CanvasSandbox.svelte';
	import { fade, slide } from 'svelte/transition';

	type NavSection = 'portfolio' | 'sandbox';
	const navs: { key: NavSection; label: string }[] = [
		{ key: 'portfolio', label: 'PORTFOLIO: WIP' },
		{ key: 'sandbox', label: 'SANDBOX' }
	];

	let activeSection: NavSection = 'portfolio';
	let activeSubNav: string | null = null;
	let showSandboxSubnav = false;

	function handleNavClick(section: NavSection) {
		if (section === 'sandbox') {
			if (activeSection !== 'sandbox') {
				showSandboxSubnav = false;
			}
			activeSection = section;
			if (!activeSubNav) {
				activeSubNav = 'canvas';
			}
			// Reveal subnav on click
			showSandboxSubnav = true;
		} else {
			activeSection = section;
			activeSubNav = null;
			showSandboxSubnav = false;
		}
	}

	function handleSubNavChange(event: CustomEvent) {
		activeSubNav = event.detail.key;
	}
</script>

<div class="relative min-h-screen bg-black">
	<!-- Background Doodles -->
	<BackgroundDoodles />

	<!-- Portfolio Navigation (Left Side) -->
	<div class="absolute top-8 left-8 z-20">
		<HandDrawnCircleBorder
			isVisible={activeSection === 'portfolio'}
			isActive={activeSection === 'portfolio'}
			animateOnHover={false}
		>
			<div
				class="font-sharpie cursor-pointer px-6 py-4 text-2xl text-white transition-all transition-transform duration-300 ease-out hover:scale-105 hover:opacity-80"
				on:click={() => handleNavClick('portfolio')}
				on:keydown={(e) => e.key === 'Enter' && handleNavClick('portfolio')}
				role="button"
				tabindex="0"
				aria-label="Switch to PORTFOLIO section"
				class:opacity-50={activeSection !== 'portfolio'}
			>
				PORTFOLIO: WIP
			</div>
		</HandDrawnCircleBorder>
	</div>

	<!-- Sandbox Navigation (Right Side) -->
	<div class="absolute top-8 right-8 z-20">
		<HandDrawnSquareBorder
			isVisible={activeSection === 'sandbox'}
			isActive={activeSection === 'sandbox'}
			animateOnHover={false}
		>
			<div class="relative flex h-full w-[320px] flex-col items-center justify-center gap-2">
				<div
					class="font-sharpie mb-4 w-full cursor-pointer text-center text-4xl text-white transition-all duration-300 ease-out hover:scale-105 hover:opacity-80"
					on:click={() => handleNavClick('sandbox')}
					on:keydown={(e) => e.key === 'Enter' && handleNavClick('sandbox')}
					role="button"
					tabindex="0"
					aria-label="Activate SANDBOX section"
					class:border-b-2={activeSection === 'sandbox'}
					class:border-white={activeSection === 'sandbox'}
					class:pb-2={activeSection === 'sandbox'}
				>
					SANDBOX
				</div>
				<div
					class="flex w-full flex-col items-center gap-2 transition-all duration-500"
					style="min-height: 220px; justify-content: flex-start;"
				>
					{#if showSandboxSubnav}
						<div transition:slide={{ duration: 350 }} class="flex w-full flex-col items-center">
							{#each [{ key: 'canvas', label: 'CANVAS' }, { key: 'threejs', label: 'THREE.JS' }, { key: 'shaders', label: 'SHADERS' }, { key: 'physics', label: 'PHYSICS' }, { key: 'ai', label: 'AI' }] as item}
								<AnimatedBottomBorder isActive={activeSubNav === item.key}>
									<div
										class="font-sharpie cursor-pointer px-4 py-2 text-center text-lg text-white transition-all duration-300 ease-out hover:scale-105 hover:opacity-80"
										on:click={() => {
											handleNavClick('sandbox');
											activeSubNav = item.key;
										}}
										on:keydown={(e) =>
											e.key === 'Enter' &&
											(handleNavClick('sandbox'), (activeSubNav = item.key))}
										role="button"
										tabindex="0"
										aria-label={`Switch to ${item.label} sandbox`}
										class:opacity-50={activeSubNav !== item.key}
									>
										{item.label}
									</div>
								</AnimatedBottomBorder>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</HandDrawnSquareBorder>
	</div>

	<!-- Content Area -->
	{#if activeSection === 'portfolio'}
		<slot />
	{:else if activeSection === 'sandbox'}
		<div class="font-sharpie flex min-h-screen items-center justify-center p-4">
			<div class="relative aspect-[4/3] max-h-[85vh] min-h-[500px] w-full max-w-[1440px]">
				{#if activeSubNav === 'canvas'}
					<CanvasSandbox />
				{:else}
					<div class="font-sharpie flex h-full items-center justify-center text-4xl text-white">
						{#if activeSubNav === 'threejs'}
							THREE.JS SANDBOX
						{:else if activeSubNav === 'shaders'}
							SHADERS SANDBOX
						{:else if activeSubNav === 'physics'}
							PHYSICS SANDBOX
						{:else if activeSubNav === 'ai'}
							AI SANDBOX
						{:else}
							SANDBOX CONTENT COMING SOON
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style>
