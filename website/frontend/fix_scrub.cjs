const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Replace the old useEffect scroll handler with the robust one
const oldEffect = `  useEffect(() => {
    const handleScroll = () => {
      
      
      // Video Frame-by-Frame Scrubbing Logic
      if (videoSectionRef.current && videoRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        
        // Progress goes from 0 to 1 as the sticky section is scrolled
        let progress = -rect.top / scrollRange;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        if (videoRef.current.duration) {
          // Smoothly update the current time of the video based on scroll progress
          videoRef.current.currentTime = videoRef.current.duration * progress;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`;

const newEffect = `  useEffect(() => {
    const video = videoRef.current;
    
    // Force load the first frame for smooth initial scrubbing
    if (video) {
      video.pause();
      const loadInitialFrame = () => {
        if (!isNaN(video.duration)) {
           video.currentTime = 0.01;
        }
      };
      video.addEventListener('loadedmetadata', loadInitialFrame);
    }
    
    let ticking = false;
    
    const updateVideoTime = () => {
      if (videoSectionRef.current && video && !isNaN(video.duration)) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        
        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        
        // Apply frame update
        video.currentTime = video.duration * progress;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVideoTime);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calc
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (video) video.removeEventListener('loadedmetadata', () => {});
    };
  }, []);`;

if (code.includes('Video Frame-by-Frame Scrubbing Logic')) {
  code = code.replace(oldEffect, newEffect);
  
  // Also change preload="metadata" to preload="auto"
  code = code.replace('preload="metadata"', 'preload="auto"');
  
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Fixed scrub logic');
} else {
  console.log('Could not find logic');
}
