<script lang="ts">
import HandDrawnBorder from './HandDrawnBorder.svelte';
import { onMount } from 'svelte';
let isMobile = false;

onMount(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
});

function checkMobile() {
  isMobile = window.innerWidth < 768;
}
</script>

<div class="flex flex-col w-full h-full gap-8 text-white px-6 py-8 sm:px-4 sm:py-6">
  <!-- Top Section -->
  <div class="w-full">
    <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
      <div class="p-6 pl-10 sm:p-4 sm:pl-4">
        <h1 class="font-sharpie mb-2 text-3xl sm:text-2xl">Hey, I'm Marco 👋</h1>
        <p class="text-base font-sharpie">
          I'm a creative technologist and engineering leader passionate about building expressive, high-impact web experiences. With a background spanning digital agencies, startups, and global brands like National Geographic, I thrive at the intersection of design, technology, and strategy.
        </p>
      </div>
    </HandDrawnBorder>
  </div>

  <!-- Middle Section (Two Columns on desktop, single column on mobile) -->
  <div class="flex flex-col md:flex-row w-full gap-6 md:gap-8">
    <!-- Left Box -->
    <div class="flex-1 w-full md:w-1/2">
      <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
        <div class="p-6 pl-10 sm:p-4 sm:pl-4">
          <h2 class="font-sharpie mb-2 text-2xl sm:text-xl">Day to Day</h2>
          <p class="text-sm leading-relaxed font-sharpie">
            You'll usually find me sketching wireframes, tweaking CSS by hand, or experimenting with WebGL.
          </p>
        </div>
      </HandDrawnBorder>
    </div>

    <!-- Right Box -->
    <div class="flex-1 w-full md:w-1/2 mt-6 md:mt-0">
      <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
        <div class="p-6 pl-10 sm:p-4 sm:pl-4">
          <h2 class="font-sharpie mb-2 text-2xl sm:text-xl">Fun Facts</h2>
          <ul class="list-inside list-disc text-sm leading-loose font-sharpie">
            <li>Collects MPCs 🎛️</li>
            <li>Loves Sharpies 🖊️</li>
            <li>Figma-free Fridays 💡</li>
          </ul>
        </div>
      </HandDrawnBorder>
    </div>
  </div>

  <!-- Bottom Section -->
  <div class="w-full">
    <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
      <div class="p-6 pl-10 sm:p-4 sm:pl-4">
        <h2 class="font-sharpie mb-4 text-2xl sm:text-xl">Tools I Use</h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm font-sharpie">
          <span>🧠 SvelteKit</span>
          <span>🎨 Figma</span>
          <span>🌐 Three.js</span>
          <span>🧩 Tailwind CSS</span>
          <span>🪶 Rough.js</span>
          <span>🚀 Vercel</span>
        </div>
      </div>
    </HandDrawnBorder>
  </div>

  <!-- Signature -->
  <div class="font-sharpie w-full pr-4 text-right text-2xl sm:text-xl">— Marco</div>
</div> 