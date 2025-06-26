<script lang="ts">
	import '../app.css';
	import BackgroundDoodles from '$lib/components/BackgroundDoodles.svelte';
	import HandDrawnCircleBorder from '$lib/components/HandDrawnCircleBorder.svelte';
	import HandDrawnSquareBorder from '$lib/components/HandDrawnSquareBorder.svelte';
	import AnimatedBottomBorder from '$lib/components/AnimatedBottomBorder.svelte';
	import SandboxSubNav from '$lib/components/SandboxSubNav.svelte';
	import CanvasSandbox from '$lib/components/CanvasSandbox.svelte';
	import MicroInteractionOne from '$lib/components/MicroInteractionOne.svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import HandDrawnBorder from '$lib/components/HandDrawnBorder.svelte';

	type NavSection = 'portfolio' | 'sandbox';
	const navs: { key: NavSection; label: string }[] = [
		{ key: 'portfolio', label: 'PORTFOLIO: WIP' },
		{ key: 'sandbox', label: 'SANDBOX' }
	];

	let activeSection: NavSection = 'portfolio';
	let activeSubNav: string | null = null;
	let showSandboxDrawer = false;
	let isMobile = false;
	let showMobileMenu = false;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
		if (isMobile) {
			showSandboxDrawer = false;
		}
	}

	function handleNavClick(section: NavSection) {
		if (isMobile) {
			if (section === 'sandbox') {
				showMobileMenu = !showMobileMenu;
			} else {
				activeSection = section;
				activeSubNav = null;
				showMobileMenu = false;
			}
		} else {
			if (section === 'sandbox') {
				activeSection = 'sandbox';
				if (!activeSubNav) activeSubNav = 'canvas';
			} else {
				activeSection = section;
				activeSubNav = null;
			}
		}
	}

	function handleSubNavChange(event: CustomEvent) {
		activeSubNav = event.detail.key;
		if (isMobile) {
			showMobileMenu = false;
		}
	}

	function handleMobileSubNavClick(key: string) {
		activeSection = 'sandbox';
		activeSubNav = key;
		showMobileMenu = false;
	}

	function toggleSandboxDrawer() {
		showSandboxDrawer = !showSandboxDrawer;
	}

	function handleDrawerItemClick(key: string) {
		activeSection = 'sandbox';
		activeSubNav = key;
		showSandboxDrawer = false;
	}
</script>

<div class="relative min-h-screen bg-soft-black">
	<!-- Navigation/Header -->
	<header class="z-30 w-full px-0 pt-0">
		{#if !isMobile}
			<div class="flex w-full items-center justify-between px-8 py-4">
				<!-- Portfolio Navigation (Left Side) -->
				<HandDrawnCircleBorder
					isVisible={activeSection === 'portfolio'}
					isActive={activeSection === 'portfolio'}
					animateOnHover={false}
				>
					<div
						class="font-sharpie cursor-pointer px-6 py-4 text-3xl text-warm-white transition-all transition-transform duration-300 ease-out hover:scale-105 hover:opacity-80"
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

				<!-- Sandbox Navigation (Right Side) -->
				<div class="relative flex items-center">
					<HandDrawnSquareBorder isVisible={false} isActive={false} animateOnHover={false}>
						<div
							class="font-sharpie cursor-pointer px-6 py-4 text-3xl text-warm-white transition-all duration-300 ease-out hover:scale-105 hover:opacity-80"
							on:click={toggleSandboxDrawer}
							on:keydown={(e) => e.key === 'Enter' && toggleSandboxDrawer()}
							role="button"
							tabindex="0"
							aria-label="Open SANDBOX drawer"
						>
							SANDBOX
						</div>
					</HandDrawnSquareBorder>
				</div>
			</div>
		{:else}
			<!-- Mobile Navigation -->
			<div
				class="bg-opacity-90 fixed top-0 right-0 left-0 z-50 border-b border-medium bg-soft-black backdrop-blur-sm"
			>
				<div class="flex items-center justify-between p-4">
					<!-- Portfolio Button -->
					<button
						class="font-sharpie text-xl text-warm-white transition-all duration-200"
						class:opacity-50={activeSection !== 'portfolio'}
						on:click={() => handleNavClick('portfolio')}
					>
						PORTFOLIO
					</button>

					<!-- Sandbox Button -->
					<button
						class="font-sharpie text-xl text-warm-white transition-all duration-200"
						class:opacity-50={activeSection !== 'sandbox'}
						on:click={() => handleNavClick('sandbox')}
					>
						SANDBOX
					</button>
				</div>

				<!-- Mobile Menu -->
				{#if showMobileMenu}
					<div
						transition:slide={{ duration: 300 }}
						class="bg-opacity-95 border-t border-medium bg-soft-black"
					>
						<div class="space-y-2 p-4">
							{#each [{ key: 'canvas', label: 'CANVAS' }, { key: 'physics', label: 'ORBITAL PHYSICS', href: '/physics-standalone' }, { key: 'micro-interaction-one', label: 'MICRO INTERACTION ONE' }] as item}
								{#if item.href}
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										class="font-sharpie block w-full px-4 py-3 text-left text-lg text-warm-white transition-all duration-200 hover:bg-medium-bg hover:text-soft-black"
									>
										{item.label}
									</a>
								{:else}
									<button
										class="font-sharpie block w-full px-4 py-3 text-left text-lg text-warm-white transition-all duration-200 hover:bg-medium-bg hover:text-soft-black"
										class:bg-medium-bg={activeSubNav === item.key}
										class:text-soft-black={activeSubNav === item.key}
										on:click={() => handleMobileSubNavClick(item.key)}
									>
										{item.label}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</header>

	<!-- Sandbox Drawer (Desktop) -->
	{#if !isMobile && showSandboxDrawer}
		<div
			class="fixed top-0 right-0 z-50 w-[400px] h-screen border-l border-medium bg-soft-black shadow-lg"
			transition:slide={{ duration: 300, axis: 'x' }}
		>
			<div class="flex flex-col h-full">
				<!-- Back Arrow Header -->
				<div class="flex justify-end p-4">
					<button
						class="font-sharpie text-2xl text-warm-white hover:opacity-70 transition-opacity duration-200 transform rotate-180 cursor-pointer"
						on:click={toggleSandboxDrawer}
						aria-label="Close drawer"
					>
						←
					</button>
				</div>
				
				<div class="flex flex-1 flex-col px-6 justify-center">
					{#each [{ key: 'canvas', label: 'CANVAS' }, { key: 'physics', label: 'ORBITAL PHYSICS', href: '/physics-standalone' }, { key: 'micro-interaction-one', label: 'MICRO INTERACTION ONE' }] as item}
						{#if item.href}
							<a
								href={item.href}
								target="_blank"
								rel="noopener noreferrer"
								class="font-sharpie mb-2 block w-full cursor-pointer px-4 py-4 text-center text-2xl text-warm-white relative"
								style="min-height: 2.5em;"
							>
								{item.label}
							</a>
						{:else}
							<div
								class="font-sharpie mb-2 block w-full cursor-pointer px-4 py-4 text-center text-2xl text-warm-white relative"
								on:click={() => handleDrawerItemClick(item.key)}
								style="min-height: 2.5em;"
							>
								{item.label}
								{#if activeSubNav === item.key}
									<svg
										width="70%"
										height="16"
										viewBox="0 0 300 12"
										class="absolute left-1/2 bottom-0 transform -translate-x-1/2"
										style="display:block; pointer-events:none;"
									>
										<path
											d="M2 8 Q60 2 150 6 Q240 12 298 6"
											stroke="var(--warm-white)"
											stroke-width="3"
											fill="none"
										/>
									</svg>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Content Area -->
	{#if activeSection === 'portfolio'}
		<div class={isMobile ? 'pt-16' : 'pt-2'}>
			<slot />
		</div>
	{:else if activeSection === 'sandbox'}
		<div
			class="font-sharpie flex min-h-screen items-center justify-center p-4 {isMobile
				? 'pt-16'
				: 'pt-2'}"
		>
			<div
				class="relative w-full max-w-[1440px] {!isMobile
					? 'aspect-[4/3] max-h-[85vh] min-h-[500px]'
					: ''}"
			>
				{#if activeSubNav === 'canvas'}
					<CanvasSandbox />
				{:else if activeSubNav === 'micro-interaction-one'}
					<MicroInteractionOne />
				{:else}
					<div
						class="font-sharpie flex h-full items-center justify-center text-5xl text-warm-white {isMobile
							? 'text-3xl'
							: ''}"
					>
						SANDBOX CONTENT COMING SOON
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
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease;
	}
</style>
