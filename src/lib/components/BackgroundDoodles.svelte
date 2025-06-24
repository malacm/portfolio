<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement;
	let scene: THREE.Scene;
	let camera: THREE.OrthographicCamera;
	let renderer: THREE.WebGLRenderer;
	let doodles: THREE.Group;
	let animationId: number;

	// Check if we're in the browser
	const isBrowser = typeof window !== 'undefined';

	// Doodle configuration
	const DOODLE_COUNT = 15;
	const DOODLE_TYPES = ['squiggle', 'loop', 'spiral', 'zigzag', 'wave', 'scribble', 'curly'];

	// Shared material to prevent memory leaks
	let sharedMaterial: THREE.LineBasicMaterial;

	// Performance optimization
	let lastTime = 0;
	let frameCount = 0;
	const targetFPS = 30;
	const frameInterval = 1000 / targetFPS;

	function createSharpieMaterial() {
		if (!sharedMaterial) {
			sharedMaterial = new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.12,
				linewidth: 2
			});
		}
		return sharedMaterial;
	}

	function createRandomSquiggle() {
		const points = [];
		const segments = 6 + Math.floor(Math.random() * 4);
		const amplitude = 0.3 + Math.random() * 0.4;
		const frequency = 0.5 + Math.random() * 1;
		
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const x = (t - 0.5) * 2;
			const y = Math.sin(t * Math.PI * frequency) * amplitude + (Math.random() - 0.5) * 0.2;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomLoop() {
		const points = [];
		const segments = 12;
		const radius = 0.3 + Math.random() * 0.4;
		const noise = 0.1;
		
		for (let i = 0; i <= segments; i++) {
			const angle = (i / segments) * Math.PI * 2;
			const x = Math.cos(angle) * radius + (Math.random() - 0.5) * noise;
			const y = Math.sin(angle) * radius + (Math.random() - 0.5) * noise;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomSpiral() {
		const points = [];
		const turns = 2 + Math.random() * 2;
		const segments = 30;
		
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const angle = t * turns * Math.PI * 2;
			const radius = t * 0.8;
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomZigzag() {
		const points = [];
		const segments = 4 + Math.floor(Math.random() * 4);
		const amplitude = 0.4 + Math.random() * 0.3;
		
		for (let i = 0; i <= segments; i++) {
			const x = (i / segments - 0.5) * 2;
			const y = Math.sin(i * Math.PI) * amplitude;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomWave() {
		const points = [];
		const segments = 20;
		const amplitude = 0.3 + Math.random() * 0.4;
		const frequency = 1 + Math.random() * 2;
		
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const x = (t - 0.5) * 2;
			const y = Math.sin(t * Math.PI * frequency) * amplitude;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomScribble() {
		const points = [];
		const segments = 10 + Math.floor(Math.random() * 6);
		
		let x = 0, y = 0;
		points.push(new THREE.Vector3(x, y, 0));
		
		for (let i = 1; i <= segments; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = 0.1 + Math.random() * 0.2;
			x += Math.cos(angle) * distance;
			y += Math.sin(angle) * distance;
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomCurly() {
		const points = [];
		const segments = 15;
		const amplitude = 0.2 + Math.random() * 0.3;
		const frequency = 2 + Math.random() * 3;
		
		for (let i = 0; i <= segments; i++) {
			const t = i / segments;
			const x = (t - 0.5) * 1.5;
			const y = Math.sin(t * Math.PI * frequency) * amplitude * (1 - t * 0.5);
			points.push(new THREE.Vector3(x, y, 0));
		}
		
		return points;
	}

	function createRandomDoodle() {
		const group = new THREE.Group();
		const material = createSharpieMaterial();
		const type = DOODLE_TYPES[Math.floor(Math.random() * DOODLE_TYPES.length)];
		
		let points: THREE.Vector3[];
		
		switch (type) {
			case 'squiggle':
				points = createRandomSquiggle();
				break;
			case 'loop':
				points = createRandomLoop();
				break;
			case 'spiral':
				points = createRandomSpiral();
				break;
			case 'zigzag':
				points = createRandomZigzag();
				break;
			case 'wave':
				points = createRandomWave();
				break;
			case 'scribble':
				points = createRandomScribble();
				break;
			case 'curly':
				points = createRandomCurly();
				break;
			default:
				points = createRandomSquiggle();
		}

		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const line = new THREE.Line(geometry, material);
		group.add(line);

		// Random position
		group.position.x = (Math.random() - 0.5) * 25;
		group.position.y = (Math.random() - 0.5) * 25;
		group.position.z = Math.random() * -10;

		// Random rotation
		group.rotation.z = Math.random() * Math.PI * 2;

		// Random scale
		const scale = 0.8 + Math.random() * 1.2;
		group.scale.set(scale, scale, scale);

		return group;
	}

	function init() {
		if (!container || !isBrowser) return;

		// Scene setup
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// Camera setup (orthographic for 2D-like effect)
		const aspect = container.clientWidth / container.clientHeight;
		const frustumSize = 12;
		camera = new THREE.OrthographicCamera(
			frustumSize * aspect / -2,
			frustumSize * aspect / 2,
			frustumSize / 2,
			frustumSize / -2,
			0.1,
			1000
		);
		camera.position.z = 10;

		// Renderer setup with performance optimizations
		renderer = new THREE.WebGLRenderer({ 
			antialias: false,
			alpha: true,
			powerPreference: "high-performance"
		});
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		container.appendChild(renderer.domElement);

		// Create doodles group
		doodles = new THREE.Group();
		scene.add(doodles);

		// Generate random doodles
		for (let i = 0; i < DOODLE_COUNT; i++) {
			const doodle = createRandomDoodle();
			doodles.add(doodle);
		}

		// Animation loop with delta time and frame limiting
		function animate(currentTime = 0) {
			animationId = requestAnimationFrame(animate);
			
			// Frame rate limiting
			if (currentTime - lastTime < frameInterval) {
				return;
			}
			
			const deltaTime = currentTime - lastTime;
			lastTime = currentTime;
			
			// Normalize delta time to prevent precision issues
			const normalizedDelta = Math.min(deltaTime / 16.67, 2);
			
			// Slowly rotate all doodles with delta time
			doodles.rotation.z = (doodles.rotation.z + 0.0003 * normalizedDelta) % (Math.PI * 2);
			
			// Individual doodle animations with delta time
			doodles.children.forEach((doodle, index) => {
				doodle.rotation.z = (doodle.rotation.z + 0.0006 * normalizedDelta * (index % 2 === 0 ? 1 : -1)) % (Math.PI * 2);
				doodle.position.y += Math.sin(currentTime * 0.0003 + index) * 0.0003 * normalizedDelta;
			});

			renderer.render(scene, camera);
		}

		animate();
	}

	function handleResize() {
		if (!container || !camera || !renderer || !isBrowser) return;

		const width = container.clientWidth;
		const height = container.clientHeight;

		// Recreate orthographic camera with new dimensions
		const aspect = width / height;
		const frustumSize = 12;
		camera.left = frustumSize * aspect / -2;
		camera.right = frustumSize * aspect / 2;
		camera.top = frustumSize / 2;
		camera.bottom = frustumSize / -2;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	function cleanup() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		
		if (renderer) {
			renderer.dispose();
		}
		
		if (sharedMaterial) {
			sharedMaterial.dispose();
		}
		
		// Dispose all geometries
		if (doodles) {
			doodles.children.forEach(child => {
				if (child instanceof THREE.Line && child.geometry) {
					child.geometry.dispose();
				}
			});
		}
	}

	onMount(() => {
		if (isBrowser) {
			init();
			window.addEventListener('resize', handleResize);
		}
	});

	onDestroy(() => {
		if (isBrowser) {
			cleanup();
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

<div bind:this={container} class="fixed inset-0 pointer-events-none z-0" />

<style>
	div {
		overflow: hidden;
	}
</style> 