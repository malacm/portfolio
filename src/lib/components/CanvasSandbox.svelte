<script lang="ts">
	import { onMount } from 'svelte';
	import HandDrawnBorder from './HandDrawnBorder.svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let isMobile = false;

	// Drawing state
	let currentTool: 'pen' | 'brush' | 'eraser' | 'spray' = 'pen';
	let currentColor = '#ffffff';
	let currentSize = 3;
	let roughness = 0.5;

	// Canvas settings
	let canvasWidth = 0;
	let canvasHeight = 0;
	let container: HTMLDivElement | undefined;

	// Spray effect
	let sprayParticles: { x: number; y: number; size: number }[] = [];
	let sprayTimer: number | undefined;

	// Tools configuration
	const tools = [
		{ id: 'pen', label: 'PEN', icon: '✏️' },
		{ id: 'brush', label: 'BRUSH', icon: '🖌️' },
		{ id: 'eraser', label: 'ERASER', icon: '🧽' },
		{ id: 'spray', label: 'SPRAY', icon: '💨' }
	];

	const colors = [
		'#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', 
		'#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'
	];

	const sizes = [1, 3, 5, 8, 12, 16, 20];

	onMount(() => {
		checkMobile();
		updateCanvasSize();
		ctx = canvas.getContext('2d')!;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		
		// Set initial drawing styles
		ctx.strokeStyle = currentColor;
		ctx.lineWidth = currentSize;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// Handle resize
		if (container) {
			const resizeObserver = new ResizeObserver(() => {
				updateCanvasSize();
			});
			resizeObserver.observe(container);

			return () => {
				resizeObserver.disconnect();
			};
		}

		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}

	function updateCanvasSize() {
		if (container) {
			const rect = container.getBoundingClientRect();
			canvasWidth = rect.width;
			canvasHeight = rect.height;
			
			if (canvas) {
				canvas.width = canvasWidth;
				canvas.height = canvasHeight;
				
				// Redraw background if context exists
				if (ctx) {
					ctx.fillStyle = '#000000';
					ctx.fillRect(0, 0, canvasWidth, canvasHeight);
				}
			}
		}
	}

	function getEventCoordinates(e: MouseEvent | any): { x: number; y: number } {
		const rect = canvas.getBoundingClientRect();
		let clientX: number, clientY: number;

		// Check if it's a touch event by looking for touches property
		if (e.touches && e.touches.length > 0) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}

	function startDrawing(e: MouseEvent | any) {
		isDrawing = true;
		const coords = getEventCoordinates(e);
		lastX = coords.x;
		lastY = coords.y;
	}

	function draw(e: MouseEvent | any) {
		if (!isDrawing) return;

		const coords = getEventCoordinates(e);
		const x = coords.x;
		const y = coords.y;

		switch (currentTool) {
			case 'pen':
				drawPen(x, y);
				break;
			case 'brush':
				drawBrush(x, y);
				break;
			case 'eraser':
				drawEraser(x, y);
				break;
			case 'spray':
				drawSpray(x, y);
				break;
		}

		lastX = x;
		lastY = y;
	}

	function stopDrawing() {
		isDrawing = false;
		if (currentTool === 'spray') {
			clearInterval(sprayTimer);
		}
	}

	function drawPen(x: number, y: number) {
		ctx.strokeStyle = currentColor;
		ctx.lineWidth = currentSize;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function drawBrush(x: number, y: number) {
		ctx.strokeStyle = currentColor;
		ctx.lineWidth = currentSize * 2;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}

	function drawEraser(x: number, y: number) {
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = currentSize * 2;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function drawSpray(x: number, y: number) {
		const particleCount = 20;
		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * currentSize * 3;
			const px = x + Math.cos(angle) * distance;
			const py = y + Math.sin(angle) * distance;
			
			ctx.fillStyle = currentColor;
			ctx.globalAlpha = 0.3;
			ctx.beginPath();
			ctx.arc(px, py, 1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}

	function clearCanvas() {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	}

	function downloadCanvas() {
		const link = document.createElement('a');
		link.download = 'canvas-artwork.png';
		link.href = canvas.toDataURL();
		link.click();
	}

	function setTool(tool: typeof currentTool) {
		currentTool = tool;
	}

	function setColor(color: string) {
		currentColor = color;
	}

	function setSize(size: number) {
		currentSize = size;
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-6 p-4 {isMobile ? 'gap-4 p-2' : ''}">
	<!-- Title -->
	<div class="font-sharpie text-center text-3xl text-white {isMobile ? 'text-2xl' : ''}">
		CANVAS SANDBOX
	</div>

	<!-- Controls -->
	<div class="flex flex-wrap items-center justify-center gap-4 {isMobile ? 'gap-2' : ''}">
		<!-- Tools -->
		<div class="flex flex-col items-center gap-2">
			<div class="font-sharpie text-sm text-white {isMobile ? 'text-xs' : ''}">TOOLS</div>
			<div class="flex gap-2 {isMobile ? 'gap-1' : ''}">
				{#each tools as tool}
					<button
						class="font-sharpie flex items-center justify-center rounded border-2 border-white bg-black text-white transition-all duration-200 hover:bg-white hover:text-black {currentTool === tool.id ? 'bg-white text-black' : ''} {isMobile ? 'h-10 w-10' : 'h-12 w-12'}"
						on:click={() => setTool(tool.id as typeof currentTool)}
						title={tool.label}
					>
						<span class="{isMobile ? 'text-sm' : 'text-lg'}">{tool.icon}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Colors -->
		<div class="flex flex-col items-center gap-2">
			<div class="font-sharpie text-sm text-white {isMobile ? 'text-xs' : ''}">COLORS</div>
			<div class="flex gap-2 {isMobile ? 'gap-1' : ''}">
				{#each colors as color}
					<button
						class="rounded border-2 border-white transition-all duration-200 hover:scale-110 {currentColor === color ? 'scale-110 border-2' : ''} {isMobile ? 'h-6 w-6' : 'h-8 w-8'}"
						style="background-color: {color}"
						on:click={() => setColor(color)}
						title={color}
					/>
				{/each}
			</div>
		</div>

		<!-- Size -->
		<div class="flex flex-col items-center gap-2">
			<div class="font-sharpie text-sm text-white {isMobile ? 'text-xs' : ''}">SIZE</div>
			<div class="flex gap-2 {isMobile ? 'gap-1' : ''}">
				{#each sizes.slice(0, isMobile ? 4 : sizes.length) as size}
					<button
						class="font-sharpie flex items-center justify-center rounded border-2 border-white bg-black text-white transition-all duration-200 hover:bg-white hover:text-black {currentSize === size ? 'bg-white text-black' : ''} {isMobile ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-xs'}"
						on:click={() => setSize(size)}
						title="Size {size}"
					>
						{size}
					</button>
				{/each}
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-col items-center gap-2">
			<div class="font-sharpie text-sm text-white {isMobile ? 'text-xs' : ''}">ACTIONS</div>
			<div class="flex gap-2 {isMobile ? 'gap-1' : ''}">
				<button
					class="font-sharpie rounded border-2 border-white bg-black px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-white hover:text-black {isMobile ? 'px-2 py-1 text-xs' : ''}"
					on:click={clearCanvas}
				>
					CLEAR
				</button>
				<button
					class="font-sharpie rounded border-2 border-white bg-black px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-white hover:text-black {isMobile ? 'px-2 py-1 text-xs' : ''}"
					on:click={downloadCanvas}
				>
					SAVE
				</button>
			</div>
		</div>
	</div>

	<!-- Canvas Container -->
	<HandDrawnBorder>
		<div bind:this={container} class="relative w-full h-full">
			<canvas
				bind:this={canvas}
				width={canvasWidth}
				height={canvasHeight}
				class="cursor-crosshair border-2 border-white bg-black w-full h-full"
				on:mousedown={startDrawing}
				on:mousemove={draw}
				on:mouseup={stopDrawing}
				on:mouseleave={stopDrawing}
				on:touchstart|preventDefault={startDrawing}
				on:touchmove|preventDefault={draw}
				on:touchend|preventDefault={stopDrawing}
				style="touch-action: none;"
			/>
			<!-- Instructions overlay -->
			<div class="font-sharpie absolute bottom-4 left-4 text-sm text-white opacity-70 {isMobile ? 'text-xs bottom-2 left-2' : ''}">
				{isMobile ? 'Touch and drag to draw' : 'Click and drag to draw'} • Use tools above to change drawing style
			</div>
		</div>
	</HandDrawnBorder>
</div>

<style>
	.font-sharpie {
		font-family: 'Permanent Marker', cursive;
	}
</style> 