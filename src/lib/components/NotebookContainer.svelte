<script lang="ts">
	import SideNavTabs from './SideNavTabs.svelte';
	import PageContent from './PageContent.svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';
	import { onMount } from 'svelte';

	let activePage: string = 'Projects';
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

	$: notebookWidth = isMobile ? '100vw' : '85vw';
	$: notebookHeight = isMobile ? '100dvh' : '75vh';
	$: showFixedBottomNav = isMobile;
</script>

<div class="notebook-outer">
	<HandDrawnBorder width={notebookWidth} height={notebookHeight} isNotebookContainer={true}>
		<div class="notebook-inner">
			<div class="page-content-scroll">
				<PageContent page={activePage} />
			</div>
			{#if !isMobile}
				<div class="side-nav">
					<SideNavTabs on:tabClick={(e) => handleTabClick(e.detail)} {activePage} isFixedBottom={false} />
				</div>
			{/if}
		</div>
	</HandDrawnBorder>
</div>

{#if showFixedBottomNav}
	<div class="fixed bottom-0 left-0 right-0 w-full z-[9999]">
		<HandDrawnBorder height="80px" width="100vw">
			<div class="w-full h-full bg-black">
				<SideNavTabs on:tabClick={(e) => handleTabClick(e.detail)} {activePage} isFixedBottom={true} />
			</div>
		</HandDrawnBorder>
	</div>
{/if}

<style>
	.notebook-outer {
		min-height: 100vh;
		min-width: 100vw;
		display: flex;
		justify-content: center;
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
		overflow: auto;
		padding: 2rem;
	}
	.side-nav {
		width: 8rem;
		flex-shrink: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 2rem;
	}
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style>
