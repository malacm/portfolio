<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let isPunk = true;
	let isPunkPeace = false;
	let subtitle: HTMLDivElement;
	let bgEffect: HTMLDivElement;
	let container: HTMLDivElement;
	let punkText: HTMLDivElement;
	let peaceText: HTMLDivElement;
	let punkPeaceText: HTMLDivElement;
	let isMobile = false;
	let textContainer: HTMLDivElement;

	const punkSubtitles = [
		'take risk • push boundaries • chaotic good 4ever',
		'use your voice • challenge the status quo',
		'question authority • make mistakes',
		'death to celebrity worship • independent and proud'
	];

	const peaceSubtitles = [
		"be flexible don't flex • take care of each other",
		'nurture creativity • community first always',
		"make work that works • don't overcomplicate it",
		'take care of the earth • stay hydrated'
	];

	const punkPeaceSubtitles = [
		'organized chaos • balanced rebellion',
		'creative destruction • peaceful revolution',
		'structured anarchy • mindful disruption',
		'controlled chaos • intentional rebellion'
	];

	let punkGlitchTimeline: gsap.core.Timeline | null = null;
	let peaceFloatTimeline: gsap.core.Timeline | null = null;
	let punkPeaceTimeline: gsap.core.Timeline | null = null;

	function glitchPunkText() {
		if (!punkText) return null;
		gsap.set(punkText, { clearProps: 'all' });
		return gsap.timeline({ repeat: -1, yoyo: true }).to(punkText, {
			x: () => Math.random() * 8 - 4,
			y: () => Math.random() * 8 - 4,
			rotation: () => Math.random() * 8 - 4,
			color: () => ['#ff0080', '#00ff80', '#0080ff', '#ffff00'][Math.floor(Math.random() * 4)],
			textShadow: () => `0 0 16px #ff0080, 2px 2px 0 #00ff80, -2px -2px 0 #0080ff`,
			duration: 0.08 + Math.random() * 0.12,
			ease: 'power2.inOut'
		});
	}

	function createPeaceFlowers() {
		if (!peaceText) return;

		// Clear any existing flowers
		const existingFlowers = document.querySelectorAll('.peace-flower');
		existingFlowers.forEach((flower) => flower.remove());

		const flowerCount = 6 + Math.floor(Math.random() * 4); // 6-9 flowers
		const flowers = [];

		for (let i = 0; i < flowerCount; i++) {
			const flower = document.createElement('div');
			flower.className = 'peace-flower';
			flower.textContent = '🌼';

			// Random position around the peace text
			const angle = (i / flowerCount) * 360 + Math.random() * 60;
			const distance = 80 + Math.random() * 40; // 80-120px from center
			const x = Math.cos((angle * Math.PI) / 180) * distance;
			const y = Math.sin((angle * Math.PI) / 180) * distance;

			// Random scale and rotation
			const scale = 0.8 + Math.random() * 0.8; // 0.8-1.6 scale
			const rotation = Math.random() * 360;

			flower.style.cssText = `
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg);
				font-size: 24px;
				opacity: 0;
				pointer-events: none;
				z-index: 1;
			`;

			// Add to the text container
			peaceText.parentElement?.appendChild(flower);
			flowers.push(flower);
		}

		// Animate flowers in
		gsap.to(flowers, {
			opacity: 1,
			duration: 0.6,
			stagger: 0.1,
			ease: 'back.out(1.7)',
			delay: 0.3
		});

		// Add continuous rotation animation
		flowers.forEach((flower, i) => {
			gsap.to(flower, {
				rotation: `+=${360 + Math.random() * 180}`,
				duration: 8 + Math.random() * 4,
				repeat: -1,
				ease: 'none',
				delay: i * 0.2
			});
		});
	}

	function createPunkLightning() {
		if (!punkText) return;

		// Clear any existing lightning
		const existingLightning = document.querySelectorAll('.punk-lightning');
		existingLightning.forEach((lightning) => lightning.remove());

		const lightningCount = 4 + Math.floor(Math.random() * 3); // 4-6 lightning bolts
		const lightningBolts = [];

		for (let i = 0; i < lightningCount; i++) {
			const lightning = document.createElement('div');
			lightning.className = 'punk-lightning';
			lightning.textContent = '⚡';

			// Random position around the punk text
			const angle = (i / lightningCount) * 360 + Math.random() * 120;
			const distance = 70 + Math.random() * 50; // 70-120px from center
			const x = Math.cos((angle * Math.PI) / 180) * distance;
			const y = Math.sin((angle * Math.PI) / 180) * distance;

			// Random scale and rotation
			const scale = 0.9 + Math.random() * 1.1; // 0.9-2.0 scale
			const rotation = Math.random() * 360;

			lightning.style.cssText = `
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg);
				font-size: 28px;
				opacity: 0;
				pointer-events: none;
				z-index: 1;
				filter: drop-shadow(0 0 8px #ffff00);
			`;

			// Add to the text container
			punkText.parentElement?.appendChild(lightning);
			lightningBolts.push(lightning);
		}

		// Animate lightning in with shake effect
		gsap.to(lightningBolts, {
			opacity: 1,
			duration: 0.3,
			stagger: 0.05,
			ease: 'power2.out',
			delay: 0.2
		});

		// Add continuous shake and up/down movement
		lightningBolts.forEach((lightning, i) => {
			// Shake animation
			gsap.to(lightning, {
				x: `+=${Math.random() * 10 - 5}`,
				y: `+=${Math.random() * 10 - 5}`,
				rotation: `+=${Math.random() * 20 - 10}`,
				duration: 0.1 + Math.random() * 0.2,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				delay: i * 0.1
			});

			// Up/down movement
			gsap.to(lightning, {
				y: `+=${-15 + Math.random() * 30}`,
				duration: 0.8 + Math.random() * 0.4,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				delay: i * 0.2
			});
		});
	}

	function floatPeaceText() {
		if (!peaceText) return null;
		gsap.set(peaceText, { clearProps: 'all' });

		// Create a smoother, more engaging peace animation
		return gsap
			.timeline({ repeat: -1 })
			.to(peaceText, {
				y: -6,
				scale: 1.015,
				duration: 2.5,
				ease: 'power1.inOut'
			})
			.to(peaceText, {
				y: 0,
				scale: 1,
				duration: 2.5,
				ease: 'power1.inOut'
			})
			.to(
				peaceText,
				{
					rotation: 0.3,
					duration: 4,
					ease: 'power1.inOut'
				},
				0
			)
			.to(
				peaceText,
				{
					rotation: -0.3,
					duration: 4,
					ease: 'power1.inOut'
				},
				4
			)
			.to(
				peaceText,
				{
					filter: 'brightness(1.1)',
					duration: 2,
					ease: 'power1.inOut'
				},
				0
			)
			.to(
				peaceText,
				{
					filter: 'brightness(1)',
					duration: 2,
					ease: 'power1.inOut'
				},
				2
			);
	}

	function punkPeaceHarmony() {
		if (!punkPeaceText) return null;
		gsap.set(punkPeaceText, { clearProps: 'all' });

		// Create a harmonious blend of punk glitch and peace float
		return (
			gsap
				.timeline({ repeat: -1 })
				// Gentle floating movement
				.to(punkPeaceText, {
					y: -4,
					scale: 1.01,
					duration: 3,
					ease: 'power1.inOut'
				})
				.to(punkPeaceText, {
					y: 0,
					scale: 1,
					duration: 3,
					ease: 'power1.inOut'
				})
				// Subtle glitch effects (less aggressive than pure punk)
				.to(
					punkPeaceText,
					{
						x: () => Math.random() * 4 - 2,
						y: () => Math.random() * 4 - 2,
						rotation: () => Math.random() * 2 - 1,
						color: () => ['#ff0080', '#00ff80'][Math.floor(Math.random() * 2)],
						textShadow: () => `0 0 20px ${Math.random() > 0.5 ? '#ff0080' : '#00ff80'}`,
						duration: 0.15 + Math.random() * 0.1,
						ease: 'power2.inOut'
					},
					0
				)
				// Brightness pulse
				.to(
					punkPeaceText,
					{
						filter: 'brightness(1.15)',
						duration: 2,
						ease: 'power1.inOut'
					},
					0
				)
				.to(
					punkPeaceText,
					{
						filter: 'brightness(1)',
						duration: 2,
						ease: 'power1.inOut'
					},
					2
				)
		);
	}

	function createPunkPeaceElements() {
		if (!punkPeaceText) return;

		// Clear any existing elements
		const existingFlowers = document.querySelectorAll('.peace-flower');
		const existingLightning = document.querySelectorAll('.punk-lightning');
		existingFlowers.forEach((flower) => flower.remove());
		existingLightning.forEach((lightning) => lightning.remove());

		// Create flowers
		const flowerCount = 4 + Math.floor(Math.random() * 3); // 4-6 flowers
		const flowers = [];

		for (let i = 0; i < flowerCount; i++) {
			const flower = document.createElement('div');
			flower.className = 'peace-flower';
			flower.textContent = '🌼';

			const angle = (i / flowerCount) * 360 + Math.random() * 60;
			const distance = 60 + Math.random() * 30; // 60-90px from center
			const x = Math.cos((angle * Math.PI) / 180) * distance;
			const y = Math.sin((angle * Math.PI) / 180) * distance;

			const scale = 0.7 + Math.random() * 0.6; // 0.7-1.3 scale
			const rotation = Math.random() * 360;

			flower.style.cssText = `
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg);
				font-size: 20px;
				opacity: 0;
				pointer-events: none;
				z-index: 1;
			`;

			punkPeaceText.parentElement?.appendChild(flower);
			flowers.push(flower);
		}

		// Create lightning
		const lightningCount = 3 + Math.floor(Math.random() * 2); // 3-4 lightning bolts
		const lightningBolts = [];

		for (let i = 0; i < lightningCount; i++) {
			const lightning = document.createElement('div');
			lightning.className = 'punk-lightning';
			lightning.textContent = '⚡';

			const angle = (i / lightningCount) * 360 + Math.random() * 120;
			const distance = 80 + Math.random() * 40; // 80-120px from center
			const x = Math.cos((angle * Math.PI) / 180) * distance;
			const y = Math.sin((angle * Math.PI) / 180) * distance;

			const scale = 0.8 + Math.random() * 0.8; // 0.8-1.6 scale
			const rotation = Math.random() * 360;

			lightning.style.cssText = `
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg);
				font-size: 24px;
				opacity: 0;
				pointer-events: none;
				z-index: 1;
				filter: drop-shadow(0 0 6px #ffff00);
			`;

			punkPeaceText.parentElement?.appendChild(lightning);
			lightningBolts.push(lightning);
		}

		// Animate elements in
		gsap.to([...flowers, ...lightningBolts], {
			opacity: 1,
			duration: 0.5,
			stagger: 0.08,
			ease: 'back.out(1.7)',
			delay: 0.3
		});

		// Add gentle animations
		flowers.forEach((flower, i) => {
			gsap.to(flower, {
				rotation: `+=${360 + Math.random() * 180}`,
				duration: 10 + Math.random() * 4,
				repeat: -1,
				ease: 'none',
				delay: i * 0.3
			});
		});

		lightningBolts.forEach((lightning, i) => {
			// Gentle shake
			gsap.to(lightning, {
				x: `+=${Math.random() * 6 - 3}`,
				y: `+=${Math.random() * 6 - 3}`,
				rotation: `+=${Math.random() * 10 - 5}`,
				duration: 0.2 + Math.random() * 0.3,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				delay: i * 0.2
			});

			// Gentle up/down
			gsap.to(lightning, {
				y: `+=${-10 + Math.random() * 20}`,
				duration: 1.2 + Math.random() * 0.6,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut',
				delay: i * 0.4
			});
		});
	}

	function activatePunkPeace() {
		if (isPunkPeace) return; // Already in PunkPeace mode

		// Kill existing timelines
		if (punkGlitchTimeline) punkGlitchTimeline.kill();
		if (peaceFloatTimeline) peaceFloatTimeline.kill();

		// Clear existing elements
		const flowers = document.querySelectorAll('.peace-flower');
		const lightning = document.querySelectorAll('.punk-lightning');
		gsap.to([...flowers, ...lightning], {
			opacity: 0,
			scale: 0,
			duration: 0.3,
			stagger: 0.05,
			onComplete: () => {
				flowers.forEach((flower) => flower.remove());
				lightning.forEach((bolt) => bolt.remove());
			}
		});

		// Hide current text
		const currentText = isPunk ? punkText : peaceText;
		gsap.to(currentText, {
			opacity: 0,
			scale: 0.8,
			rotation: 5,
			duration: 0.4,
			ease: 'power2.in',
			onComplete: () => {
				currentText.style.display = 'none';
				punkPeaceText.style.display = 'block';
				gsap.fromTo(
					punkPeaceText,
					{ opacity: 0, scale: 0.5, y: 50 },
					{ opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
				);

				// Start PunkPeace animations
				punkPeaceTimeline = punkPeaceHarmony();
				createPunkPeaceElements();
			}
		});

		// Update subtitle
		if (subtitle) {
			gsap.to(subtitle, {
				opacity: 0,
				duration: 0.3,
				onComplete: () => {
					subtitle.textContent =
						punkPeaceSubtitles[Math.floor(Math.random() * punkPeaceSubtitles.length)];
					gsap.to(subtitle, { opacity: 1, duration: 0.5 });
				}
			});
		}

		// Update background
		if (bgEffect) {
			const newBg = `radial-gradient(circle at 50% 45%, rgba(255, 0, 128, 0.15) 0%, rgba(255, 0, 128, 0.05) 25%, transparent 50%),
						   radial-gradient(circle at 50% 45%, rgba(0, 255, 128, 0.15) 0%, rgba(0, 255, 128, 0.05) 25%, transparent 50%)`;

			gsap.to(bgEffect, {
				background: newBg,
				duration: 0.8,
				ease: 'power2.out'
			});
		}

		isPunkPeace = true;
		isPunk = false;
	}

	function switchMode() {
		// If in PunkPeace mode, switch back to regular modes
		if (isPunkPeace) {
			// Kill PunkPeace timeline
			if (punkPeaceTimeline) punkPeaceTimeline.kill();

			// Clear PunkPeace elements
			const flowers = document.querySelectorAll('.peace-flower');
			const lightning = document.querySelectorAll('.punk-lightning');
			gsap.to([...flowers, ...lightning], {
				opacity: 0,
				scale: 0,
				duration: 0.3,
				stagger: 0.05,
				onComplete: () => {
					flowers.forEach((flower) => flower.remove());
					lightning.forEach((bolt) => bolt.remove());
				}
			});

			// Hide PunkPeace text and show PUNK
			gsap.to(punkPeaceText, {
				opacity: 0,
				scale: 0.8,
				rotation: -5,
				duration: 0.4,
				ease: 'power2.in',
				onComplete: () => {
					punkPeaceText.style.display = 'none';
					punkText.style.display = 'block';
					gsap.set(punkText, { opacity: 1, scale: 1, y: 0 });
					punkGlitchTimeline = glitchPunkText();
					createPunkLightning();
				}
			});

			// Update subtitle and background
			if (subtitle) {
				gsap.to(subtitle, {
					opacity: 0,
					duration: 0.3,
					onComplete: () => {
						subtitle.textContent = punkSubtitles[Math.floor(Math.random() * punkSubtitles.length)];
						gsap.to(subtitle, { opacity: 1, duration: 0.5 });
					}
				});
			}

			if (bgEffect) {
				const newBg = `radial-gradient(circle at 50% 45%, rgba(255, 0, 128, 0.2) 0%, rgba(255, 0, 128, 0.1) 30%, transparent 60%),
							   radial-gradient(circle at 50% 45%, rgba(0, 128, 255, 0.15) 0%, rgba(0, 128, 255, 0.05) 25%, transparent 50%),
							   radial-gradient(circle at 50% 45%, rgba(0, 255, 128, 0.1) 0%, transparent 40%)`;

				gsap.to(bgEffect, {
					background: newBg,
					duration: 0.8,
					ease: 'power2.out'
				});
			}

			isPunkPeace = false;
			isPunk = true;
			return;
		}

		// Regular mode switching logic
		isPunk = !isPunk;

		const currentText = isPunk ? peaceText : punkText;
		const nextText = isPunk ? punkText : peaceText;
		const subtitles = isPunk ? punkSubtitles : peaceSubtitles;

		// Kill glitch timeline if switching to peace mode
		if (!isPunk && punkGlitchTimeline) {
			punkGlitchTimeline.kill();
			punkGlitchTimeline = null;
		}

		// Kill peace float timeline if switching to punk mode
		if (isPunk && peaceFloatTimeline) {
			peaceFloatTimeline.kill();
			peaceFloatTimeline = null;
		}

		// Clear flowers when switching to punk mode
		if (isPunk) {
			const flowers = document.querySelectorAll('.peace-flower');
			gsap.to(flowers, {
				opacity: 0,
				scale: 0,
				duration: 0.3,
				stagger: 0.05,
				onComplete: () => {
					flowers.forEach((flower) => flower.remove());
				}
			});
		}

		// Clear lightning when switching to peace mode
		if (!isPunk) {
			const lightning = document.querySelectorAll('.punk-lightning');
			gsap.to(lightning, {
				opacity: 0,
				scale: 0,
				duration: 0.2,
				stagger: 0.03,
				onComplete: () => {
					lightning.forEach((bolt) => bolt.remove());
				}
			});
		}

		// Animate current text out
		gsap.to(currentText, {
			opacity: 0,
			scale: 0.8,
			rotation: isPunk ? 5 : -5,
			duration: 0.4,
			ease: 'power2.in',
			onComplete: () => {
				currentText.style.display = 'none';
				nextText.style.display = 'block';

				// Only animate opacity if switching from punk to peace
				if (!isPunk) {
					gsap.fromTo(
						nextText,
						{ opacity: 0, scale: 0.5, y: 50 },
						{ opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
					);
				} else {
					gsap.set(nextText, { opacity: 1, scale: 1, y: 0 });
				}

				// Start appropriate animation based on mode
				if (isPunk) {
					punkGlitchTimeline = glitchPunkText();
					createPunkLightning();
				} else {
					peaceFloatTimeline = floatPeaceText();
					createPeaceFlowers();
				}
			}
		});

		// Update subtitle
		if (subtitle) {
			gsap.to(subtitle, {
				opacity: 0,
				duration: 0.3,
				onComplete: () => {
					subtitle.textContent = subtitles[Math.floor(Math.random() * subtitles.length)];
					gsap.to(subtitle, { opacity: 1, duration: 0.5 });
				}
			});
		}

		// Update background
		if (bgEffect) {
			const newBg = isPunk
				? `radial-gradient(circle at 50% 45%, rgba(255, 0, 128, 0.2) 0%, rgba(255, 0, 128, 0.1) 30%, transparent 60%),
				   radial-gradient(circle at 50% 45%, rgba(0, 128, 255, 0.15) 0%, rgba(0, 128, 255, 0.05) 25%, transparent 50%),
				   radial-gradient(circle at 50% 45%, rgba(0, 255, 128, 0.1) 0%, transparent 40%)`
				: 'radial-gradient(circle at 50% 45%, rgba(0, 255, 128, 0.15) 0%, rgba(0, 255, 128, 0.05) 40%, transparent 70%)';

			gsap.to(bgEffect, {
				background: newBg,
				duration: 0.8,
				ease: 'power2.out'
			});
		}
	}

	function handleMouseEnter() {
		const text = isPunk ? punkText : peaceText;
		if (text) {
			gsap.to(text, {
				scale: isPunk ? 1.1 : 1.05,
				rotation: isPunk ? -2 : 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
	}

	function handleMouseLeave() {
		const text = isPunk ? punkText : peaceText;
		if (text) {
			gsap.to(text, {
				scale: 1,
				rotation: 0,
				duration: 0.3,
				ease: 'power2.out'
			});
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			switchMode();
		}
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		setTimeout(() => {
			if (punkText && peaceText && punkPeaceText) {
				punkText.style.display = 'block';
				peaceText.style.display = 'none';
				punkPeaceText.style.display = 'none';
				punkGlitchTimeline = glitchPunkText();
				createPunkLightning();
			}
			if (bgEffect) {
				bgEffect.style.background = `
					radial-gradient(circle at 50% 45%, rgba(255, 0, 128, 0.2) 0%, rgba(255, 0, 128, 0.1) 30%, transparent 60%),
					radial-gradient(circle at 50% 45%, rgba(0, 128, 255, 0.15) 0%, rgba(0, 128, 255, 0.05) 25%, transparent 50%),
					radial-gradient(circle at 50% 45%, rgba(0, 255, 128, 0.1) 0%, transparent 40%)
				`;
			}
		}, 500);

		let demoTimeout = setTimeout(() => {
			switchMode();
			setTimeout(() => switchMode(), 3000);
		}, 5000);

		if (container) {
			container.addEventListener('click', () => {
				clearTimeout(demoTimeout);
			});
		}

		return () => {
			clearTimeout(demoTimeout);
			window.removeEventListener('resize', checkMobile);
			if (punkGlitchTimeline) punkGlitchTimeline.kill();
			if (peaceFloatTimeline) peaceFloatTimeline.kill();
			if (punkPeaceTimeline) punkPeaceTimeline.kill();
			// Clean up any remaining flowers and lightning
			const flowers = document.querySelectorAll('.peace-flower');
			const lightning = document.querySelectorAll('.punk-lightning');
			flowers.forEach((flower) => flower.remove());
			lightning.forEach((bolt) => bolt.remove());
		};
	});

	function checkMobile() {
		isMobile = window.innerWidth < 768;
	}
</script>

<div class="micro-interaction-container" bind:this={container}>
	<div class="background-effect" bind:this={bgEffect}></div>
	<div class="container">
		<div class="title">ZERO STUDIOS PHILOSOPHY</div>
		<div class="toggle-container" bind:this={textContainer}>
			<div class="click-me-text">"click ⬇️"</div>
			<div class="text-container">
				<div
					class="punk-text"
					bind:this={punkText}
					style="display: none;"
					tabindex="0"
					role="button"
					aria-label="Toggle to PEACE mode"
					on:click={switchMode}
					on:keydown={handleKeydown}
				>
					PUNK
				</div>
				<div
					class="peace-text"
					bind:this={peaceText}
					style="display: none;"
					tabindex="0"
					role="button"
					aria-label="Toggle to PUNK mode"
					on:click={switchMode}
					on:keydown={handleKeydown}
				>
					PEACE
				</div>
				<div
					class="punk-peace-combo"
					bind:this={punkPeaceText}
					style="display: none;"
					tabindex="0"
					role="button"
					aria-label="Toggle to PUNK mode"
					on:click={switchMode}
					on:keydown={handleKeydown}
				>
					<span class="punk-text-inline">PUNK</span><span class="peace-text-inline">PEACE</span>
				</div>
			</div>
		</div>
		<div class="subtitle" bind:this={subtitle}>
			take risk • push boundaries • chaotic good 4ever
		</div>
		<span
			class="punk-peace-emoji-trigger"
			on:click={activatePunkPeace}
			on:keydown={handleKeydown}
			tabindex="0"
			role="button"
			aria-label="Activate PunkPeace mode"
		>
			✌️
			<div class="punk-peace-emoji-text">press me for both</div>
		</span>
	</div>
	<div class="instructions">
		Click to toggle between PUNK and PEACE modes<br />
		<em>Embodying Zero's core philosophy of organized chaos</em>
	</div>
</div>

<style>
	.micro-interaction-container {
		position: relative;
		width: 100%;
		max-width: 600px;
		height: 500px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #fff;
		background: rgba(0, 0, 0, 0.8);
		border-radius: 16px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 767px) {
		.micro-interaction-container {
			height: 400px;
			padding: 1rem;
			border-radius: 12px;
		}
	}

	.container {
		text-align: center;
		position: relative;
		z-index: 2;
		width: 100%;
	}

	.title {
		font-size: 1rem;
		margin-bottom: 2rem;
		opacity: 0.7;
		letter-spacing: 0.1em;
		font-family: 'Permanent Marker', cursive;
		text-transform: uppercase;
	}

	@media (max-width: 767px) {
		.title {
			font-size: 0.8rem;
			margin-bottom: 1.5rem;
		}
	}

	.toggle-container {
		position: relative;
		display: inline-block;
		cursor: pointer;
		user-select: none;
		padding: 1.5rem;
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	@media (max-width: 767px) {
		.toggle-container {
			padding: 1rem;
		}
	}

	.text-container {
		position: relative;
		display: inline-block;
	}

	.punk-text,
	.peace-text,
	.punk-peace-text {
		font-size: 4rem;
		font-weight: 900;
		letter-spacing: 0.05em;
		position: relative;
		z-index: 2;
		font-family: 'Permanent Marker', cursive;
		text-transform: uppercase;
		line-height: 1;
		cursor: pointer;
		outline: none;
	}

	@media (max-width: 767px) {
		.punk-text,
		.peace-text,
		.punk-peace-text {
			font-size: 2.5rem;
		}
	}

	.punk-text:focus,
	.peace-text:focus,
	.punk-peace-text:focus {
		box-shadow: 0 0 0 2px #00ff80;
	}

	.punk-text {
		color: #ff0080;
		text-shadow:
			3px 3px 0 #00ff80,
			-3px -3px 0 #0080ff,
			6px 6px 0 rgba(255, 255, 255, 0.2),
			0 0 30px #ff0080;
		filter: contrast(1.2) brightness(1.1);
	}

	@media (max-width: 767px) {
		.punk-text {
			text-shadow:
				2px 2px 0 #00ff80,
				-2px -2px 0 #0080ff,
				4px 4px 0 rgba(255, 255, 255, 0.2),
				0 0 20px #ff0080;
		}
	}

	.peace-text {
		color: #00ff80;
		text-shadow:
			0 0 40px rgba(0, 255, 128, 0.8),
			0 0 80px rgba(0, 255, 128, 0.4),
			0 0 120px rgba(0, 255, 128, 0.2);
		filter: drop-shadow(0 0 20px rgba(0, 255, 128, 0.5));
	}

	@media (max-width: 767px) {
		.peace-text {
			text-shadow:
				0 0 25px rgba(0, 255, 128, 0.8),
				0 0 50px rgba(0, 255, 128, 0.4),
				0 0 75px rgba(0, 255, 128, 0.2);
			filter: drop-shadow(0 0 15px rgba(0, 255, 128, 0.5));
		}
	}

	.punk-peace-text {
		color: #ff0080;
		text-shadow:
			0 0 40px rgba(255, 0, 128, 0.8),
			0 0 80px rgba(0, 255, 128, 0.6),
			0 0 120px rgba(255, 0, 128, 0.4);
		filter: drop-shadow(0 0 20px rgba(255, 0, 128, 0.5));
	}

	@media (max-width: 767px) {
		.punk-peace-text {
			text-shadow:
				0 0 25px rgba(255, 0, 128, 0.8),
				0 0 50px rgba(0, 255, 128, 0.6),
				0 0 75px rgba(255, 0, 128, 0.4);
			filter: drop-shadow(0 0 15px rgba(255, 0, 128, 0.5));
		}
	}

	.peace-flower {
		position: absolute;
		pointer-events: none;
		z-index: 1;
		will-change: transform;
	}

	.punk-lightning {
		position: absolute;
		pointer-events: none;
		z-index: 1;
		will-change: transform;
	}

	.background-effect {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
		transition: all 0.5s ease;
		border-radius: 16px;
	}

	@media (max-width: 767px) {
		.background-effect {
			border-radius: 12px;
		}
	}

	.subtitle {
		margin-top: 1.5rem;
		font-size: 0.9rem;
		opacity: 0.7;
		transition: opacity 0.3s ease;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		letter-spacing: 0.02em;
		max-width: 400px;
		line-height: 1.4;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 767px) {
		.subtitle {
			margin-top: 1rem;
			font-size: 0.8rem;
			max-width: 300px;
		}
	}

	.instructions {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.7rem;
		opacity: 0.5;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		line-height: 1.4;
	}

	@media (max-width: 767px) {
		.instructions {
			bottom: 0.5rem;
			font-size: 0.6rem;
		}
	}

	.punk-peace-emoji-trigger {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 2rem auto 0 auto;
		font-size: 3rem;
		cursor: pointer;
		user-select: none;
		transition: transform 0.15s;
	}
	.punk-peace-emoji-trigger:focus,
	.punk-peace-emoji-trigger:hover {
		transform: scale(1.12) rotate(-8deg);
		filter: brightness(1.2);
	}

	@media (max-width: 767px) {
		.punk-peace-emoji-trigger {
			margin: 1.5rem auto 0 auto;
			font-size: 2rem;
		}
	}

	.punk-peace-emoji-text {
		font-size: 1.1rem;
		font-family: 'Permanent Marker', cursive;
		color: #fff;
		margin-top: 0.3rem;
		letter-spacing: 0.03em;
		text-shadow:
			0 2px 8px #000,
			0 0 8px #00ff80;
		text-align: center;
		text-transform: lowercase;
		opacity: 0.85;
	}

	@media (max-width: 767px) {
		.punk-peace-emoji-text {
			font-size: 0.9rem;
		}
	}

	.punk-peace-combo {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 4rem;
		font-weight: 900;
		font-family: 'Permanent Marker', cursive;
		text-transform: uppercase;
		line-height: 1;
		cursor: pointer;
		outline: none;
		user-select: none;
	}

	@media (max-width: 767px) {
		.punk-peace-combo {
			font-size: 2.5rem;
		}
	}

	.punk-text-inline {
		color: #ff0080;
		text-shadow:
			3px 3px 0 #00ff80,
			-3px -3px 0 #0080ff,
			6px 6px 0 rgba(255, 255, 255, 0.2),
			0 0 30px #ff0080;
		filter: contrast(1.2) brightness(1.1);
		margin-right: 0.2em;
	}

	@media (max-width: 767px) {
		.punk-text-inline {
			text-shadow:
				2px 2px 0 #00ff80,
				-2px -2px 0 #0080ff,
				4px 4px 0 rgba(255, 255, 255, 0.2),
				0 0 20px #ff0080;
		}
	}

	.peace-text-inline {
		color: #00ff80;
		text-shadow:
			0 0 40px rgba(0, 255, 128, 0.8),
			0 0 80px rgba(0, 255, 128, 0.4),
			0 0 120px rgba(0, 255, 128, 0.2);
		filter: drop-shadow(0 0 20px rgba(0, 255, 128, 0.5));
	}

	@media (max-width: 767px) {
		.peace-text-inline {
			text-shadow:
				0 0 25px rgba(0, 255, 128, 0.8),
				0 0 50px rgba(0, 255, 128, 0.4),
				0 0 75px rgba(0, 255, 128, 0.2);
			filter: drop-shadow(0 0 15px rgba(0, 255, 128, 0.5));
		}
	}

	.click-me-text {
		position: absolute;
		top: -2rem;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Permanent Marker', cursive;
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.8);
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
		z-index: 3;
		pointer-events: none;
		animation: clickMeFloat 3s ease-in-out infinite;
	}

	@keyframes clickMeFloat {
		0%, 100% { transform: translateX(-50%) translateY(0px); }
		50% { transform: translateX(-50%) translateY(-5px); }
	}

	@media (max-width: 767px) {
		.click-me-text {
			font-size: 1rem;
			top: -1.5rem;
		}
	}
</style>
