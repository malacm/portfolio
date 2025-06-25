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
	let showSandboxSubnav = false;
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
			showSandboxSubnav = false;
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
</script>

<div class="relative min-h-screen bg-black">
	<!-- Navigation/Header -->
	<header class="w-full z-30 px-0 pt-0">
		{#if !isMobile}
			<div class="flex items-center justify-between w-full px-8 py-4">
				<!-- Portfolio Navigation (Left Side) -->
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

				<!-- Sandbox Navigation (Right Side) -->
				<div class="relative flex items-center">
					<HandDrawnSquareBorder
						isVisible={false}
						isActive={false}
						animateOnHover={false}
					>
						<div
							class="font-sharpie cursor-pointer px-6 py-4 text-2xl text-white transition-all duration-300 ease-out hover:scale-105 hover:opacity-80"
							on:click={() => showSandboxSubnav = !showSandboxSubnav}
							on:keydown={(e) => e.key === 'Enter' && (showSandboxSubnav = !showSandboxSubnav)}
							role="button"
							tabindex="0"
							aria-label="Open SANDBOX subnav"
						>
							SANDBOX
						</div>
					</HandDrawnSquareBorder>
					{#if showSandboxSubnav}
						<!-- Sandbox Subnav Overlay -->
						<div class="fixed top-20 right-8 z-50 w-[340px]" style="pointer-events:auto;">
							<HandDrawnSquareBorder isVisible={true} isActive={true} animateOnHover={false}>
								<div class="flex flex-col items-center w-full">
									<div class="font-sharpie text-4xl text-white text-center py-2">SANDBOX</div>
									<!-- Handdrawn Divider -->
									<svg width="90%" height="12" class="my-2" style="display:block;" viewBox="0 0 300 12"><path d="M2 8 Q60 2 150 6 Q240 12 298 6" stroke="white" stroke-width="3" fill="none"/></svg>
									<div class="flex flex-col w-full gap-2 pb-2">
										{#each [
											{ key: 'canvas', label: 'CANVAS' },
											{ key: 'physics', label: 'ORBITAL PHYSICS' },
											{ key: 'micro-interaction-one', label: 'MICRO INTERACTION ONE' }
										] as item}
											<div
												class="font-sharpie block w-full px-4 py-2 text-center text-lg text-white transition-all duration-300 ease-out hover:bg-white hover:text-black cursor-pointer"
												on:click={() => {
													activeSection = 'sandbox';
													activeSubNav = item.key;
													showSandboxSubnav = false;
												}}
											>
												{item.label}
											</div>
										{/each}
									</div>
								</div>
							</HandDrawnSquareBorder>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Mobile Navigation -->
			<div class="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm border-b border-white">
				<div class="flex items-center justify-between p-4">
					<!-- Portfolio Button -->
					<button
						class="font-sharpie text-lg text-white transition-all duration-200"
						class:opacity-50={activeSection !== 'portfolio'}
						on:click={() => handleNavClick('portfolio')}
					>
						PORTFOLIO
					</button>

					<!-- Sandbox Button -->
					<button
						class="font-sharpie text-lg text-white transition-all duration-200"
						class:opacity-50={activeSection !== 'sandbox'}
						on:click={() => handleNavClick('sandbox')}
					>
						SANDBOX
					</button>
				</div>

				<!-- Mobile Menu -->
				{#if showMobileMenu}
					<div transition:slide={{ duration: 300 }} class="border-t border-white bg-black bg-opacity-95">
						<div class="p-4 space-y-2">
							{#each [{ key: 'canvas', label: 'CANVAS' }, { key: 'physics', label: 'ORBITAL PHYSICS', href: '/physics-standalone' }, { key: 'micro-interaction-one', label: 'MICRO INTERACTION ONE' }] as item}
								{#if item.href}
									<a
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
										class="font-sharpie block w-full text-left px-4 py-3 text-white transition-all duration-200 hover:bg-white hover:text-black"
									>
										{item.label}
									</a>
								{:else}
									<button
										class="font-sharpie block w-full text-left px-4 py-3 text-white transition-all duration-200 hover:bg-white hover:text-black"
										class:bg-white={activeSubNav === item.key}
										class:text-black={activeSubNav === item.key}
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

	<!-- Content Area -->
	{#if activeSection === 'portfolio'}
		<div class={isMobile ? 'pt-16' : 'pt-2'}>
			<slot />
		</div>
	{:else if activeSection === 'sandbox'}
		<div class="font-sharpie flex min-h-screen items-center justify-center p-4 {isMobile ? 'pt-16' : 'pt-2'}">
			<div class="relative w-full max-w-[1440px] {!isMobile ? 'aspect-[4/3] min-h-[500px] max-h-[85vh]' : ''}">
				{#if activeSubNav === 'canvas'}
					<CanvasSandbox />
				{:else if activeSubNav === 'micro-interaction-one'}
					<MicroInteractionOne />
				{:else}
					<div class="font-sharpie flex h-full items-center justify-center text-4xl text-white {isMobile ? 'text-2xl' : ''}">
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
		from { opacity: 0; transform: translateY(-10px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease;
	}
</style>
