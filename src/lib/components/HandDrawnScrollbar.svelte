<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import rough from 'roughjs';
	import { gsap } from 'gsap';

	export let container: HTMLElement;
	export let strokeWidth: number = 2.5;
	export let roughness: number = 2.2;
	export let scrollbarWidth: number = 12;
	export let scrollbarColor: string = '#ffffff';

	let scrollbarContainer: HTMLDivElement;
	let scrollbarTrack: SVGElement;
	let scrollbarThumb: SVGElement;
	let rc: any;
	let isDragging = false;
	let startY = 0;
	let startScrollTop = 0;
	let animationFrame: number;

	// Scrollbar state
	let scrollbarHeight = 0;
	let scrollbarTop = 0;
	let isVisible = false;
	let fadeTimeout: number;

	function initRoughJS() {
		if (scrollbarTrack) {
			rc = rough.svg(scrollbarTrack);
			rc.seed = Math.floor(Math.random() * 10000);
		}
	}

	function calculateScrollbar() {
		if (!container || !scrollbarContainer) return;

		const containerRect = container.getBoundingClientRect();
		const scrollHeight = container.scrollHeight;
		const clientHeight = container.clientHeight;
		const scrollTop = container.scrollTop;

		// Calculate scrollbar dimensions
		const trackHeight = containerRect.height;
		const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 40);
		const maxScrollTop = scrollHeight - clientHeight;
		const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
		const maxThumbTop = trackHeight - thumbHeight;
		const thumbTop = scrollRatio * maxThumbTop;

		scrollbarHeight = thumbHeight;
		scrollbarTop = thumbTop;

		// Show/hide scrollbar based on content
		const shouldShow = scrollHeight > clientHeight;
		if (shouldShow !== isVisible) {
			isVisible = shouldShow;
			gsap.to(scrollbarContainer, {
				opacity: shouldShow ? 1 : 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}

		drawScrollbar();
	}

	function drawScrollbar() {
		if (!scrollbarTrack || !scrollbarThumb || !rc) return;

		const containerRect = scrollbarContainer.getBoundingClientRect();
		const trackWidth = scrollbarWidth;
		const trackHeight = containerRect.height;

		// Clear previous drawings
		scrollbarTrack.innerHTML = '';
		scrollbarThumb.innerHTML = '';

		// Set SVG dimensions
		scrollbarTrack.setAttribute('width', trackWidth.toString());
		scrollbarTrack.setAttribute('height', trackHeight.toString());
		scrollbarThumb.setAttribute('width', trackWidth.toString());
		scrollbarThumb.setAttribute('height', trackHeight.toString());

		// Draw track (subtle background)
		const trackDrawing = rc.rectangle(0, 0, trackWidth, trackHeight, {
			stroke: 'rgba(255, 255, 255, 0.1)',
			strokeWidth: 1,
			roughness: 1,
			fillStyle: 'none',
			seed: Math.floor(Math.random() * 10000)
		});
		scrollbarTrack.appendChild(trackDrawing);

		// Draw thumb with hand-drawn effect
		const thumbDrawing = rc.rectangle(0, scrollbarTop, trackWidth, scrollbarHeight, {
			stroke: scrollbarColor,
			strokeWidth: strokeWidth,
			roughness: roughness,
			fillStyle: 'solid',
			fill: 'rgba(255, 255, 255, 0.1)',
			seed: Math.floor(Math.random() * 10000)
		});
		scrollbarThumb.appendChild(thumbDrawing);

		// Add some decorative elements to make it more hand-drawn
		if (scrollbarHeight > 60) {
			// Add some squiggles or dots for visual interest
			const squiggleCount = Math.floor(scrollbarHeight / 20);
			for (let i = 0; i < squiggleCount; i++) {
				const y = scrollbarTop + (i + 1) * (scrollbarHeight / (squiggleCount + 1));
				const squiggle = rc.line(2, y, trackWidth - 2, y + (Math.random() - 0.5) * 4, {
					stroke: scrollbarColor,
					strokeWidth: 1,
					roughness: 1,
					seed: Math.floor(Math.random() * 10000)
				});
				scrollbarThumb.appendChild(squiggle);
			}
		}
	}

	function handleScroll() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		animationFrame = requestAnimationFrame(calculateScrollbar);
	}

	function handleMouseDown(event: MouseEvent) {
		if (!container || !scrollbarContainer) return;

		const rect = scrollbarContainer.getBoundingClientRect();
		const clickY = event.clientY - rect.top;
		const containerRect = container.getBoundingClientRect();
		const scrollHeight = container.scrollHeight;
		const clientHeight = container.clientHeight;
		const maxScrollTop = scrollHeight - clientHeight;

		// Check if click is on thumb
		if (clickY >= scrollbarTop && clickY <= scrollbarTop + scrollbarHeight) {
			isDragging = true;
			startY = event.clientY;
			startScrollTop = container.scrollTop;
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			event.preventDefault();
		} else {
			// Click on track - jump to position
			const trackHeight = containerRect.height;
			const clickRatio = clickY / trackHeight;
			const newScrollTop = clickRatio * maxScrollTop;
			
			gsap.to(container, {
				scrollTop: newScrollTop,
				duration: 0.5,
				ease: 'power2.out'
			});
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !container) return;

		const deltaY = event.clientY - startY;
		const containerRect = container.getBoundingClientRect();
		const scrollHeight = container.scrollHeight;
		const clientHeight = container.clientHeight;
		const maxScrollTop = scrollHeight - clientHeight;
		const trackHeight = containerRect.height;
		const thumbHeight = scrollbarHeight;
		const maxThumbTop = trackHeight - thumbHeight;

		const thumbDelta = deltaY / maxThumbTop;
		const scrollDelta = thumbDelta * maxScrollTop;
		const newScrollTop = Math.max(0, Math.min(maxScrollTop, startScrollTop + scrollDelta));

		container.scrollTop = newScrollTop;
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	function handleMouseEnter() {
		if (fadeTimeout) {
			clearTimeout(fadeTimeout);
		}
		gsap.to(scrollbarContainer, {
			opacity: 1,
			duration: 0.2,
			ease: 'power2.out'
		});
	}

	function handleMouseLeave() {
		if (isVisible) {
			fadeTimeout = setTimeout(() => {
				gsap.to(scrollbarContainer, {
					opacity: 0.3,
					duration: 0.5,
					ease: 'power2.out'
				});
			}, 1000);
		}
	}

	onMount(() => {
		if (!container) return;

		// Small delay to ensure DOM is ready
		setTimeout(() => {
			initRoughJS();
			calculateScrollbar();

			// Add event listeners
			container.addEventListener('scroll', handleScroll, { passive: true });
			if (scrollbarContainer) {
				scrollbarContainer.addEventListener('mousedown', handleMouseDown);
				scrollbarContainer.addEventListener('mouseenter', handleMouseEnter);
				scrollbarContainer.addEventListener('mouseleave', handleMouseLeave);
			}

			// Handle resize
			const resizeObserver = new ResizeObserver(() => {
				calculateScrollbar();
			});
			resizeObserver.observe(container);

			return () => {
				resizeObserver.disconnect();
			};
		}, 10);
	});

	onDestroy(() => {
		if (container) {
			container.removeEventListener('scroll', handleScroll);
		}
		if (scrollbarContainer) {
			scrollbarContainer.removeEventListener('mousedown', handleMouseDown);
			scrollbarContainer.removeEventListener('mouseenter', handleMouseEnter);
			scrollbarContainer.removeEventListener('mouseleave', handleMouseLeave);
		}
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		if (fadeTimeout) {
			clearTimeout(fadeTimeout);
		}
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	});

	// Reactive statement to recalculate when container changes
	$: if (container && scrollbarContainer) {
		setTimeout(calculateScrollbar, 10);
	}
</script>

<div
	bind:this={scrollbarContainer}
	class="absolute right-0 top-0 bottom-0 z-50 pointer-events-auto opacity-0 transition-opacity duration-300"
	style="width: {scrollbarWidth}px;"
>
	<svg bind:this={scrollbarTrack} class="absolute inset-0" />
	<svg bind:this={scrollbarThumb} class="absolute inset-0" />
</div>

<style>
	div {
		user-select: none;
	}
</style> 