<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import rough from 'roughjs';

	export let strokeWidth: number = 2.5;
	export let roughness: number = 2.2;
	export let width: string = '100%';
	export let height: string = 'auto';
	export let isNotebookContainer: boolean = false;

	let svgEl: SVGElement;
	let containerEl: HTMLDivElement;
	let resizeObserver: ResizeObserver | undefined;

	// Check if height is a specific value (not 'auto' or '100%')
	$: hasFixedHeight = height !== 'auto' && height !== '100%';

	function updateSVGSize() {
		if (!svgEl || !containerEl) return;
		
		const rect = containerEl.getBoundingClientRect();
		const containerWidth = Math.round(rect.width);
		const containerHeight = Math.round(rect.height);
		
		if (containerWidth === 0 || containerHeight === 0) return;

		const buffer = 12; // Larger buffer to avoid missing corners/sides
		const inset = 6; // Inset rectangle from each edge

		// Update SVG to match container, plus buffer
		svgEl.setAttribute('width', `${containerWidth + buffer}`);
		svgEl.setAttribute('height', `${containerHeight + buffer}`);
		svgEl.innerHTML = '';

		const rc = rough.svg(svgEl);
		rc.seed = 12345; // Fixed seed for consistent border
		const drawing = rc.rectangle(
			inset,
			inset,
			containerWidth - 2 * inset + buffer,
			containerHeight - 2 * inset + buffer,
			{
				stroke: '#fff',
				strokeWidth: strokeWidth,
				roughness: roughness,
				fillStyle: 'solid'
			}
		);
		svgEl.appendChild(drawing);
	}

	onMount(() => {
		// Use ResizeObserver for robust sizing
		if (containerEl) {
			resizeObserver = new ResizeObserver(() => {
				updateSVGSize();
			});
			resizeObserver.observe(containerEl);
			// Initial draw after a small delay to ensure content is rendered
			setTimeout(updateSVGSize, 10);
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
	class="relative {hasFixedHeight ? 'h-full w-full' : 'w-full'}"
	style="width: {width}; {hasFixedHeight ? `height: ${height};` : ''} {isNotebookContainer ? 'max-width: 100%; max-height: 100%;' : ''} height: 100%;"
>
	<!-- Sketchy Border SVG -->
	<svg
		bind:this={svgEl}
		class="pointer-events-none absolute z-10"
		style="display:block; top: -6px; left: -6px; right: 0; bottom: 0; width: calc(100% + 12px); height: calc(100% + 12px);"
	/>
	<!-- Content slot -->
	<div 
		class="relative z-20 {hasFixedHeight ? 'h-full w-full' : 'p-4'}"
		style="padding: 0.5rem; height: 100%; width: 100%;"
	>
		<slot />
	</div>
</div>
