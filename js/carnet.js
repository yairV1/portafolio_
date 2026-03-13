
(function () {

    /* ─── REFERENCIAS ─── */
    const wrap = document.getElementById('card-wrap');
    const hint = document.getElementById('hint');

    /* ─── GENERAR CÓDIGO DE BARRAS ALEATORIO ─── */
    const bc = document.getElementById('bc');
    const widths = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
    for (let i = 0; i < 18; i++) {
        const s = document.createElement('span');
        s.className = widths[Math.floor(Math.random() * widths.length)];
        bc.appendChild(s);
    }

    /* ─── GENERAR PATRÓN QR DECORATIVO ─── */
    const qr = document.getElementById('qr');
    const pat = [
        1, 1, 1, 0, 1, 1, 1,
        1, 0, 1, 0, 1, 0, 1,
        1, 0, 1, 1, 0, 1, 1,
        0, 1, 0, 1, 0, 1, 0,
        1, 1, 0, 0, 1, 0, 1,
        1, 0, 1, 0, 0, 1, 1,
        1, 1, 1, 0, 1, 0, 1
    ];
    pat.forEach(v => {
        const s = document.createElement('span');
        if (!v) s.classList.add('w');
        qr.appendChild(s);
    });

    /* ─── ESTADO DE ROTACIÓN ─── */
    let rotX = 0, rotY = 0;   // rotación actual
    let targetX = 0, targetY = 0;   // rotación objetivo (hover pasivo)
    let isFlipped = false;
    let isDragging = false;
    let startX = 0, startY = 0;   // punto de inicio del arrastre
    let baseX = 0, baseY = 0;   // rotación al iniciar arrastre
    let gyroEnabled = false;

    /* ─── APLICAR TRANSFORM ─── */
    function applyTransform(tx, ty) {
        const flipDeg = isFlipped ? 180 : 0;
        wrap.style.transform =
            `rotateX(${tx}deg) rotateY(${ty + flipDeg}deg)`;
    }

    /* ─── BUCLE DE ANIMACIÓN (suavizado hacia el objetivo) ─── */
    function animLoop() {
        if (!isDragging && !gyroEnabled) {
            rotX += (targetX - rotX) * 0.1;
            rotY += (targetY - rotY) * 0.1;
            applyTransform(rotX, rotY);
        }
        requestAnimationFrame(animLoop);
    }
    animLoop();

    /* ─── HOVER PASIVO CON EL MOUSE ─── */
    document.getElementById('scene').addEventListener('mousemove', e => {
        if (isDragging) return;
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetX = -((e.clientY - cy) / 200) * 18;
        targetY = ((e.clientX - cx) / 200) * 22;
    });

    document.getElementById('scene').addEventListener('mouseleave', () => {
        if (!isDragging) { targetX = 0; targetY = 0; }
    });

    /* ─── ARRASTRE CON MOUSE ─── */
    wrap.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        baseX = rotX; baseY = rotY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        rotX = Math.max(-50, Math.min(50, baseX - dy * 0.45));
        rotY = baseY + dx * 0.45;
        applyTransform(rotX, rotY);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Rebote suave al soltar
            targetX = rotX * 0.15;
            targetY = rotY * 0.15;
        }
    });

    /* ─── ARRASTRE CON TOQUE (CELULAR) ─── */
    wrap.addEventListener('touchstart', e => {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        baseX = rotX; baseY = rotY;
    }, { passive: true });

    document.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        rotX = Math.max(-50, Math.min(50, baseX - dy * 0.45));
        rotY = baseY + dx * 0.45;
        applyTransform(rotX, rotY);
    }, { passive: true });

    document.addEventListener('touchend', () => {
        isDragging = false;
        targetX = rotX * 0.15;
        targetY = rotY * 0.15;
    });

    /* ─── CLICK = VOLTEAR EL CARNÉ ─── */
    wrap.addEventListener('click', () => {
        // Solo voltear si no hubo arrastre significativo
        if (Math.abs(rotX - baseX) < 3 && Math.abs(rotY - baseY) < 3) {
            isFlipped = !isFlipped;
            applyTransform(rotX, rotY);
            hint.textContent = isFlipped
                ? '🖱 Arrastra · Click = ver frente'
                : '🖱 Arrastra · Click = voltear';
        }
    });

    /* ─── GIROSCOPIO (CELULAR) ─── */
    function activarGiroscopio() {
        if (gyroEnabled) return;
        gyroEnabled = true;
        hint.textContent = '📱 Giroscopio activo · Inclina el dispositivo';

        window.addEventListener('deviceorientation', e => {
            if (isDragging) return;
            // beta  = inclinación adelante/atrás (-180 a 180)
            // gamma = inclinación izquierda/derecha (-90 a 90)
            const beta = Math.max(-35, Math.min(35, e.beta || 0));
            const gamma = Math.max(-35, Math.min(35, e.gamma || 0));
            rotX = -beta * 0.6;
            rotY = gamma * 0.8;
            applyTransform(rotX, rotY);
        });
    }

    if (window.DeviceOrientationEvent) {
        // iOS 13+ requiere permiso explícito del usuario
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            document.getElementById('scene').addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(state => { if (state === 'granted') activarGiroscopio(); })
                    .catch(() => { });
            }, { once: true });
        } else {
            // Android y otros navegadores — se activa automáticamente
            window.addEventListener('deviceorientation', e => {
                if (e.alpha !== null) activarGiroscopio();
            }, { once: true });
        }
    }

    /* ─── QUITAR CLASE DE ANIMACIÓN DESPUÉS DE CAÍDA ─── */
    setTimeout(() => wrap.classList.remove('drop-in'), 1200);

})();
