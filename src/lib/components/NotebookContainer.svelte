<script lang="ts">
	import SideNavTabs from './SideNavTabs.svelte';
	import PageContent from './PageContent.svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';

	let activePage: string = 'About';

	function handleTabClick(page: string) {
		if (page === activePage) return;
		activePage = page;
	}

	let containerEl: HTMLDivElement | undefined;
</script>

<div class="font-sharpie flex max-h-[100vh] min-h-screen items-center justify-center p-4">
	<div class="relative aspect-[4/3] max-h-[100vh] min-h-[500px] w-full p-2 flex justify-center items-center">
		<!-- HandDrawnBorder wrapper with notebook content inside -->
		<div class="max-w-[1440px]">
			<HandDrawnBorder height="85vh" width="85vw">
				<div class="flex h-full w-full bg-transparent">
					<!-- Page Content Area -->
					<div class="relative h-full flex-1 overflow-auto bg-transparent p-8">
						<PageContent page={activePage} />
					</div>
					<!-- Right-side nav -->
					<div class="w-32 flex-shrink-0">
						<SideNavTabs on:tabClick={(e) => handleTabClick(e.detail)} {activePage} />
					</div>
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
