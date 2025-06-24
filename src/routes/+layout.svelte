<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import rough from 'roughjs';

	let portfolioContainer: HTMLDivElement;
	let sandboxContainer: HTMLDivElement;
	let portfolioSvg: SVGElement;
	let sandboxSvg: SVGElement;
	let activeSection: 'portfolio' | 'sandbox' = 'portfolio';

	// Store rough.js instances for each label
	let portfolioRc: any;
	let sandboxRc: any;
	let portfolioDrawing: any;
	let sandboxDrawing: any;

	function createRoughInstance(svg: SVGElement) {
		const rc = rough.svg(svg);
		rc.seed = 12345; // Fixed seed for consistency
		return rc;
	}

	function drawBorder(container: HTMLDivElement, svg: SVGElement, rc: any, isVisible: boolean = false, isActive: boolean = false) {
		if (container && svg) {
			const rect = container.getBoundingClientRect();
			svg.setAttribute('width', `${rect.width}`);
			svg.setAttribute('height', `${rect.height}`);
			svg.innerHTML = '';

			if (isVisible) {
				// Add filter for glow effect on active borders only
				if (isActive) {
					const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
					filter.setAttribute('id', `glow-${Math.random().toString(36).substr(2, 9)}`);
					filter.setAttribute('x', '-50%');
					filter.setAttribute('y', '-50%');
					filter.setAttribute('width', '200%');
					filter.setAttribute('height', '200%');
					
					const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
					feGaussianBlur.setAttribute('stdDeviation', '3');
					feGaussianBlur.setAttribute('result', 'coloredBlur');
					
					const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
					const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
					feMergeNode1.setAttribute('in', 'coloredBlur');
					const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
					feMergeNode2.setAttribute('in', 'SourceGraphic');
					
					feMerge.appendChild(feMergeNode1);
					feMerge.appendChild(feMergeNode2);
					filter.appendChild(feGaussianBlur);
					filter.appendChild(feMerge);
					defs.appendChild(filter);
					svg.appendChild(defs);
				}

				const drawing = rc.rectangle(2, 2, rect.width - 4, rect.height - 4, {
					stroke: 'white',
					strokeWidth: 2.5,
					roughness: 1.8,
					fillStyle: 'none', // No fill for any border
					seed: Math.random() * 1000,
					...(isActive && { filter: `url(#${svg.querySelector('filter')?.getAttribute('id')})` })
				});
				svg.appendChild(drawing);
				return drawing;
			}
		}
		return null;
	}

	function handlePortfolioClick() {
		if (activeSection === 'portfolio') return;
		
		// Remove border from current active section
		if (activeSection === 'sandbox') {
			sandboxSvg.innerHTML = '';
		}
		
		// Draw border on new active section
		portfolioDrawing = drawBorder(portfolioContainer, portfolioSvg, portfolioRc, true, true);
		activeSection = 'portfolio';
	}

	function handleSandboxClick() {
		if (activeSection === 'sandbox') return;
		
		// Remove border from current active section
		if (activeSection === 'portfolio') {
			portfolioSvg.innerHTML = '';
		}
		
		// Draw border on new active section
		sandboxDrawing = drawBorder(sandboxContainer, sandboxSvg, sandboxRc, true, true);
		activeSection = 'sandbox';
	}

	function handlePortfolioHover() {
		if (activeSection === 'portfolio') return;
		
		// Only show border if there isn't one already
		if (!portfolioSvg.querySelector('path')) {
			drawBorder(portfolioContainer, portfolioSvg, portfolioRc, true, false);
		}
	}

	function handlePortfolioLeave() {
		if (activeSection === 'portfolio') return;
		
		// Remove border on leave
		portfolioSvg.innerHTML = '';
	}

	function handleSandboxHover() {
		if (activeSection === 'sandbox') return;
		
		// Only show border if there isn't one already
		if (!sandboxSvg.querySelector('path')) {
			drawBorder(sandboxContainer, sandboxSvg, sandboxRc, true, false);
		}
	}

	function handleSandboxLeave() {
		if (activeSection === 'sandbox') return;
		
		// Remove border on leave
		sandboxSvg.innerHTML = '';
	}

	onMount(() => {
		// Initialize rough.js instances
		portfolioRc = createRoughInstance(portfolioSvg);
		sandboxRc = createRoughInstance(sandboxSvg);
		
		// Draw initial active border
		portfolioDrawing = drawBorder(portfolioContainer, portfolioSvg, portfolioRc, true, true);
	});
</script>

<div class="relative min-h-screen bg-black">
	<!-- Navigation Labels -->
	<div class="absolute top-8 left-8 z-20 space-y-4">
		<!-- Portfolio WIP Label -->
		<div
			class="relative cursor-pointer transition-all duration-300 ease-out hover:opacity-80 hover:scale-105"
			bind:this={portfolioContainer}
			on:click={handlePortfolioClick}
			on:mouseenter={handlePortfolioHover}
			on:mouseleave={handlePortfolioLeave}
			class:opacity-50={activeSection !== 'portfolio'}
		>
			<svg bind:this={portfolioSvg} class="pointer-events-none absolute inset-0" />
			<div class="font-sharpie relative z-10 px-6 py-4 text-2xl text-white transition-transform duration-300">PORTFOLIO: WIP</div>
		</div>

		<!-- Sandbox Label -->
		<div
			class="relative cursor-pointer transition-all duration-300 ease-out hover:opacity-80 hover:scale-105"
			bind:this={sandboxContainer}
			on:click={handleSandboxClick}
			on:mouseenter={handleSandboxHover}
			on:mouseleave={handleSandboxLeave}
			class:opacity-50={activeSection !== 'sandbox'}
		>
			<svg bind:this={sandboxSvg} class="pointer-events-none absolute inset-0" />
			<div class="font-sharpie relative z-10 px-6 py-4 text-2xl text-white transition-transform duration-300">SANDBOX</div>
		</div>
	</div>

	<!-- Content Area -->
	{#if activeSection === 'portfolio'}
		<slot />
	{:else if activeSection === 'sandbox'}
		<div class="font-sharpie flex min-h-screen items-center justify-center p-4">
			<div class="relative aspect-[4/3] max-h-[85vh] min-h-[500px] w-full max-w-[1440px] bg-black">
				<div class="font-sharpie flex h-full items-center justify-center text-4xl text-white">
					SANDBOX CONTENT COMING SOON
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style>
