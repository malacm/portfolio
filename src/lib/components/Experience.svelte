<script lang="ts">
import HandDrawnBorder from './HandDrawnBorder.svelte';
import { onMount } from 'svelte';

interface Experience {
  title: string;
  company: string;
  location: string;
  type: string;
  period: string;
  description: string;
  details?: string[];
}

const experiences: Experience[] = [
    {
    title: 'Lead Front End Engineer',
    company: 'National Geographic',
    location: 'Remote / NYC',
    type: 'Full-time',
    period: 'April 2024 – Present · 1 yr 2 mos',
    description: 'As Lead Front End Engineer at National Geographic, I drive the adoption of modern web technologies to accelerate development and deliver world-class digital experiences.',
    details: [
      'Introduced new technologies to speed up front-end workflows and improve developer efficiency.',
      'Led the build of the new National Geographic Expeditions website.',
      'Spearheaded the migration of a legacy site from Episerver to a Next.js + Vercel stack.',
      'Managed the technical aspects of a major rebrand and site redesign.',
      'Oversaw a high-profile co-branding project in partnership with Disney.'
    ]
  },
  {
    title: 'Co-founder & COO',
    company: 'Celest',
    location: 'Los Angeles, California, United States · Remote',
    type: 'Full-time',
    period: 'Jan 2024 – May 2025 · 1 yr 6 mos',
    description: 'Celest reimagines digital entrepreneurship into one composable platform infused with the power of OpenAI.'
  },
  {
    title: 'Partner & Creative Architect',
    company: 'Certifyde',
    location: 'United States · Remote',
    type: 'Full-time',
    period: 'Oct 2022 – Present · 2 yrs 9 mos',
    description: 'As a forward-thinking and innovative software developer at Certifyde, I specialize in bringing cutting-edge educational technology to life. My primary role involves architecting and engineering both the iOS platform and the Teacher Portal, a testament to my expertise in creating user-friendly and impactful digital solutions in the education sector.',
    details: [
      'iOS Platform Design & Development: Designed and developed the iOS app for Certifyde, ensuring seamless functionality and an intuitive user interface.',
      'Teacher Portal Architect: Spearheaded the development of the Teacher Portal, ensuring robustness and adaptability to educators\' needs.',
      'Skills: Excellent problem-solving, Swift for iOS, front-end web tech, strong UI/UX in education.',
      'Vision: Passion for leveraging technology to enhance learning experiences and empower educators and learners.'
    ]
  },
  {
    title: 'Founder',
    company: 'Happy Thoughts Studio',
    location: 'Los Angeles, California, United States',
    type: 'Full-time',
    period: 'Feb 2021 – Present · 4 yrs 5 mos',
    description: '',
    details: [
      'Led digital strategy and creative direction for client web projects.',
      'Oversaw end-to-end website design and development, from concept to launch.',
      'Collaborated with clients to define brand identity and digital presence.',
      'Managed a multidisciplinary team of designers, developers, and strategists.',
      'Delivered innovative, user-centric web solutions for diverse industries.'
    ]
  },
  {
    title: 'Lead Engineer',
    company: 'MERGE',
    location: 'Los Angeles, California, United States',
    type: 'Full-time',
    period: 'Jan 2022 – Present · 3 yrs 6 mos',
    description: 'As Lead Engineer at Merge, I blend technical expertise with strategic leadership to drive innovative engineering solutions. My role centers around:',
    details: [
      'Technical Oversight: Managing complex engineering projects from conception to implementation.',
      'Team Leadership: Mentoring a dynamic team of engineers and cultivating a culture of innovation.',
      'Cross-Functional Collaboration: Aligning engineering goals with company objectives.',
      'Skills: Web/Software Dev, SEM, Digital Marketing, Analytics, Next.js, React.js, Node.js, SEO, Agile, Leadership.'
    ]
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Crescendo Collective',
    location: 'Los Angeles, California, United States',
    type: 'Full-time',
    period: 'Jul 2021 – Jan 2022 · 7 mos',
    description: ''
  },
  {
    title: 'Front End Developer',
    company: 'Crescendo Collective',
    location: 'Greater Milwaukee',
    type: 'Full-time',
    period: 'Jan 2019 – Jan 2022 · 3 yrs 1 mo',
    description: ''
  }
];

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

<div class="flex flex-col w-full h-full gap-8 text-white px-1 py-2 sm:px-4 sm:py-6">
  <!-- Header -->
  <div class="w-full">
      <div class="p-1 pl-1 sm:p-4 sm:pl-4">
        <h1 class="font-sharpie mb-2 text-3xl sm:text-2xl">Experience</h1>
        <p class="text-base sm:text-sm font-sharpie">A summary of my professional journey, leadership, and creative roles.</p>
      </div>
  </div>

  <!-- Experience Grid -->
  <div class="flex w-full flex-col gap-6 sm:gap-4">
    {#each experiences as exp}
      <div class="relative w-full">
        <HandDrawnBorder strokeWidth={2.5} roughness={2.2} width="100%">
          <div class="p-1 pl-1 sm:p-2 sm:pl-2">
            <div class="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <h2 class="font-sharpie text-2xl sm:text-xl">{exp.title}</h2>
              <span class="rounded-full bg-white/10 px-3 py-1 font-sharpie text-base sm:text-sm">{exp.company}</span>
              <span class="rounded-full bg-white/10 px-3 py-1 font-sharpie text-base sm:text-sm">{exp.type}</span>
            </div>
            <div class="mb-2 flex flex-wrap gap-2 text-base text-white/70 font-sharpie">
              <span>{exp.period}</span>
              <span>•</span>
              <span>{exp.location}</span>
            </div>
            {#if exp.description}
              <p class="mb-2 text-base leading-relaxed sm:text-base font-sharpie">{exp.description}</p>
            {/if}
            {#if exp.details}
              <ul class="mb-2 list-inside list-disc text-base leading-loose sm:text-base font-sharpie">
                {#each exp.details as detail}
                  <li>{detail}</li>
                {/each}
              </ul>
            {/if}
          </div>
        </HandDrawnBorder>
      </div>
    {/each}
  </div>
</div> 