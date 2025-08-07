document.addEventListener('DOMContentLoaded', function() {
    const greeting = document.getElementById('greeting');
    const container = document.querySelector('.container');
    
    // 滑鼠追蹤特效
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // 計算滑鼠位置相對於視窗中心的偏移
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // 計算偏移量（限制移動範圍）
        const offsetX = (mouseX - centerX) * 0.02;
        const offsetY = (mouseY - centerY) * 0.02;
        
        // 應用滑鼠追蹤效果
        greeting.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
    
    // 點擊抖動效果
    greeting.addEventListener('click', function() {
        // 移除之前的抖動類別
        greeting.classList.remove('shake');
        
        // 強制重繪
        void greeting.offsetWidth;
        
        // 添加抖動類別
        greeting.classList.add('shake');
        
        // 抖動結束後移除類別
        setTimeout(() => {
            greeting.classList.remove('shake');
        }, 500);
    });
    
    // 自動抖動效果（每3秒）
    setInterval(() => {
        if (!greeting.classList.contains('shake')) {
            greeting.classList.add('shake');
            setTimeout(() => {
                greeting.classList.remove('shake');
            }, 500);
        }
    }, 3000);
    
    // 滑鼠離開視窗時重置位置
    document.addEventListener('mouseleave', function() {
        greeting.style.transform = 'translate(0px, 0px)';
    });
}); 