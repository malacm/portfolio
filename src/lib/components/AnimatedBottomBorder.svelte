<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import rough from 'roughjs';

	export let strokeWidth: number = 2.5;
	export let roughness: number = 2.2;
	export let isActive: boolean = false;
	export let animationDuration: number = 800;

	let svgEl: SVGElement;
	let containerEl: HTMLDivElement;
	let resizeObserver: ResizeObserver | undefined;
	let animationFrame: number | undefined;

	function drawBottomBorder() {
		if (svgEl && containerEl) {
			const rect = containerEl.getBoundingClientRect();
			const roundedWidth = Math.round(rect.width);
			const roundedHeight = Math.round(rect.height);
			if (roundedWidth === 0 || roundedHeight === 0) return;

			svgEl.setAttribute('width', `${roundedWidth}`);
			svgEl.setAttribute('height', `${roundedHeight}`);
			svgEl.innerHTML = '';

			if (isActive) {
				const rc = rough.svg(svgEl);
				rc.seed = Math.floor(Math.random() * 10000); // Random seed for variety
				
				// Draw a wavy bottom border
				const points = [];
				const segments = 8;
				const amplitude = 3;
				const baseY = roundedHeight - strokeWidth / 2;
				
				for (let i = 0; i <= segments; i++) {
					const x = (i / segments) * roundedWidth;
					const y = baseY + (Math.sin((i / segments) * Math.PI * 2) * amplitude);
					points.push([x, y]);
				}

				// Create a polyline for the bottom border
				const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
				const pointsStr = points.map(p => p.join(',')).join(' ');
				polyline.setAttribute('points', pointsStr);
				polyline.setAttribute('stroke', '#fff');
				polyline.setAttribute('stroke-width', strokeWidth.toString());
				polyline.setAttribute('fill', 'none');
				polyline.setAttribute('stroke-linecap', 'round');
				polyline.setAttribute('stroke-linejoin', 'round');
				
				// Add some roughness by creating multiple slightly offset lines
				for (let offset = 0; offset < 3; offset++) {
					const offsetPolyline = polyline.cloneNode(true) as SVGElement;
					const offsetPoints = points.map(p => [p[0] + (Math.random() - 0.5) * roughness, p[1] + (Math.random() - 0.5) * roughness]);
					const offsetPointsStr = offsetPoints.map(p => p.join(',')).join(' ');
					offsetPolyline.setAttribute('points', offsetPointsStr);
					offsetPolyline.setAttribute('opacity', (0.3 - offset * 0.1).toString());
					svgEl.appendChild(offsetPolyline);
				}
				
				svgEl.appendChild(polyline);
			}
		}
	}

	function animateBorder() {
		if (isActive) {
			drawBottomBorder();
			animationFrame = requestAnimationFrame(() => {
				setTimeout(animateBorder, animationDuration);
			});
		}
	}

	onMount(() => {
		if (containerEl) {
			resizeObserver = new ResizeObserver(() => {
				drawBottomBorder();
			});
			resizeObserver.observe(containerEl);
			drawBottomBorder();
			
			if (isActive) {
				animateBorder();
			}
		}
	});

	onDestroy(() => {
		if (resizeObserver && containerEl) {
			resizeObserver.unobserve(containerEl);
		}
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});

	$: if (isActive) {
		drawBottomBorder();
		animateBorder();
	} else {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		drawBottomBorder();
	}
</script>

<div 
	bind:this={containerEl} 
	class="relative w-full"
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			// Forward the event to the slot content
			const slotElement = containerEl?.querySelector('[role="button"]');
			if (slotElement) {
				slotElement.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
			}
		}
	}}
	tabindex="0"
>
	<!-- Animated Bottom Border SVG -->
	<svg
		bind:this={svgEl}
		class="pointer-events-none absolute bottom-0 left-0 z-10 w-full h-[50px]"
		style="display:block;"
	/>
	<!-- Content slot -->
	<div class="relative z-20 w-full">
		<slot />
	</div>
</div> 