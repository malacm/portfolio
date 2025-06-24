<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import rough from 'roughjs';

	export let isVisible = false;
	export let isActive = false;
	export let animateOnHover = true;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	let container: HTMLDivElement;
	let svg: SVGElement;
	let rc: any;
	let animationFrame: number;
	let animationProgress = 0;
	let isAnimating = false;

	const dispatch = createEventDispatcher();

	function createRoughInstance() {
		if (svg) {
			const roughInstance = rough.svg(svg);
			roughInstance.seed = 12345;
			return roughInstance;
		}
		return null;
	}

	function drawCircle(progress: number = 1) {
		if (!container || !svg || !rc) return;

		const rect = container.getBoundingClientRect();
		svg.setAttribute('width', `${rect.width}`);
		svg.setAttribute('height', `${rect.height}`);
		svg.innerHTML = '';

		if (!isVisible) return;

		// Calculate ellipse parameters
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const ellipseWidth = rect.width - 8; // 4px padding on each side
		const ellipseHeight = rect.height - 8;

		// Add glow filter for active state
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

		if (progress === 1) {
			// Full ellipse
			const drawing = rc.ellipse(centerX, centerY, ellipseWidth, ellipseHeight, {
				stroke: 'white',
				strokeWidth: 2.5,
				roughness: 1.8,
				fillStyle: 'none',
				seed: Math.random() * 1000,
				...(isActive && { filter: `url(#${svg.querySelector('filter')?.getAttribute('id')})` })
			});
			svg.appendChild(drawing);
		} else {
			// Partial ellipse for animation
			const startAngle = -Math.PI / 2;
			const endAngle = startAngle + (2 * Math.PI * progress);
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const largeArcFlag = progress > 0.5 ? 1 : 0;
			const rx = ellipseWidth / 2;
			const ry = ellipseHeight / 2;
			const x1 = centerX + rx * Math.cos(startAngle);
			const y1 = centerY + ry * Math.sin(startAngle);
			const x2 = centerX + rx * Math.cos(endAngle);
			const y2 = centerY + ry * Math.sin(endAngle);
			const pathData = `M ${x1} ${y1} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
			path.setAttribute('d', pathData);
			path.setAttribute('stroke', 'white');
			path.setAttribute('stroke-width', '2.5');
			path.setAttribute('fill', 'none');
			path.setAttribute('stroke-linecap', 'round');
			if (isActive) {
				path.setAttribute('filter', `url(#${svg.querySelector('filter')?.getAttribute('id')})`);
			}
			svg.appendChild(path);
		}
	}

	function animateCircle() {
		if (isAnimating) {
			cancelAnimationFrame(animationFrame);
		}
		
		isAnimating = true;
		animationProgress = 0;
		
		function animate() {
			animationProgress += 0.03; // Slower animation
			
			if (animationProgress >= 1) {
				animationProgress = 1;
				isAnimating = false;
			}
			
			drawCircle(animationProgress);
			
			if (isAnimating) {
				animationFrame = requestAnimationFrame(animate);
			}
		}
		
		animate();
	}

	function handleMouseEnter() {
		if (animateOnHover && !isActive) {
			animateCircle();
		}
	}

	function handleMouseLeave() {
		if (animateOnHover && !isActive) {
			if (isAnimating) {
				cancelAnimationFrame(animationFrame);
				isAnimating = false;
			}
			svg.innerHTML = '';
		}
	}

	onMount(() => {
		rc = createRoughInstance();
		if (isVisible) {
			drawCircle();
		}
	});

	$: if (isVisible) {
		drawCircle();
	}

	$: if (!isVisible && svg) {
		svg.innerHTML = '';
		if (isAnimating) {
			cancelAnimationFrame(animationFrame);
			isAnimating = false;
		}
	}
</script>

<div
	bind:this={container}
	class="relative inline-block px-6 py-4 text-2xl"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
>
	<svg bind:this={svg} class="pointer-events-none absolute inset-0" />
	<div class="w-full h-full flex items-center justify-center">
		<slot />
	</div>
</div> 