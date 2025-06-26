<script lang="ts">
import HandDrawnBorder from './HandDrawnBorder.svelte';
import { onMount } from 'svelte';
import HandDrawnScrollbar from './HandDrawnScrollbar.svelte';
let isMobile = false;
let aboutContainer: HTMLDivElement;

onMount(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
});

function checkMobile() {
  isMobile = window.innerWidth < 768;
}
</script>

<div class="relative h-full w-full">
  <div bind:this={aboutContainer} class="flex flex-col w-full h-full gap-8 text-warm-white px-6 py-8 sm:px-4 sm:py-6 overflow-y-auto pr-4 scrollbar-hide">
    <!-- Top Section -->
    <div class="w-full">
      <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
        <div class="p-6 pl-10 sm:p-4 sm:pl-4">
          <h1 class="font-sharpie mb-2 text-4xl sm:text-3xl text-soft-white">Hey, I'm Marco 👋</h1>
          <p class="text-lg font-sharpie text-warm-white">
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
            <h2 class="font-sharpie mb-2 text-3xl sm:text-2xl text-soft-white">Day to Day</h2>
            <p class="text-base leading-relaxed font-sharpie text-warm-white">
              You'll usually find me sketching, mastering espresso, taking photos, and playing with AI.
            </p>
          </div>
        </HandDrawnBorder>
      </div>

      <!-- Right Box -->
      <div class="flex-1 w-full md:w-1/2 mt-6 md:mt-0">
        <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
          <div class="p-6 pl-10 sm:p-4 sm:pl-4">
            <h2 class="font-sharpie mb-2 text-3xl sm:text-2xl text-soft-white">Fun Facts</h2>
            <ul class="list-inside list-disc text-base leading-loose font-sharpie text-warm-white">
              <li>Collects Vintage Cameras 📸</li>
              <li>Obsessed with my cats 🐱</li>
              <li>Coffee addict 🧋</li>
            </ul>
          </div>
        </HandDrawnBorder>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="w-full">
      <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
        <div class="p-6 pl-10 sm:p-4 sm:pl-4">
          <h2 class="font-sharpie mb-4 text-3xl sm:text-2xl text-soft-white">Tools I Use</h2>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 text-base font-sharpie text-warm-white">
            <span>🧠 SvelteKit</span>
            <span>🎨 Figma</span>
            <span>🌐 Three.js</span>
            <span>�� Tailwind CSS</span>
            <span>🪶 Rough.js</span>
            <span>🚀 Vercel</span>
            <span>⚛️ React.js</span>
            <span>🔗 Next.js</span>
            <span>�� JavaScript</span>
            <span>🔡 TypeScript</span>
            <span>🟩 Node.js</span>
            <span>🌐 HTML5</span>
            <span>🎨 scss</span>
            <span>🤖 OpenAI Integration</span>
            <span>🧬 AI/ML Technologies</span>
            <span>🦾 LLM Implementation</span>
            <span>💡 Prompt Engineering</span>
            <span>🔧 Git</span>
            <span>🐳 Docker</span>
            <span>☁️ AWS</span>
            <span>🌥️ Google Cloud</span>
            <span>🔄 CI/CD</span>
            <span>📊 Google Analytics</span>
          </div>
        </div>
      </HandDrawnBorder>
    </div>

    <!-- Signature -->
    <div class="font-sharpie w-full pr-4 text-right text-3xl sm:text-2xl text-soft-white">— Marco</div>
  </div>
  {#if aboutContainer}
    <HandDrawnScrollbar container={aboutContainer} />
  {/if}
</div>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;     /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;             /* Safari and Chrome */
  }
</style> 