class Firework {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 3; // 稍微加快速度
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.velocity = {
            x: Math.cos(this.angle) * this.speed,
            y: Math.sin(this.angle) * this.speed
        };
        this.particles = [];
        this.alive = true;
        // 使用更柔和的顏色範圍
        this.hue = Math.random() * 60 + 15; // 15-75度，偏向暖色調
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
        const particleCount = 40; // 稍微減少粒子數量，但每個粒子更大
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
                this.x,
                this.y,
                this.hue + (Math.random() - 0.5) * 30 // 在基礎色調附近變化
            ));
        }
    }

    draw(ctx) {
        if (this.alive) {
            // 煙火尾跡效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 70%, 60%)`;
            ctx.fill();
            
            // 添加光暈效果
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, 0.3)`;
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
        this.decay = 0.008; // 降低衰減速度，讓粒子存在更久
        this.gravity = 0.05; // 降低重力，讓粒子飄得更久
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.size = Math.random() * 8 + 4; // 增大粒子尺寸
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // 插畫風格的粒子 - 使用多邊形而不是圓形
        const sides = Math.floor(Math.random() * 3) + 3; // 3-5邊形
        ctx.beginPath();
        
        if (sides === 3) {
            // 三角形
            ctx.moveTo(0, -this.size);
            ctx.lineTo(-this.size * 0.866, this.size * 0.5);
            ctx.lineTo(this.size * 0.866, this.size * 0.5);
        } else if (sides === 4) {
            // 菱形
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size, 0);
        } else {
            // 五角星
            for (let i = 0; i < sides; i++) {
                const angle = (i * Math.PI * 2) / sides;
                const radius = i % 2 === 0 ? this.size : this.size * 0.5;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        }
        
        ctx.closePath();
        
        // 使用更柔和的顏色
        const saturation = 60 + Math.random() * 30; // 60-90% 飽和度
        const lightness = 60 + Math.random() * 20; // 60-80% 亮度
        ctx.fillStyle = `hsl(${this.hue}, ${saturation}%, ${lightness}%)`;
        ctx.fill();
        
        // 添加邊框效果
        ctx.strokeStyle = `hsl(${this.hue}, ${saturation}%, ${lightness - 20}%)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        
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
    // 使用更柔和的背景清除效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新和繪製煙火
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw(ctx);
        
        // 移除已完成的煙火（當粒子完全消失時）
        if (!firework.alive && firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    // 除錯用：每 60 幀顯示一次煙火數量
    if (Math.random() < 0.016) { // 約每秒一次
        console.log('動畫循環中，煙火數量:', fireworks.length);
    }

    requestAnimationFrame(animate);
}

// 點擊事件處理
function handleClick(e) {
    console.log('點擊事件觸發！'); // 除錯用
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 從底部隨機位置發射煙火
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    
    const newFirework = new Firework(startX, startY, x, y);
    fireworks.push(newFirework);
    console.log('新增煙火，目前煙火數量:', fireworks.length); // 除錯用
}

// 在 canvas 和 body 上都添加點擊事件
canvas.addEventListener('click', handleClick);
document.body.addEventListener('click', handleClick);

// 開始動畫
animate(); 