<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import rough from 'roughjs';

	export let strokeWidth: number = 2.5;
	export let roughness: number = 2.2;
	export let width: string = '100%';
	export let height: string = '100%';

	let svgEl: SVGElement;
	let containerEl: HTMLDivElement;
	let resizeObserver: ResizeObserver | undefined;

	function updateSVGSize() {
		if (svgEl && containerEl) {
			const rect = containerEl.getBoundingClientRect();
			// Use Math.round to avoid subpixel gaps
			const roundedWidth = Math.round(rect.width);
			const roundedHeight = Math.round(rect.height);
			if (roundedWidth === 0 || roundedHeight === 0) return;

			const padding = strokeWidth / 2;
			
			// Calculate 10% smaller dimensions for the inner rectangle
			const innerWidth = roundedWidth * 0.9;
			const innerHeight = roundedHeight * 0.9;
			
			// Calculate centering offsets
			const offsetX = (roundedWidth - innerWidth) / 2;
			const offsetY = (roundedHeight - innerHeight) / 2;

			svgEl.setAttribute('width', `${roundedWidth}`);
			svgEl.setAttribute('height', `${roundedHeight}`);
			svgEl.innerHTML = '';
			const rc = rough.svg(svgEl);
			rc.seed = 12345; // Fixed seed for consistent border
			const drawing = rc.rectangle(
				offsetX + padding,
				offsetY + padding,
				innerWidth - strokeWidth + 1, // +1 to ensure coverage
				innerHeight - strokeWidth + 1,
				{
					stroke: '#fff',
					strokeWidth: strokeWidth,
					roughness: roughness,
					fillStyle: 'solid'
				}
			);
			svgEl.appendChild(drawing);
		}
	}

	onMount(() => {
		// Use ResizeObserver for robust sizing
		if (containerEl) {
			resizeObserver = new ResizeObserver(() => {
				updateSVGSize();
			});
			resizeObserver.observe(containerEl);
			// Initial draw (in case size is already set)
			updateSVGSize();
		}
	});

	onDestroy(() => {
		if (resizeObserver && containerEl) {
			resizeObserver.unobserve(containerEl);
		}
	});
</script>

<div 
	bind:this={containerEl} 
	class="relative h-full w-full"
	style="width: {width}; height: {height};"
>
	<!-- Sketchy Border SVG -->
	<svg
		bind:this={svgEl}
		class="pointer-events-none absolute inset-0 z-10 h-full w-full"
		style="display:block;"
	/>
	<!-- Content slot -->
	<div 
		class="relative z-20 absolute"
		style="
			width: calc(90% - {strokeWidth}px); 
			height: calc(90% - {strokeWidth}px);
			top: calc(5% + {strokeWidth/2}px);
			left: calc(5% + {strokeWidth/2}px);
		"
	>
		<slot />
	</div>
</div>
