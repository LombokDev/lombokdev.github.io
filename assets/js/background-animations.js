// Background Animation Controllers for Jekyll Portfolio

class BackgroundController {
    constructor() {
        this.activeAnimation = null;
        this.init();
    }
    
    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        // Initialize default animation
        this.initParticleSystem();
    }
    
    // Advanced Particle System
    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };
        let animationId;
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        
        function initParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.3 + 0.1,
                    color: `hsl(${220 + Math.random() * 40}, 70%, 60%)`
                });
            }
        }
        
        function updateParticles() {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.x -= dx * force * 0.005;
                    particle.y -= dy * force * 0.005;
                }
                
                // Boundary wrapping
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            });
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('hsl', 'hsla');
                ctx.fill();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        const opacity = (120 - distance) / 120 * 0.1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
        }
        
        function animate() {
            updateParticles();
            drawParticles();
            animationId = requestAnimationFrame(animate);
        }
        
        // Event listeners
        window.addEventListener('resize', resize);
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Initialize
        resize();
        animate();
        
        // Cleanup function
        this.cleanup = () => {
            if (animationId) cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }
    
    // Three.js Geometric Background (Advanced)
    initThreeJSBackground() {
        // This would require including Three.js
        // Implementation for 3D geometric background
        console.log('Three.js background would be initialized here');
    }
    
    // Switch animation type
    switchAnimation(type) {
        if (this.cleanup) this.cleanup();
        
        // Hide all background elements
        document.querySelectorAll('.animated-gradient-bg, .floating-dots, .geometric-bg, .mesh-gradient').forEach(el => {
            el.style.display = 'none';
        });
        
        switch (type) {
            case 'gradient':
                document.querySelector('.animated-gradient-bg')?.style.setProperty('display', 'block');
                break;
            case 'particles':
                this.initParticleSystem();
                break;
            case 'dots':
                document.querySelector('.floating-dots')?.style.setProperty('display', 'block');
                break;
            case 'geometric':
                document.querySelector('.geometric-bg')?.style.setProperty('display', 'block');
                break;
            case 'mesh':
                document.querySelector('.mesh-gradient')?.style.setProperty('display', 'block');
                break;
        }
    }
}

// Initialize background controller
let backgroundController;

document.addEventListener('DOMContentLoaded', () => {
    backgroundController = new BackgroundController();
});

// Export for potential external control
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundController;
}

// Performance monitoring
function monitorPerformance() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // If FPS drops below 30, switch to lighter animation
            if (fps < 30 && backgroundController) {
                console.log('Performance: Switching to lighter animation');
                backgroundController.switchAnimation('gradient');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Start performance monitoring
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    monitorPerformance();
}