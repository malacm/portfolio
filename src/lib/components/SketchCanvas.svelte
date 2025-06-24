<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;

	onMount(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.z = 8;

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		// 🎯 Create a vertical spiral that responds to scroll
		const points: THREE.Vector3[] = [];
		const maxCoils = 20; // Maximum number of coils
		const height = 8; // Total height of the spiral
		const radius = 1.5;
		const segments = 600; // High segment count for smooth curves

		// Generate all possible points for the full spiral
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const angle = maxCoils * Math.PI * 2 * t;
			const x = radius * Math.cos(angle);
			const y = height * (t - 0.5); // Vertical progression (bottom to top)
			const z = radius * Math.sin(angle);
			points.push(new THREE.Vector3(x, y, z));
		}

		const curve = new THREE.CatmullRomCurve3(points);
		const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.12, 16, false);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

		const mesh = new THREE.Mesh(tubeGeometry, material);
		scene.add(mesh);

		// Initially draw nothing
		tubeGeometry.setDrawRange(0, 0);

		let currentDrawCount = 0;
		const maxDraw = tubeGeometry.index!.count;
		let lastScrollY = 0;

		// Scroll handler
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const scrollDirection = scrollY > lastScrollY ? 1 : -1; // 1 = down, -1 = up
			const scrollDelta = Math.abs(scrollY - lastScrollY);
			
			// Calculate how much to add/remove based on scroll amount
			const scrollSensitivity = 0.5; // Adjust this to control sensitivity
			const drawDelta = scrollDelta * scrollSensitivity;
			
			if (scrollDirection > 0) {
				// Scrolling down - add more coils
				currentDrawCount = Math.min(currentDrawCount + drawDelta, maxDraw);
			} else {
				// Scrolling up - remove coils
				currentDrawCount = Math.max(currentDrawCount - drawDelta, 0);
			}
			
			// Apply smooth interpolation
			const targetDrawCount = Math.floor(currentDrawCount);
			const currentRange = tubeGeometry.drawRange;
			const newRange = Math.floor(currentDrawCount);
			
			// Smooth transition
			const smoothFactor = 0.1;
			const interpolatedRange = currentRange.count + (newRange - currentRange.count) * smoothFactor;
			
			tubeGeometry.setDrawRange(0, Math.floor(interpolatedRange));
			
			lastScrollY = scrollY;
		};

		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};

		animate();

		// Add scroll listener
		window.addEventListener('scroll', handleScroll, { passive: true });

		const resize = () => {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		};

		window.addEventListener('resize', resize);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', resize);
			renderer.dispose();
		};
	});
</script>

<div bind:this={container} class="pointer-events-none absolute inset-0 z-0" />
