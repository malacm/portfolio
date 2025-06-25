<script lang="ts">
import HandDrawnBorder from './HandDrawnBorder.svelte';
import { createEventDispatcher, onMount } from 'svelte';

export let url: string = '';
export let title: string = '';
export let open: boolean = false;

const dispatch = createEventDispatcher();
let windowEl: HTMLDivElement;
let offset = { x: 0, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let windowStart = { x: 0, y: 0 };
let width = 500;
let height = 640;
const minWidth = 320;
const minHeight = 400;
const maxWidth = 1600;
const maxHeight = 1200;
let resizing = false;
let resizeStart = { x: 0, y: 0 };
let startSize = { w: 0, h: 0 };

function handleClose() {
	dispatch('close');
}

function onMouseDown(e: MouseEvent) {
	isDragging = true;
	dragStart = { x: e.clientX, y: e.clientY };
	const rect = windowEl.getBoundingClientRect();
	windowStart = { x: rect.left, y: rect.top };
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e: MouseEvent) {
	if (!isDragging) return;
	offset.x = windowStart.x + (e.clientX - dragStart.x);
	offset.y = windowStart.y + (e.clientY - dragStart.y);
	windowEl.style.left = offset.x + 'px';
	windowEl.style.top = offset.y + 'px';
}

function onMouseUp() {
	isDragging = false;
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('mouseup', onMouseUp);
}

function onResizeDown(e: MouseEvent) {
	resizing = true;
	resizeStart = { x: e.clientX, y: e.clientY };
	startSize = { w: width, h: height };
	document.addEventListener('mousemove', onResizeMove);
	document.addEventListener('mouseup', onResizeUp);
	e.stopPropagation();
}

function onResizeMove(e: MouseEvent) {
	if (!resizing) return;
	const dx = e.clientX - resizeStart.x;
	const dy = e.clientY - resizeStart.y;
	width = Math.max(minWidth, Math.min(maxWidth, startSize.w + dx));
	height = Math.max(minHeight, Math.min(maxHeight, startSize.h + dy));
}

function onResizeUp() {
	resizing = false;
	document.removeEventListener('mousemove', onResizeMove);
	document.removeEventListener('mouseup', onResizeUp);
}

onMount(() => {
	offset = { x: window.innerWidth / 2 - width / 2, y: window.innerHeight / 2 - height / 2 };
	if (windowEl) {
		windowEl.style.left = offset.x + 'px';
		windowEl.style.top = offset.y + 'px';
	}
});
</script>

{#if open}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style="backdrop-filter: blur(2px);">
	<div bind:this={windowEl} class="ios-window absolute" style="width:{width}px; height:{height}px; min-width:{minWidth}px; min-height:{minHeight}px;">
		<HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%" height="100%">
			<div class="window-flex-col" style="height: 100%;">
				<!-- iOS-style Header -->
				<div class="window-header" on:mousedown={onMouseDown}>
					<div class="font-sharpie text-lg text-gray-800 truncate">{title}</div>
					<button class="rounded-full w-8 h-8 flex items-center justify-center text-xl text-gray-500 hover:bg-gray-200 transition" on:click={handleClose} aria-label="Close">
						&times;
					</button>
				</div>
				<!-- Content -->
				<div class="window-content">
					<iframe src={url} allowfullscreen></iframe>
				</div>
				<!-- Resize Handle -->
				<div class="resize-handle" on:mousedown={onResizeDown} />
			</div>
		</HandDrawnBorder>
	</div>
</div>
{/if}

<style>
.ios-window {
	box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10);
	border-radius: 1.2rem;
	user-select: none;
}
:global(.ios-window > div),
.window-flex-col {
	height: 100%;
	width: 100%;
}
.window-flex-col {
	display: flex;
	flex-direction: column;
	background: white;
	border-radius: 1.2rem;
	overflow: hidden;
}
.window-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	background: #f3f4f6;
	border-bottom: 1px solid #e5e7eb;
	cursor: move;
	user-select: none;
	height: 48px;
	min-height: 48px;
	max-height: 48px;
}
.window-content {
	flex: 1 1 0%;
	height: 100%;
	width: 100%;
	background: white;
	position: relative;
	overflow: hidden;
}
.window-content iframe {
	height: 100%;
	width: 100%;
	border: 0;
	display: block;
}
.resize-handle {
	position: absolute;
	bottom: 8px;
	right: 8px;
	width: 28px;
	height: 28px;
	background: linear-gradient(135deg, #e5e7eb 60%, #fff 100%);
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.08);
	cursor: nwse-resize;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	z-index: 10;
}
.resize-handle:after {
	content: '';
	display: block;
	width: 16px;
	height: 16px;
	border-bottom: 2px solid #bbb;
	border-right: 2px solid #bbb;
	border-radius: 0 0 6px 0;
	margin: 6px;
}
</style> 