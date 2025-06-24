<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let container: HTMLDivElement | undefined;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let animationId: number;

	// Orbital objects
	let centralMass: THREE.Mesh;
	let orbitalObjects: Array<{
		mesh: THREE.Mesh;
		orbitRadius: number;
		orbitSpeed: number;
		orbitAngle: number;
		type: 'circle' | 'square' | 'x' | 'triangle';
		originalColor: THREE.Color;
		originalScale: THREE.Vector3;
		isPaused: boolean;
	}> = [];

	// Camera controls
	let cameraAngle = 0;
	let cameraRadius = 20;
	let cameraHeight = 10;

	// Hover state
	let hoveredType: string | null = null;
	let isHovering = false;

	// Performance monitoring
	let fps = 60;
	let frameCount = 0;
	let lastTime = 0;
	let lastFpsUpdate = 0;
	let performanceWarning = false;

	// Performance optimization
	const targetFPS = 60;
	const frameInterval = 1000 / targetFPS;
	const maxObjects = 20; // Limit total objects

	// Shared materials to prevent memory leaks
	let centralMaterial: THREE.MeshLambertMaterial;

	const colors = [
		'#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
		'#ffeaa7', '#dda0dd', '#98d8c8', '#fdcb6e'
	];

	// Shape counts for legend
	$: shapeCounts = {
		circle: orbitalObjects.filter(obj => obj.type === 'circle').length,
		square: orbitalObjects.filter(obj => obj.type === 'square').length,
		x: orbitalObjects.filter(obj => obj.type === 'x').length,
		triangle: orbitalObjects.filter(obj => obj.type === 'triangle').length
	};

	onMount(() => {
		if (!container) return;

		initThreeJS();
		createCentralMass();
		createOrbitalObjects();
		animate();

		// Handle resize
		const resizeObserver = new ResizeObserver(() => {
			handleResize();
		});
		resizeObserver.observe(container);

		// Add mouse event listeners for hover detection only
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseleave', onMouseLeave);

		return () => {
			resizeObserver.disconnect();
			container?.removeEventListener('mousemove', onMouseMove);
			container?.removeEventListener('mouseleave', onMouseLeave);
			cleanup();
		};
	});

	function initThreeJS() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000011);

		const aspect = container!.clientWidth / container!.clientHeight;
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
		
		// Set fixed camera position looking down at an angle
		camera.position.set(15, 12, 15);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ 
			antialias: false, // Disabled for performance
			powerPreference: "high-performance"
		});
		renderer.setSize(container!.clientWidth, container!.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
		container!.appendChild(renderer.domElement);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 20, 10);
		scene.add(directionalLight);

		// Add some stars in the background
		createStarField();
	}

	function createStarField() {
		const starGeometry = new THREE.SphereGeometry(0.02, 4, 4);
		const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

		for (let i = 0; i < 100; i++) { // Reduced from 200
			const star = new THREE.Mesh(starGeometry, starMaterial);
			star.position.set(
				(Math.random() - 0.5) * 100,
				(Math.random() - 0.5) * 100,
				(Math.random() - 0.5) * 100
			);
			scene.add(star);
		}
	}

	function createCentralMass() {
		const geometry = new THREE.SphereGeometry(2, 12, 12); // Reduced segments
		centralMaterial = new THREE.MeshLambertMaterial({ 
			color: 0xffd700,
			emissive: 0x444400
		});
		centralMass = new THREE.Mesh(geometry, centralMaterial);
		scene.add(centralMass);
	}

	function createOrbitalObjects() {
		const objectTypes = ['circle', 'square', 'x', 'triangle'];
		
		for (let i = 0; i < 12; i++) { // Reduced from 15
			const type = objectTypes[i % objectTypes.length] as 'circle' | 'square' | 'x' | 'triangle';
			const orbitRadius = 4 + (i % 3) * 2; // Different orbit levels
			const orbitSpeed = 0.5 + Math.random() * 0.5;
			const orbitAngle = Math.random() * Math.PI * 2;
			
			let geometry: THREE.BufferGeometry;
			if (type === 'circle') {
				geometry = new THREE.SphereGeometry(0.3, 8, 8);
			} else if (type === 'square') {
				geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
			} else if (type === 'x') {
				geometry = createXGeometry(0.4);
			} else { // triangle
				geometry = createTriangleGeometry(0.4);
			}

			const color = colors[Math.floor(Math.random() * colors.length)];
			const material = new THREE.MeshLambertMaterial({ color });
			const mesh = new THREE.Mesh(geometry, material);

			// Position in orbit
			mesh.position.x = Math.cos(orbitAngle) * orbitRadius;
			mesh.position.z = Math.sin(orbitAngle) * orbitRadius;
			mesh.position.y = (Math.random() - 0.5) * 2;

			scene.add(mesh);

			orbitalObjects.push({
				mesh,
				orbitRadius,
				orbitSpeed,
				orbitAngle,
				type,
				originalColor: new THREE.Color(color),
				originalScale: mesh.scale.clone(),
				isPaused: false
			});
		}
	}

	function createXGeometry(size: number): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		const indices = [];

		// Create an X shape using two crossed rectangles
		const thickness = size * 0.2;
		
		// First diagonal rectangle
		vertices.push(
			-size, -thickness, -thickness,  // 0
			-size, thickness, -thickness,   // 1
			size, thickness, -thickness,    // 2
			size, -thickness, -thickness,   // 3
			-size, -thickness, thickness,   // 4
			-size, thickness, thickness,    // 5
			size, thickness, thickness,     // 6
			size, -thickness, thickness     // 7
		);

		// Second diagonal rectangle (rotated 90 degrees)
		vertices.push(
			-thickness, -size, -thickness,  // 8
			thickness, -size, -thickness,   // 9
			thickness, size, -thickness,    // 10
			-thickness, size, -thickness,   // 11
			-thickness, -size, thickness,   // 12
			thickness, -size, thickness,    // 13
			thickness, size, thickness,     // 14
			-thickness, size, thickness     // 15
		);

		// Indices for first rectangle
		indices.push(0,1,2, 0,2,3, 4,6,5, 4,7,6, 0,4,1, 1,4,5, 2,6,3, 3,6,7, 0,3,4, 4,3,7, 1,5,2, 2,5,6);
		
		// Indices for second rectangle
		indices.push(8,9,10, 8,10,11, 12,14,13, 12,15,14, 8,12,9, 9,12,13, 10,14,11, 11,14,15, 8,11,12, 12,11,15, 9,13,10, 10,13,14);

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setIndex(indices);
		geometry.computeVertexNormals();

		return geometry;
	}

	function createTriangleGeometry(size: number): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		const indices = [];

		// Create a triangular prism
		const height = size * 0.3;
		
		// Bottom triangle
		vertices.push(
			-size, -height, -size * 0.866,  // 0
			size, -height, -size * 0.866,   // 1
			0, -height, size * 0.866        // 2
		);
		
		// Top triangle
		vertices.push(
			-size, height, -size * 0.866,   // 3
			size, height, -size * 0.866,    // 4
			0, height, size * 0.866         // 5
		);

		// Bottom face
		indices.push(0, 2, 1);
		
		// Top face
		indices.push(3, 4, 5);
		
		// Side faces
		indices.push(0, 1, 3, 1, 4, 3);
		indices.push(1, 2, 4, 2, 5, 4);
		indices.push(2, 0, 5, 0, 3, 5);

		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setIndex(indices);
		geometry.computeVertexNormals();

		return geometry;
	}

	function updateCameraPosition() {
		// Camera position is now fixed, no need to update
	}

	function onMouseMove(event: MouseEvent) {
		const rect = container!.getBoundingClientRect();
		const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		// Raycasting for hover detection only
		const raycaster = new THREE.Raycaster();
		const mouseVector = new THREE.Vector2(mouseX, mouseY);
		raycaster.setFromCamera(mouseVector, camera);

		const meshes = orbitalObjects.map(obj => obj.mesh);
		const intersects = raycaster.intersectObjects(meshes);

		if (intersects.length > 0) {
			const intersectedMesh = intersects[0].object;
			const orbitalObject = orbitalObjects.find(obj => obj.mesh === intersectedMesh);
			
			if (orbitalObject && !isHovering) {
				isHovering = true;
				hoveredType = orbitalObject.type;
				pauseOrbits();
				updateHighlighting();
			}
		} else if (isHovering) {
			isHovering = false;
			hoveredType = null;
			resumeOrbits();
			updateHighlighting();
		}
	}

	function onMouseLeave() {
		if (isHovering) {
			isHovering = false;
			hoveredType = null;
			resumeOrbits();
			updateHighlighting();
		}
	}

	function pauseOrbits() {
		orbitalObjects.forEach(obj => {
			obj.isPaused = true;
		});
	}

	function resumeOrbits() {
		orbitalObjects.forEach(obj => {
			obj.isPaused = false;
		});
	}

	function updateHighlighting() {
		orbitalObjects.forEach(obj => {
			const material = obj.mesh.material as THREE.MeshLambertMaterial;
			
			if (hoveredType && obj.type === hoveredType) {
				// Highlight similar objects - make them larger and brighter
				material.emissive.setHex(0x666666);
				material.color.setHex(0xffffff);
				obj.mesh.scale.setScalar(1.5);
			} else if (hoveredType) {
				// Dim other objects
				material.emissive.setHex(0x000000);
				material.color.copy(obj.originalColor);
				material.color.multiplyScalar(0.3);
				obj.mesh.scale.copy(obj.originalScale);
			} else {
				// Reset to normal
				material.emissive.setHex(0x000000);
				material.color.copy(obj.originalColor);
				obj.mesh.scale.copy(obj.originalScale);
			}
		});
	}

	function addOrbitalObject() {
		if (orbitalObjects.length >= maxObjects) {
			performanceWarning = true;
			setTimeout(() => performanceWarning = false, 3000);
			return;
		}
		
		const types = ['circle', 'square', 'x', 'triangle'] as const;
		const type = types[Math.floor(Math.random() * types.length)];
		const orbitRadius = 4 + Math.random() * 6;
		const orbitSpeed = 0.3 + Math.random() * 0.7;
		const orbitAngle = Math.random() * Math.PI * 2;
		
		let geometry: THREE.BufferGeometry;
		if (type === 'circle') {
			geometry = new THREE.SphereGeometry(0.3, 8, 8);
		} else if (type === 'square') {
			geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
		} else if (type === 'x') {
			geometry = createXGeometry(0.4);
		} else {
			geometry = createTriangleGeometry(0.4);
		}

		const color = colors[Math.floor(Math.random() * colors.length)];
		const material = new THREE.MeshLambertMaterial({ color });
		const mesh = new THREE.Mesh(geometry, material);

		mesh.position.x = Math.cos(orbitAngle) * orbitRadius;
		mesh.position.z = Math.sin(orbitAngle) * orbitRadius;
		mesh.position.y = (Math.random() - 0.5) * 2;

		scene.add(mesh);

		orbitalObjects.push({
			mesh,
			orbitRadius,
			orbitSpeed,
			orbitAngle,
			type,
			originalColor: new THREE.Color(color),
			originalScale: mesh.scale.clone(),
			isPaused: false
		});
	}

	function clearObjects() {
		orbitalObjects.forEach(obj => {
			scene.remove(obj.mesh);
			obj.mesh.geometry.dispose();
			(obj.mesh.material as THREE.Material).dispose();
		});
		orbitalObjects = [];
	}

	function handleResize() {
		if (!container) return;
		
		const width = container.clientWidth;
		const height = container.clientHeight;
		
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	function animate(currentTime = 0) {
		animationId = requestAnimationFrame(animate);

		// Frame rate limiting
		if (currentTime - lastTime < frameInterval) {
			return;
		}

		const deltaTime = currentTime - lastTime;
		lastTime = currentTime;

		// Calculate FPS (less frequently)
		frameCount++;
		if (currentTime - lastFpsUpdate > 1000) { // Update FPS every second
			fps = Math.round(1000 / (deltaTime || 16));
			lastFpsUpdate = currentTime;
		}

		// Normalize delta time
		const normalizedDelta = Math.min(deltaTime / 16.67, 2);

		// Update orbital objects with delta time (only if not paused)
		orbitalObjects.forEach(obj => {
			if (!obj.isPaused) {
				obj.orbitAngle += obj.orbitSpeed * 0.02 * normalizedDelta;
				
				obj.mesh.position.x = Math.cos(obj.orbitAngle) * obj.orbitRadius;
				obj.mesh.position.z = Math.sin(obj.orbitAngle) * obj.orbitRadius;
			}
			
			// Add some rotation with delta time (always active)
			obj.mesh.rotation.y += 0.01 * normalizedDelta;
			if (obj.type === 'square') {
				obj.mesh.rotation.x += 0.005 * normalizedDelta;
			}
		});

		// Rotate central mass with delta time
		centralMass.rotation.y += 0.005 * normalizedDelta;

		renderer.render(scene, camera);
	}

	function cleanup() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}

		if (renderer) {
			renderer.dispose();
		}
		
		// Dispose materials
		if (centralMaterial) centralMaterial.dispose();
		
		// Dispose all geometries and materials
		orbitalObjects.forEach(obj => {
			obj.mesh.geometry.dispose();
			(obj.mesh.material as THREE.Material).dispose();
		});
		
		// Dispose central mass
		if (centralMass) {
			centralMass.geometry.dispose();
		}
	}
</script>

<div class="relative h-full w-full">
	<!-- Three.js Canvas -->
	<div bind:this={container} class="w-full h-full">
		<!-- Title -->
		<div class="font-sharpie absolute top-4 left-1/2 transform -translate-x-1/2 text-center text-3xl text-white z-10">
			ORBITAL PHYSICS SANDBOX
		</div>

		<!-- Controls -->
		<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center justify-center gap-4 z-10">
			<!-- Actions -->
			<div class="flex flex-col items-center gap-2">
				<div class="font-sharpie text-sm text-white">ACTIONS</div>
				<div class="flex gap-2">
					<button
						class="font-sharpie rounded border-2 border-white bg-black px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-white hover:text-black"
						on:click={addOrbitalObject}
					>
						ADD OBJECT
					</button>
					<button
						class="font-sharpie rounded border-2 border-white bg-black px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-white hover:text-black"
						on:click={clearObjects}
					>
						CLEAR
					</button>
				</div>
			</div>

			<!-- Instructions -->
			<div class="flex flex-col items-center gap-2">
				<div class="font-sharpie text-sm text-white">CONTROLS</div>
				<div class="font-sharpie text-xs text-white text-center">
					Hover objects to pause and highlight similar shapes
				</div>
			</div>
		</div>

		<!-- FPS Display -->
		<div class="font-sharpie absolute top-16 left-4 text-sm text-white z-10">
			FPS: {fps} | Objects: {orbitalObjects.length}/{maxObjects}
		</div>
		
		<!-- Performance Warning -->
		{#if performanceWarning}
			<div class="font-sharpie absolute top-28 left-4 text-sm text-red-400 z-10">
				MAX OBJECTS REACHED
			</div>
		{/if}
		
		<!-- Hover Info -->
		{#if hoveredType}
			<div class="font-sharpie absolute top-16 right-4 text-sm text-white z-10">
				Hovering: {hoveredType.toUpperCase()}
			</div>
		{/if}

		<!-- Shape Legend -->
		<div class="font-sharpie absolute top-4 right-4 text-sm text-white z-10 bg-black bg-opacity-50 p-3 rounded">
			<div class="text-center mb-2">SHAPES</div>
			<div class="space-y-1">
				<div class="flex justify-between">
					<span>● Circles:</span>
					<span>{shapeCounts.circle}</span>
				</div>
				<div class="flex justify-between">
					<span>■ Squares:</span>
					<span>{shapeCounts.square}</span>
				</div>
				<div class="flex justify-between">
					<span>✕ X's:</span>
					<span>{shapeCounts.x}</span>
				</div>
				<div class="flex justify-between">
					<span>▲ Triangles:</span>
					<span>{shapeCounts.triangle}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style> 