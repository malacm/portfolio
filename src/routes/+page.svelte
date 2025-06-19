<script>
  import { onMount } from 'svelte';
  
  let activeWindow = null;
  let isDragging = false;
  let isResizing = false;
  let dragOffset = { x: 0, y: 0 };
  let resizeHandle = null;
  let initialSize = { width: 0, height: 0 };
  let initialPosition = { x: 0, y: 0 };
  
  // Clock functionality
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const clockElement = document.getElementById('clock');
    if (clockElement) {
      clockElement.textContent = `${displayHours}:${minutes} ${ampm}`;
    }
  }
  
  function openWindow(windowName) {
    const window = document.getElementById(windowName + 'Window');
    if (window) {
      window.style.display = 'block';
      setActiveWindow(window);
    }
  }
  
  function closeWindow(windowName) {
    const window = document.getElementById(windowName + 'Window');
    if (window) {
      window.style.display = 'none';
    }
  }
  
  function setActiveWindow(window) {
    if (activeWindow) {
      activeWindow.classList.remove('active');
    }
    activeWindow = window;
    window.classList.add('active');
    
    // Bring to front
    const windows = document.querySelectorAll('.window');
    let maxZ = 100;
    windows.forEach(w => {
      const z = parseInt(w.style.zIndex) || 0;
      if (z > maxZ) maxZ = z;
    });
    window.style.zIndex = maxZ + 1;
  }
  
  function selectIcon(icon) {
    // Deselect all icons
    document.querySelectorAll('.desktopIcon').forEach(i => {
      i.classList.remove('selected');
    });
    // Select clicked icon
    icon.classList.add('selected');
  }
  
  function openBrowser(url, title) {
    const browserWindow = document.getElementById('browserWindow');
    const browserFrame = document.getElementById('browserFrame');
    const urlBar = document.getElementById('urlBar');
    const browserTitle = document.getElementById('browserTitle');
    
    browserWindow.style.display = 'block';
    setActiveWindow(browserWindow);
    
    browserFrame.src = url;
    urlBar.value = url;
    browserTitle.textContent = title + ' - Netscape Navigator';
  }
  
  onMount(() => {
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    
    // Window dragging and resizing
    const handleMouseDown = (e) => {
      const titleBar = e.target.closest('.windowTitleBar');
      let resizeHandleElement = e.target.closest('.resizeHandle');
      
      if (resizeHandleElement && !e.target.classList.contains('windowControl')) {
        // Start resizing
        const window = resizeHandleElement.parentElement;
        setActiveWindow(window);
        isResizing = true;
        resizeHandle = resizeHandleElement;
        
        initialSize.width = window.offsetWidth;
        initialSize.height = window.offsetHeight;
        initialPosition.x = e.clientX;
        initialPosition.y = e.clientY;
        
        e.preventDefault();
      } else if (titleBar && !e.target.classList.contains('windowControl')) {
        // Start dragging
        const window = titleBar.parentElement;
        setActiveWindow(window);
        isDragging = true;
        dragOffset.x = e.clientX - window.offsetLeft;
        dragOffset.y = e.clientY - window.offsetTop;
        e.preventDefault();
      }
      
      // Window focus
      const window = e.target.closest('.window');
      if (window) {
        setActiveWindow(window);
      }
    };
    
    const handleMouseMove = (e) => {
      if (isResizing && activeWindow && resizeHandle) {
        const deltaX = e.clientX - initialPosition.x;
        const deltaY = e.clientY - initialPosition.y;
        
        const newWidth = Math.max(300, initialSize.width + deltaX);
        const newHeight = Math.max(200, initialSize.height + deltaY);
        
        activeWindow.style.width = newWidth + 'px';
        activeWindow.style.height = newHeight + 'px';
      } else if (isDragging && activeWindow) {
        activeWindow.style.left = (e.clientX - dragOffset.x) + 'px';
        activeWindow.style.top = (e.clientY - dragOffset.y) + 'px';
      }
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      isResizing = false;
      resizeHandle = null;
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Desktop icon click handling
    document.querySelectorAll('.desktopIcon').forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.stopPropagation();
        selectIcon(this);
      });
    });
    
    // Desktop click to deselect
    const desktop = document.getElementById('desktop');
    if (desktop) {
      desktop.addEventListener('click', function() {
        document.querySelectorAll('.desktopIcon').forEach(i => {
          i.classList.remove('selected');
        });
      });
    }
    
    return () => {
      clearInterval(clockInterval);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<svelte:head>
  <title>Marco Malacara - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</svelte:head>

<style>
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: default;
    user-select: none;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  :global(body) {
    font-family: 'Chicago', 'Geneva', 'Helvetica', sans-serif;
    font-size: 12px;
    overflow: hidden;
    background: #5B5B5B;
    position: relative;
    height: 100vh;
  }
  
  /* Desktop Background Pattern */
  #desktop {
    width: 100%;
    height: 100vh;
    background-color: #5B5B5B;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255,255,255,.03) 10px,
        rgba(255,255,255,.03) 20px
      );
    position: relative;
    animation: bg-move 12s linear infinite;
    background-size: 40px 40px;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }
  
  @keyframes bg-move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 40px;
    }
  }
  
  /* Menu Bar */
  #menuBar {
    background: linear-gradient(to bottom, #FFFFFF 0%, #E0E0E0 50%, #D0D0D0 100%);
    height: 22px;
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-weight: bold;
    font-size: 11px;
    position: relative;
    z-index: 10000;
  }
  
  .menuItem {
    padding: 2px 12px;
    margin: 0 2px;
    cursor: default;
  }
  
  .menuItem:hover {
    background: #000;
    color: #FFF;
  }
  
  .appleLogo {
    font-size: 16px;
    margin-right: 10px;
  }
  
  #clock {
    margin-left: auto;
    font-weight: normal;
    padding: 2px 8px;
  }
  
  /* Desktop Icons */
  .desktopIcon {
    position: absolute;
    width: 80px;
    text-align: center;
    cursor: default;
    padding: 5px;
  }
  
  .desktopIcon:hover .iconImage {
    filter: brightness(1.2);
  }
  
  .desktopIcon.selected {
    background: rgba(0, 0, 255, 0.3);
    color: white;
  }
  
  .iconImage {
    width: 48px;
    height: 48px;
    margin: 0 auto 4px;
    background: #FFF;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    box-shadow: 1px 1px 0 #000;
  }
  
  .iconLabel {
    font-size: 11px;
    background: rgba(255,255,255,0.8);
    padding: 2px 4px;
    border-radius: 2px;
    word-break: break-word;
  }
  
  /* Windows */
  .window {
    position: absolute;
    background: #C0C0C0;
    border: 1px solid #000;
    box-shadow: 2px 2px 0 #000;
    min-width: 300px;
    min-height: 200px;
    display: none;
    resize: none;
  }
  
  .window.active {
    z-index: 1000;
  }
  
  .windowTitleBar {
    background: linear-gradient(to bottom, #FFFFFF 0%, #C0C0C0 100%);
    height: 20px;
    border-bottom: 1px solid #000;
    display: flex;
    align-items: center;
    padding: 0 4px;
    cursor: move;
  }
  
  .window:not(.active) .windowTitleBar {
    background: #C0C0C0;
  }
  
  .windowControls {
    display: flex;
    gap: 6px;
    margin-right: 8px;
  }
  
  .windowControl {
    width: 12px;
    height: 12px;
    border: 1px solid #000;
    background: #FFF;
    cursor: pointer;
  }
  
  .closeButton {
    background: #FF5F57;
    position: relative;
  }
  
  .closeButton::before {
    content: '×';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10px;
    font-weight: bold;
    color: #000;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .closeButton:hover::before {
    opacity: 1;
  }
  
  .minimizeButton {
    background: #FFBD2E;
  }
  
  .maximizeButton {
    background: #28CA42;
  }
  
  .windowTitle {
    font-size: 11px;
    font-weight: bold;
    text-align: center;
    flex: 1;
  }
  
  .windowContent {
    padding: 10px;
    height: calc(100% - 20px);
    overflow-y: auto;
    font-size: 11px;
    line-height: 1.4;
  }
  
  /* Resize Handle */
  .resizeHandle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: nw-resize;
    background: 
      linear-gradient(45deg, transparent 0%, transparent 40%, #000 40%, #000 60%, transparent 60%),
      linear-gradient(-45deg, transparent 0%, transparent 40%, #000 40%, #000 60%, transparent 60%);
    background-size: 8px 8px;
    background-position: 4px 4px;
    background-repeat: no-repeat;
  }
  
  .resizeHandle:hover {
    background: 
      linear-gradient(45deg, transparent 0%, transparent 40%, #FFF 40%, #FFF 60%, transparent 60%),
      linear-gradient(-45deg, transparent 0%, transparent 40%, #FFF 40%, #FFF 60%, transparent 60%);
    background-size: 8px 8px;
    background-position: 4px 4px;
    background-repeat: no-repeat;
  }
  
  /* Scrollbar styling */
  .windowContent::-webkit-scrollbar {
    width: 16px;
  }
  
  .windowContent::-webkit-scrollbar-track {
    background: #C0C0C0;
    border: 1px solid #000;
  }
  
  .windowContent::-webkit-scrollbar-thumb {
    background: #808080;
    border: 1px solid #000;
  }
  
  /* About Window Styling */
  .profileHeader {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dotted #000;
  }
  
  .profilePic {
    width: 80px;
    height: 80px;
    border: 2px solid #000;
    background: #FFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
  
  h1 {
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  h2 {
    font-size: 14px;
    margin: 15px 0 10px 0;
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
  }
  
  h3 {
    font-size: 12px;
    margin: 10px 0 5px 0;
  }
  
  /* Browser Window */
  .browserBar {
    background: #E0E0E0;
    border-bottom: 1px solid #000;
    padding: 4px;
    display: flex;
    gap: 4px;
    align-items: center;
  }
  
  .browserButton {
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    background: #C0C0C0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }
  
  .urlBar {
    flex: 1;
    height: 20px;
    border: 1px solid #000;
    background: #FFF;
    padding: 0 5px;
    font-size: 11px;
  }
  
  .browserFrame {
    width: 100%;
    height: calc(100% - 28px);
    border: none;
    background: #FFF;
  }
  
  /* Projects Grid */
  .projectsGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 10px;
  }
  
  .projectCard {
    background: #FFF;
    border: 1px solid #000;
    padding: 10px;
    cursor: pointer;
  }
  
  .projectCard:hover {
    background: #E0E0E0;
  }
  
  .projectCard h4 {
    font-size: 12px;
    margin-bottom: 5px;
  }
  
  .projectCard p {
    font-size: 10px;
    color: #666;
  }
  
  /* Experience Timeline */
  .experienceItem {
    margin-bottom: 20px;
    padding-left: 20px;
    border-left: 2px solid #000;
    position: relative;
  }
  
  .experienceItem::before {
    content: '•';
    position: absolute;
    left: -7px;
    top: 0;
    font-size: 20px;
    background: #C0C0C0;
  }
  
  .experienceDates {
    font-size: 10px;
    color: #666;
    margin-bottom: 5px;
  }
  
  /* Skills tags */
  .skillsContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 10px;
  }
  
  .skillTag {
    background: #E0E0E0;
    border: 1px solid #000;
    padding: 2px 8px;
    font-size: 10px;
  }
  
  /* Trash and special windows */
  #trashWindow .windowContent {
    text-align: center;
    padding-top: 50px;
    color: #666;
  }
  
  /* Buttons */
  button {
    padding: 8px 20px;
    margin-top: 20px;
    background: #E0E0E0;
    border: 1px solid #000;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
  }
  
  button:hover {
    background: #D0D0D0;
  }
  
  .linkButton {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: #0066CC;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .linkButton:hover {
    background: none;
    text-decoration: none;
  }
</style>


<!-- Desktop -->
<div id="desktop">
  <!-- Menu Bar -->
  <div id="menuBar">
    <span class="appleLogo">🍎</span>
    <span class="menuItem">File</span>
    <span class="menuItem">Edit</span>
    <span class="menuItem">View</span>
    <span class="menuItem">Special</span>
    <span class="menuItem">Help</span>
    <span id="clock"></span>
  </div>

  <!-- Desktop Icons -->
  <div class="desktopIcon" style="top: 50px; left: 20px;" on:dblclick={() => openWindow('about')} role="button" tabindex="0">
    <div class="iconImage">👤</div>
    <div class="iconLabel">About Me</div>
  </div>
  
  <div class="desktopIcon" style="top: 50px; left: 120px;" on:dblclick={() => openWindow('experience')} role="button" tabindex="0">
    <div class="iconImage">💼</div>
    <div class="iconLabel">Experience</div>
  </div>
  
  <div class="desktopIcon" style="top: 50px; left: 220px;" on:dblclick={() => openWindow('projects')} role="button" tabindex="0">
    <div class="iconImage">📁</div>
    <div class="iconLabel">Projects</div>
  </div>
  
  <div class="desktopIcon" style="top: 150px; left: 20px;" on:dblclick={() => openWindow('skills')} role="button" tabindex="0">
    <div class="iconImage">⚡</div>
    <div class="iconLabel">Skills</div>
  </div>
  
  <div class="desktopIcon" style="top: 150px; left: 120px;" on:dblclick={() => openWindow('contact')} role="button" tabindex="0">
    <div class="iconImage">📧</div>
    <div class="iconLabel">Contact</div>
  </div>
  
  <div class="desktopIcon" style="top: 250px; left: 20px;" on:dblclick={() => openWindow('resume')} role="button" tabindex="0">
    <div class="iconImage">📄</div>
    <div class="iconLabel">Resume.pdf</div>
  </div>
  
  <div class="desktopIcon" style="bottom: 20px; right: 20px;" on:dblclick={() => openWindow('trash')} role="button" tabindex="0">
    <div class="iconImage">🗑️</div>
    <div class="iconLabel">Trash</div>
  </div>
  
  <!-- Windows -->
  <!-- About Me Window -->
  <div id="aboutWindow" class="window" style="top: 100px; left: 100px; width: 500px; height: 400px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('about')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">About Me</div>
    </div>
    <div class="windowContent">
      <div class="profileHeader">
        <div class="profilePic">👨‍💻</div>
        <div>
          <h1>Marco Malacara</h1>
          <p><strong>Front End Engineer & AI Technologist</strong></p>
          <p>📍 Los Angeles, California</p>
          <p>🔗 354+ connections</p>
        </div>
      </div>
      
      <h2>About</h2>
      <p>Creative technologist with a passion for building innovative digital experiences. Currently working at National Geographic, combining front-end engineering expertise with AI technology to create cutting-edge solutions.</p>
      
      <p>Previously co-founded Celest, reimagining digital entrepreneurship with OpenAI integration. Also founded Happy Thoughts Studio and led engineering efforts at MERGE and Certifyde.</p>
      
      <h2>Current Role</h2>
      <p><strong>National Geographic</strong> - Creative Technologies<br>
      Front End Engineer & AI Technologist<br>
      <em>2024 - Present</em></p>
      
      <p>Building immersive digital experiences that bring National Geographic's storytelling to life through innovative web technologies and AI integration.</p>
      
      <h2>Previous Experience</h2>
      <div style="margin-bottom: 10px;">
        <p><strong>Co-founder & COO</strong>, Celest<br>
        Jan 2024 – 2025</p>
        <p><strong>Partner & Creative Architect</strong>, Certifyde<br>
        Oct 2022 – Present</p>
        <p><strong>Founder</strong>, Happy Thoughts Studio<br>
        Feb 2021 – Present</p>
        <p><strong>Lead Engineer</strong>, MERGE<br>
        Jan 2022 – 2024</p>
        <p><strong>Senior Frontend Developer</strong>, Crescendo Collective<br>
        Jul 2021 – Jan 2022</p>
        <p><strong>Front End Developer</strong>, Crescendo Collective<br>
        Jan 2019 – Jan 2022</p>
      </div>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Experience Window -->
  <div id="experienceWindow" class="window" style="top: 150px; left: 200px; width: 600px; height: 500px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('experience')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Experience</div>
    </div>
    <div class="windowContent">
      <h2>Professional Experience</h2>
      
      <div class="experienceItem">
        <h3>National Geographic</h3>
        <p><strong>Front End Engineer & AI Technologist</strong></p>
        <div class="experienceDates">2024 - Present • Los Angeles, CA</div>
        <p>Leading creative technology initiatives, developing immersive web experiences and integrating AI solutions for enhanced storytelling and user engagement.</p>
      </div>
      
      <div class="experienceItem">
        <h3>Celest</h3>
        <p><strong>Co-founder & COO</strong></p>
        <div class="experienceDates">Jan 2024 - 2024 • Los Angeles, CA (Remote)</div>
        <p>Reimagined digital entrepreneurship into one composable platform infused with the power of OpenAI.</p>
      </div>
      
      <div class="experienceItem">
        <h3>Certifyde</h3>
        <p><strong>Partner & Creative Architect</strong></p>
        <div class="experienceDates">Oct 2022 - 2024 • Remote</div>
        <p>Specialized in bringing cutting-edge educational technology to life through innovative software architecture and engineering.</p>
      </div>
      
      <div class="experienceItem">
        <h3>MERGE</h3>
        <p><strong>Lead Engineer</strong></p>
        <div class="experienceDates">Jan 2022 - 2024 • Los Angeles, CA</div>
        <p>Blended technical expertise with strategic leadership to drive innovative engineering solutions. Managed complex projects from conception to implementation.</p>
        <ul style="margin-top: 5px; margin-left: 20px;">
          <li>Technical Oversight: Managing complex engineering projects</li>
          <li>Team Leadership: Cultivating a culture of innovation</li>
          <li>Cross-Functional Collaboration: Aligning engineering goals with company objectives</li>
        </ul>
      </div>
      
      <div class="experienceItem">
        <h3>Happy Thoughts Studio</h3>
        <p><strong>Founder</strong></p>
        <div class="experienceDates">Feb 2021 - Present • Los Angeles, CA</div>
        <p>Founded creative technology studio focused on innovative digital solutions and experiences.</p>
      </div>
      
      <div class="experienceItem">
        <h3>Crescendo Collective</h3>
        <p><strong>Senior Frontend Developer</strong></p>
        <div class="experienceDates">Jul 2021 - Jan 2022 • Los Angeles, CA</div>
        <p>Led frontend development initiatives for various client projects.</p>
      </div>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Projects Window -->
  <div id="projectsWindow" class="window" style="top: 120px; left: 250px; width: 650px; height: 450px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('projects')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Projects</div>
    </div>
    <div class="windowContent">
      <h2>Live Projects</h2>
      <p>Double-click any project to open in browser</p>
      
      <div class="projectsGrid">
        <div class="projectCard" on:dblclick={() => openBrowser('https://www.expeditions.com/', 'National Geographic')} role="button" tabindex="0">
          <h4>🌍 National Geographic Expeditions</h4>
          <p>Rebrand and rebuild of the National Geographic Expeditions website with modern web technologies.</p>
        </div>
        
        <div class="projectCard" on:dblclick={() => openBrowser('https://certifyde.com', 'Certifyde')} role="button" tabindex="0">
          <h4>🎓 Certifyde EdTech</h4>
          <p>Partner and Architect of Educational technology platform with innovative learning solutions</p>
        </div>

        <div class="projectCard" on:dblclick={() => openBrowser('https://usesilo.com/', 'Silo')} role="button" tabindex="0">
          <h4>🌾 Silo</h4>
          <p>Frontend development and Motion Design for Silo</p>
        </div>
        
        <div class="projectCard" on:dblclick={() => openBrowser('https://mergeworld.com/', 'MERGE Projects')} role="button" tabindex="0">
          <h4>🚀 MERGE Engineering</h4>
          <p>Enterprise-level engineering solutions and technical leadership</p>
        </div>
        
        <div class="projectCard" on:dblclick={() => openBrowser('https://www.invesco.com/qqq-etf/en/home.html', 'Invesco QQQ ETF')} role="button" tabindex="0">
          <h4>🎵 Invesco QQQ ETF</h4>
          <p>Frontend development for Invesco QQQ ETF</p>
        </div>
      </div>

      <h2 style="margin-top: 32px;">Past Projects</h2>
      <p>These projects are no longer live, but represent past work.</p>
      <div class="projectsGrid">
        <div class="projectCard" on:dblclick={() => openBrowser('https://celest.com', 'Celest Platform')} role="button" tabindex="0">
          <h4>✨ Celest Platform</h4>
          <p>AI-powered entrepreneurship platform built with OpenAI integration</p>
        </div>

        <div class="projectCard" role="button" tabindex="0">
          <h4>💭 Happy Thoughts Studio</h4>
          <p>Creative technology studio delivering innovative digital experiences</p>
        </div>

        <div class="projectCard" role="button" tabindex="0">
          <h4>📱 T-Mobile</h4>
          <p>Motion Design amd web ads for T-Mobile 5G home internet</p>
        </div>
      </div>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Skills Window -->
  <div id="skillsWindow" class="window" style="top: 180px; left: 300px; width: 500px; height: 400px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('skills')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Skills & Expertise</div>
    </div>
    <div class="windowContent">
      <h2>Technical Skills</h2>
      
      <h3>Frontend Development</h3>
      <div class="skillsContainer">
        <span class="skillTag">React.js</span>
        <span class="skillTag">Next.js</span>
        <span class="skillTag">JavaScript</span>
        <span class="skillTag">TypeScript</span>
        <span class="skillTag">Node.js</span>
        <span class="skillTag">HTML5</span>
        <span class="skillTag">CSS3</span>
        <span class="skillTag">Web Components</span>
      </div>
      
      <h3>AI & Machine Learning</h3>
      <div class="skillsContainer">
        <span class="skillTag">OpenAI Integration</span>
        <span class="skillTag">AI/ML Technologies</span>
        <span class="skillTag">LLM Implementation</span>
        <span class="skillTag">Prompt Engineering</span>
      </div>
      
      <h3>Tools & Technologies</h3>
      <div class="skillsContainer">
        <span class="skillTag">Git</span>
        <span class="skillTag">Docker</span>
        <span class="skillTag">AWS</span>
        <span class="skillTag">Google Cloud</span>
        <span class="skillTag">CI/CD</span>
        <span class="skillTag">Agile/Scrum</span>
      </div>
      
      <h3>Digital Marketing & Analytics</h3>
      <div class="skillsContainer">
        <span class="skillTag">SEO</span>
        <span class="skillTag">SEM</span>
        <span class="skillTag">Google Analytics</span>
        <span class="skillTag">Google AdWords</span>
        <span class="skillTag">Web Analytics</span>
      </div>
      
      <h3>Leadership & Management</h3>
      <div class="skillsContainer">
        <span class="skillTag">Technical Leadership</span>
        <span class="skillTag">Project Management</span>
        <span class="skillTag">Team Building</span>
        <span class="skillTag">Strategic Planning</span>
        <span class="skillTag">Cross-functional Collaboration</span>
      </div>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Contact Window -->
  <div id="contactWindow" class="window" style="top: 200px; left: 350px; width: 400px; height: 300px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('contact')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Contact</div>
    </div>
    <div class="windowContent">
      <h2>Get In Touch</h2>
      
      <p style="margin: 20px 0;"><strong>Marco Malacara</strong><br>
      Front End Engineer & AI Technologist</p>
      
      <p>📍 Los Angeles, California, United States</p>
      <p>💼 Currently at National Geographic</p>
      
      <div style="margin-top: 30px;">
        <h3>Connect With Me</h3>
        <p style="margin-top: 10px;">
          <button class="linkButton" on:click={() => openBrowser('https://www.linkedin.com/in/marco-malacara-b89612152/', 'LinkedIn')}>
            LinkedIn Profile →
          </button>
        </p>
        <p style="margin-top: 10px;">
          <button class="linkButton" on:click={() => openBrowser('mailto:contact@marcomalacara.com', 'Email')}>
            Send Email →
          </button>
        </p>
      </div>
      
      <p style="margin-top: 30px; font-style: italic; color: #666;">
        "Always excited to collaborate on innovative projects that push the boundaries of web technology and AI."
      </p>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Resume Window -->
  <div id="resumeWindow" class="window" style="top: 140px; left: 180px; width: 500px; height: 400px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('resume')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Resume.pdf</div>
    </div>
    <div class="windowContent" style="text-align: center; padding-top: 100px;">
      <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
      <h3>Marco Malacara - Resume</h3>
      <p style="margin: 20px 0;">Front End Engineer & AI Technologist</p>
      <button on:click={() => alert('Download functionality would be implemented here!')}>
        Download PDF
      </button>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Trash Window -->
  <div id="trashWindow" class="window" style="top: 180px; left: 400px; width: 300px; height: 200px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('trash')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle">Trash</div>
    </div>
    <div class="windowContent">
      <p>The Trash is Empty</p>
      <p style="margin-top: 20px; font-size: 10px;">0 items, 0 bytes</p>
    </div>
    <div class="resizeHandle"></div>
  </div>
  
  <!-- Browser Window -->
  <div id="browserWindow" class="window" style="top: 50px; left: 50px; width: 800px; height: 600px;">
    <div class="windowTitleBar">
      <div class="windowControls">
        <div class="windowControl closeButton" on:click={() => closeWindow('browser')} role="button" tabindex="0"></div>
        <div class="windowControl minimizeButton" role="button" tabindex="0"></div>
        <div class="windowControl maximizeButton" role="button" tabindex="0"></div>
      </div>
      <div class="windowTitle" id="browserTitle">Netscape Navigator</div>
    </div>
    <div class="browserBar">
      <button class="browserButton" on:click={() => alert('Back')}>←</button>
      <button class="browserButton" on:click={() => alert('Forward')}>→</button>
      <button class="browserButton" on:click={() => {
        const frame = document.getElementById('browserFrame');
        if (frame) frame.src = frame.src;
      }}>⟲</button>
      <input type="text" class="urlBar" id="urlBar" readonly>
    </div>
    <iframe id="browserFrame" class="browserFrame" title="Browser Content"></iframe>
    <div class="resizeHandle"></div>
  </div>
</div>
