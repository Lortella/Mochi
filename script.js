document.addEventListener('DOMContentLoaded', () => {
    const btnBuka = document.getElementById('btn-buka');
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const typingText = document.getElementById('typing-text');
    const musicToggle = document.getElementById('music-toggle');
    const visualizer = document.getElementById('visualizer');
    const musicControl = document.querySelector('.music-control');
    
    // Elemen Slideshow
    const slideImg = document.getElementById('slide-img');
    const slideCaption = document.getElementById('slide-caption');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // --- PESAN UCAPAN ---
    const message = "Selamat ulang tahun yang ke-20 ya sayang! 🎉 cieeee kepala duaa, Semoga panjang umur, sehat selalu, makin cantik, makin pinter, dan makin sayang sama akuuu. Semogaa dengan bertambahnyaa umurr kamuuu semakinn dewasaa dan juga lebih berani. Semoga tergapai apapun yang kamu inginkan. Maaf ya cuma bisa kasih web sederhana iniii, tapi effort dan cintaku ke kamu ga sederhana kok! I love you Mochiii! 💖";
    // --------------------

    // --- KONFIGURASI LAGU & FOTO ---
    
    // Detik ke berapa lagu masuk ke bagian KLIMAKS/REFF?
    // Contoh: Jika reff mulai di menit 0:58, tulis 58.
    const musicStartTimestamp = 55; 
    const fadeDuration = 5; // Durasi fade in/out (detik)
    let isManualFade = false; // Status fade in awal

    // Data Foto & Caption (Ganti nama file sesuai yang ada di folder assets)
    const photos = [
        { src: 'assets/foto1.jpg', text: 'Cieee lagi akurrr 😋' },
        { src: 'assets/foto2.jpg', text: 'AHAHAHA 😍' },
        { src: 'assets/foto3.jpg', text: 'Dimasakin my istri 💖' },
        { src: 'assets/foto4.jpg', text: 'Hehe sayang minta jajan ☺️' },
        { src: 'assets/foto5.jpg', text: 'Love you selamanyaaaaaa 💖' }
    ];
    
    let currentSlide = 0;
    // -------------------------------

    btnBuka.addEventListener('click', () => {
        // 1. Memutar Musik
        // Note: Musik akan berputar jika file 'musik.mp3' sudah ada di folder assets
        
        // Set waktu mulai lagu ke titik klimaks
        bgMusic.currentTime = musicStartTimestamp;
        bgMusic.volume = 0; // Mulai dari 0 untuk fade-in
        
        bgMusic.play().then(() => {
            updatePlayerUI();

            // Logika Fade In Manual (Awal Klik)
            isManualFade = true;
            let vol = 0;
            const interval = 50; 
            const step = 1 / (fadeDuration * 1000 / interval); 
            
            const fadeTimer = setInterval(() => {
                if (vol < 1) {
                    vol += step;
                    if (vol > 1) vol = 1;
                    bgMusic.volume = vol;
                } else {
                    clearInterval(fadeTimer);
                    isManualFade = false;
                }
            }, interval);
        }).catch(error => {
            console.log("Musik belum bisa diputar atau file belum ada.");
            updatePlayerUI();
        });

        // 2. Efek Transisi (Menghilangkan halaman depan, memunculkan ucapan)
        landingPage.style.display = 'none';
        mainContent.classList.remove('hidden');
        musicControl.classList.remove('hidden');
        
        // Mulai Slideshow
        showSlide(currentSlide);
        
        // 3. Efek Confetti (Ledakan kertas warna-warni)
        triggerConfetti();

        // 4. Efek Mengetik Pesan
        let i = 0;
        const speed = 150; // Kecepatan mengetik (ms) - Semakin besar semakin lambat

        function typeWriter() {
            if (i < message.length) {
                typingText.innerHTML += message.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Mulai mengetik setelah jeda sedikit
        setTimeout(typeWriter, 500);
    });

    // Fungsi untuk membuat efek confetti
    function triggerConfetti() {
        const duration = 3000; // Durasi confetti 3 detik
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Confetti dari kiri dan kanan
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);
    }

    // --- LOGIKA MUSIC PLAYER ---
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        updatePlayerUI();
    });

    function updatePlayerUI() {
        if (bgMusic.paused) {
            musicToggle.innerHTML = ""; // Ikon Play
            visualizer.classList.add('paused');
        } else {
            musicToggle.innerHTML = ""; // Ikon Pause
            visualizer.classList.remove('paused');
        }
    }

    // --- LOGIKA SLIDESHOW ---
    function showSlide(index) {
        if (index >= photos.length) currentSlide = 0;
        if (index < 0) currentSlide = photos.length - 1;
        
        slideImg.src = photos[currentSlide].src;
        slideCaption.textContent = photos[currentSlide].text;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide++;
        showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide--;
        showSlide(currentSlide);
    });

    // Auto slide setiap 3 detik (opsional, biar ga capek klik)
    setInterval(() => {
        if (!landingPage.style.display || landingPage.style.display === 'none') { // Cek jika sudah masuk halaman utama
            currentSlide++;
            showSlide(currentSlide);
        }
    }, 4000);

    // --- LOGIKA FADE IN/OUT (LOOPING) ---
    bgMusic.addEventListener('timeupdate', () => {
        // Jika sedang fade-in manual (saat pertama klik), abaikan logika ini
        if (isManualFade) return;

        const duration = bgMusic.duration;
        const currentTime = bgMusic.currentTime;

        // Pastikan durasi valid (bukan NaN)
        if (duration > 0) {
            // Fade In (saat looping kembali ke awal)
            if (currentTime < fadeDuration) {
                bgMusic.volume = currentTime / fadeDuration;
            }
            // Fade Out (saat lagu mau habis)
            else if (duration - currentTime < fadeDuration) {
                bgMusic.volume = (duration - currentTime) / fadeDuration;
            }
            // Volume Normal
            else {
                bgMusic.volume = 1;
            }
        }
    });

    // --- LOGIKA KUPON HADIAH ---
    const coupons = document.querySelectorAll('.coupon');
    const btnWa = document.getElementById('btn-wa');
    
    coupons.forEach(coupon => {
        coupon.addEventListener('click', function() {
            // Toggle status seleksi (pilih/batal pilih)
            this.classList.toggle('selected');
            
            // Ambil semua teks kupon yang sedang dipilih
            const selectedCoupons = Array.from(document.querySelectorAll('.coupon.selected'))
                                         .map(c => c.textContent.trim());
            
            // Update Link WhatsApp
            const baseMessage = "Halo sayang, aku udah buka webnya! Makasih yaaa 💖";
            const couponMessage = selectedCoupons.length > 0 ? ` Aku mau klaim hadiah ini: ${selectedCoupons.join(', ')}` : "";
            
            const finalUrl = `https://wa.me/628551487338?text=${encodeURIComponent(baseMessage + couponMessage)}`;
            btnWa.href = finalUrl;
        });
    });
});
