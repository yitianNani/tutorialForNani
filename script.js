class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 2;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.particles = [];
        this.alive = true;
        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 檢查是否到達目標
        const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
        if (distance < 5) {
            this.explode();
            this.alive = false;
        }
    }

    explode() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                this.x,
                this.y,
                this.hue
            ));
        }
    }

    draw(ctx) {
        if (this.alive) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
        }

        // 繪製粒子
        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            if (particle.alpha <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.alpha = 1;
        this.decay = 0.015;
        this.gravity = 0.1;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.fill();
        ctx.restore();
    }
}

// 初始化畫布
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

// 設定畫布尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 煙火陣列
let fireworks = [];

// 動畫循環
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和繪製煙火
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        
        // 移除已完成的煙火
        if (!firework.alive && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// 點擊事件處理
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 從底部隨機位置發射煙火
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    
    fireworks.push(new Firework(startX, startY, x, y));
});

// 開始動畫
animate();

// 初始煙火效果
setTimeout(() => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    fireworks.push(new Firework(
        Math.random() * canvas.width,
        canvas.height,
        centerX + (Math.random() - 0.5) * 200,
        centerY + (Math.random() - 0.5) * 200
    ));
}, 1000); 