// 导航菜单切换
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 关闭移动端菜单当点击链接时
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// 滚动时导航栏样式变化
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 技能条动画
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.setProperty('--skill-level', level + '%');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(bar);
    });
}

// 滚动显示动画（IntersectionObserver，单次触发）
let _revealObserver = null;
function revealOnScroll() {
    if (_revealObserver) return; // 已初始化则直接返回，保证幂等
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
        // 不支持 IO 时直接显示，避免内容永久隐藏
        reveals.forEach(r => r.classList.add('active'));
        return;
    }

    _revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 进出视口都切换状态：向下/向上滚动均会重新触发动效
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(r => _revealObserver.observe(r));
}

// 表单验证和提交
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 简单的表单验证
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else {
                input.style.borderColor = 'var(--success-color)';
            }
        });
        
        if (isValid) {
            // 这里可以添加表单提交逻辑
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<span class="loading"></span> 发送中...';
            submitBtn.disabled = true;
            
            // 模拟发送过程
            setTimeout(() => {
                submitBtn.textContent = '消息已发送！';
                submitBtn.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        }
    });
}

// 打字机效果
function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const speed = 50;
        
        function type() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        // 只在第一次进入视口时触发
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroTitle);
    }
}

// 项目卡片悬停效果
function initProjectHover() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 社交链接动画
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.classList.add('fade-in');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    animateSkills();
    revealOnScroll();
    initProjectHover();
    initSocialLinks();
    
    // 添加滚动事件监听
    window.addEventListener('scroll', revealOnScroll);
    
    // 添加resize事件监听，重新计算动画
    window.addEventListener('resize', revealOnScroll);
    
    // 初始检查一次
    revealOnScroll();
});

// 活跃导航链接高亮
function highlightActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// 初始化活跃导航高亮
highlightActiveNav();

// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 主题切换功能（可选）
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
        transition: var(--transition);
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 使用防抖优化滚动事件
const debouncedReveal = debounce(revealOnScroll, 100);
window.addEventListener('scroll', debouncedReveal);

// 页面性能监控
function monitorPerformance() {
    window.addEventListener('load', () => {
        // 页面加载完成时间
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
        }, 0);
    });
}

// 初始化性能监控
monitorPerformance();

// 错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误:', e.error);
});

// 未处理的Promise rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise rejection:', e.reason);
});

// 导出函数供其他脚本使用（如果需要）
window.PersonalBlog = {
    animateSkills,
    revealOnScroll,
    typeWriterEffect,
    initProjectHover,
    initSocialLinks,
    highlightActiveNav,
    lazyLoadImages,
    initThemeToggle,
    debounce
};

// ===================== 首屏体感光晕背景 =====================
// 深仿 DeepSeek harness：点阵网格 + 体积光晕，随鼠标联动（仅首屏 hero）
(function initHeroBackground() {
    const hero = document.querySelector('.hero');
    const canvas = hero && hero.querySelector('.hero-bg-canvas');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, dpr = 1;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = hero.clientWidth;
        H = hero.clientHeight;
        canvas.width = Math.max(1, Math.round(W * dpr));
        canvas.height = Math.max(1, Math.round(H * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // 光晕团：相对锚点(bx,by)、半径 r、颜色 c、透明度 a、漂移参数(sp, ph)
    const blobs = [
        { bx: 0.25, by: 0.30, r: 360, c: '255,255,255', a: 0.22, sp: 0.00018, ph: 0 },
        { bx: 0.74, by: 0.20, r: 300, c: '103,153,254', a: 0.20, sp: 0.00026, ph: 2 },
        { bx: 0.55, by: 0.80, r: 400, c: '77,107,254', a: 0.16, sp: 0.00014, ph: 4 },
        { bx: 0.12, by: 0.76, r: 280, c: '255,255,255', a: 0.13, sp: 0.00022, ph: 1 }
    ];

    // 鼠标状态（相对 hero 左上角）
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    function setTarget(clientX, clientY) {
        const rect = hero.getBoundingClientRect();
        tmx = clientX - rect.left;
        tmy = clientY - rect.top;
    }
    hero.addEventListener('pointermove', e => setTarget(e.clientX, e.clientY));
    hero.addEventListener('pointerleave', () => { tmx = W / 2; tmy = H / 2; });

    function drawGrid(px, py) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const gap = 26;
        const ox = -px * 18, oy = -py * 18;
        let startX = ox % gap; if (startX > 0) startX -= gap;
        let startY = oy % gap; if (startY > 0) startY -= gap;
        for (let y = startY; y < H; y += gap) {
            for (let x = startX; x < W; x += gap) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    function draw(ts) {
        ctx.clearRect(0, 0, W, H);

        // 鼠标阻尼跟随
        mx += (tmx - mx) * 0.06;
        my += (tmy - my) * 0.06;

        const px = (mx - W / 2) / W;   // 视差系数 -0.5..0.5
        const py = (my - H / 2) / H;

        // 点阵网格（轻微视差）
        drawGrid(px, py);

        // 体积光晕（用 lighter 叠加提亮深色底）
        ctx.globalCompositeOperation = 'lighter';
        for (const b of blobs) {
            const driftX = Math.sin(ts * b.sp + b.ph) * 42;
            const driftY = Math.cos(ts * b.sp * 1.3 + b.ph) * 32;
            let bx = b.bx * W + driftX;
            let by = b.by * H + driftY;

            // 鼠标靠近时轻微推开
            const dx = bx - mx, dy = by - my;
            const d = Math.hypot(dx, dy) || 0.001;
            const push = Math.max(0, 1 - d / 400) * 70;
            bx += (dx / d) * push;
            by += (dy / d) * push;

            const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
            g.addColorStop(0, `rgba(${b.c},${b.a})`);
            g.addColorStop(1, `rgba(${b.c},0)`);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(bx, by, b.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // 鼠标处柔和高光
        const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 220);
        mg.addColorStop(0, 'rgba(120,160,255,0.10)');
        mg.addColorStop(1, 'rgba(120,160,255,0)');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(mx, my, 220, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
    }

    let rafId = null;
    let running = false;

    function loop(ts) {
        draw(ts || 0);
        rafId = requestAnimationFrame(loop);
    }

    function start() {
        if (running) return;
        running = true;
        mx = tmx = W / 2;
        my = tmy = H / 2;
        rafId = requestAnimationFrame(loop);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (reduceMotion) {
        // 无障碍：仅静态渲染一帧（网格 + 光晕，无漂移）
        draw(0);
    } else {
        // 仅在 hero 进入视口时运行，离开则暂停以省 CPU
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.01 });
            io.observe(hero);
        } else {
            start();
        }
    }
})();

