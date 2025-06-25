<script lang="ts">
	import SideNavTabs from './SideNavTabs.svelte';
	import PageContent from './PageContent.svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';
	import { onMount } from 'svelte';

	let activePage: string = 'About';
	let isMobile = false;

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	function handleTabClick(page: string) {
		if (page === activePage) return;
		activePage = page;
	}

	$: notebookWidth = isMobile ? '95vw' : '80vw';
	$: notebookHeight = isMobile ? '90dvh' : '70vh';
	$: showFixedBottomNav = isMobile;
</script>

<div class="flex items-center justify-center">
	<div class="notebook-outer">
		<HandDrawnBorder width={notebookWidth} height={notebookHeight} isNotebookContainer={true}>
			<div class="notebook-inner">
				<div class="page-content-scroll">
					<PageContent page={activePage} />
				</div>
				{#if !isMobile}
					<div class="side-nav">
						<SideNavTabs
							on:tabClick={(e) => handleTabClick(e.detail)}
							{activePage}
							isFixedBottom={false}
						/>
					</div>
				{/if}
			</div>
		</HandDrawnBorder>
	</div>
</div>

{#if showFixedBottomNav}
	<div class="fixed right-0 bottom-0 left-0 z-[9999] w-full">
		<HandDrawnBorder height="70px" width="95vw">
			<div class="h-full w-full bg-black">
				<SideNavTabs
					on:tabClick={(e) => handleTabClick(e.detail)}
					{activePage}
					isFixedBottom={true}
				/>
			</div>
		</HandDrawnBorder>
	</div>
{/if}

<style>
	.notebook-outer {
		height: 85vh;
		width: 85vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background: black;
	}
	.notebook-inner {
		display: flex;
		width: 100%;
		height: 100%;
	}
	.page-content-scroll {
		flex: 1;
		height: 100%;
		overflow: hidden;
		padding: 2rem;
	}

	@media (max-width: 767px) {
		.page-content-scroll {
			padding: 0;
		}
		.notebook-outer {
			height: 100vh;
			width: 100vw;
		}
	}
	.side-nav {
		width: 8rem;
		flex-shrink: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style>
