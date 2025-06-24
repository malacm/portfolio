<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import rough from 'roughjs';

	export let width: number = 1000;
	export let height: number = 600;
	export let strokeWidth: number = 2.5;
	export let roughness: number = 2.2;

	let svgEl: SVGElement;
	let containerEl: HTMLDivElement;
	let resizeObserver: ResizeObserver | undefined;

	function updateSVGSize() {
		if (svgEl && containerEl) {
			const rect = containerEl.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			
			const padding = strokeWidth / 2;
			
			svgEl.setAttribute('width', `${rect.width}`);
			svgEl.setAttribute('height', `${rect.height}`);
			svgEl.innerHTML = '';
			const rc = rough.svg(svgEl);
			rc.seed = 12345; // Fixed seed for consistent border
			const drawing = rc.rectangle(
				padding,
				padding,
				rect.width - strokeWidth,
				rect.height - strokeWidth,
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

<div bind:this={containerEl} class="absolute inset-0 w-full h-full p-2">
	<svg
		bind:this={svgEl}
		class="absolute inset-0 z-10 pointer-events-none w-full h-full"
		style="display:block;"
	/>
</div>
