<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import rough from 'roughjs';

	export let isVisible = false;
	export let isActive = false;
	export let animateOnHover = true;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let showSubNav = false;

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

	function drawSquare(progress: number = 1) {
		if (!container || !svg || !rc) return;

		const rect = container.getBoundingClientRect();
		svg.setAttribute('width', `${rect.width}`);
		svg.setAttribute('height', `${rect.height}`);
		svg.innerHTML = '';

		if (!isVisible) return;

		// Calculate square parameters
		const padding = 4;
		const squareSize = Math.min(rect.width, rect.height) - padding * 2;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const halfSize = squareSize / 2;

		// Add glow filter for active state
		if (isActive) {
			const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
			filter.setAttribute('id', `glow-${Math.random().toString(36).substr(2, 9)}`);
			filter.setAttribute('x', '-50%');
			filter.setAttribute('y', '-50%');
			filter.setAttribute('width', '200%');
			filter.setAttribute('height', '200%');

			const feGaussianBlur = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'feGaussianBlur'
			);
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
			// Full square
			const drawing = rc.rectangle(centerX - halfSize, centerY - halfSize, squareSize, squareSize, {
				stroke: 'white',
				strokeWidth: 2.5,
				roughness: 1.8,
				fillStyle: 'none',
				seed: Math.random() * 1000,
				...(isActive && { filter: `url(#${svg.querySelector('filter')?.getAttribute('id')})` })
			});
			svg.appendChild(drawing);
		} else {
			// Partial square for animation
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			const totalLength = squareSize * 4;
			const currentLength = totalLength * progress;

			let pathData = '';
			if (currentLength <= squareSize) {
				// Top edge
				pathData = `M ${centerX - halfSize} ${centerY - halfSize} L ${centerX - halfSize + currentLength} ${centerY - halfSize}`;
			} else if (currentLength <= squareSize * 2) {
				// Top + right edge
				const rightProgress = (currentLength - squareSize) / squareSize;
				pathData = `M ${centerX - halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY - halfSize + squareSize * rightProgress}`;
			} else if (currentLength <= squareSize * 3) {
				// Top + right + bottom edge
				const bottomProgress = (currentLength - squareSize * 2) / squareSize;
				pathData = `M ${centerX - halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY + halfSize} L ${centerX + halfSize - squareSize * bottomProgress} ${centerY + halfSize}`;
			} else {
				// All edges
				const leftProgress = (currentLength - squareSize * 3) / squareSize;
				pathData = `M ${centerX - halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY - halfSize} L ${centerX + halfSize} ${centerY + halfSize} L ${centerX - halfSize} ${centerY + halfSize} L ${centerX - halfSize} ${centerY + halfSize - squareSize * leftProgress}`;
			}

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

	function animateSquare() {
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

			drawSquare(animationProgress);

			if (isAnimating) {
				animationFrame = requestAnimationFrame(animate);
			}
		}

		animate();
	}

	function handleMouseEnter() {
		if (animateOnHover && !isActive) {
			animateSquare();
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
			drawSquare();
		}
	});

	$: if (isVisible) {
		drawSquare();
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
	class="relative inline-block py-4 text-2xl"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
>
	<svg bind:this={svg} class="pointer-events-none absolute inset-0" />
	<div class="flex h-full w-full items-center justify-center">
		<slot />
	</div>
</div>
