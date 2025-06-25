<script lang="ts">
	import SideNavTabs from './SideNavTabs.svelte';
	import PageContent from './PageContent.svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';
	import { onMount } from 'svelte';

	let activePage: string = 'About';
	let isMobile = false;
	let showMobileNav = false;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
		if (isMobile) {
			showMobileNav = false;
		}
	}

	function handleTabClick(page: string) {
		if (page === activePage) return;
		activePage = page;
		if (isMobile) {
			showMobileNav = false;
		}
	}

	function toggleMobileNav() {
		showMobileNav = !showMobileNav;
	}

	let containerEl: HTMLDivElement | undefined;
</script>

<div class="font-sharpie flex max-h-[100vh] min-h-screen items-center justify-center p-4 {isMobile ? 'pt-20' : ''}">
	<div class="relative w-full p-2 flex justify-center items-center {!isMobile ? 'aspect-[4/3] max-h-[100vh] min-h-[500px]' : 'min-h-[calc(100vh-5rem)]'}">
		<!-- HandDrawnBorder wrapper with notebook content inside -->
		<div class="max-w-[1440px] w-full h-full">
			<HandDrawnBorder height={isMobile ? "calc(100vh - 6rem)" : "85vh"} width={isMobile ? "95vw" : "85vw"}>
				<div class="flex h-full w-full bg-transparent {isMobile ? 'flex-col' : ''}">
					<!-- Page Content Area -->
					<div class="relative h-full flex-1 overflow-auto bg-transparent p-8 {isMobile ? 'p-4' : ''}">
						<PageContent page={activePage} />
					</div>
					
					<!-- Mobile Navigation Toggle -->
					{#if isMobile}
						<div class="flex-shrink-0 p-2 border-t border-white">
							<button
								class="font-sharpie w-full py-2 text-white transition-all duration-200 hover:bg-white hover:text-black"
								on:click={toggleMobileNav}
							>
								{showMobileNav ? 'HIDE NAV' : 'SHOW NAV'}
							</button>
						</div>
					{/if}
					
					<!-- Navigation -->
					{#if isMobile && showMobileNav}
						<div class="flex-shrink-0 border-t border-white bg-black bg-opacity-50">
							<SideNavTabs on:tabClick={(e) => handleTabClick(e.detail)} {activePage} />
						</div>
					{:else if !isMobile}
						<!-- Right-side nav (desktop only) -->
						<div class="w-32 flex-shrink-0">
							<SideNavTabs on:tabClick={(e) => handleTabClick(e.detail)} {activePage} />
						</div>
					{/if}
				</div>
			</HandDrawnBorder>
		</div>
	</div>
</div>

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style>
