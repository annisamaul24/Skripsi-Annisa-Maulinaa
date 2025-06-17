document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const iconBars = document.querySelector('.fa-bars');
    const iconClose = document.querySelector('.fa-xmark');
    const menuLinks = document.querySelectorAll('.menu a'); // Semua link di menu

    function closeMenu() {
        menu.classList.add('hidden');
        iconBars.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menu.classList.remove('absolute', 'top-14', 'w-full', 'left-0', 'right-auto', 'bg-yellow-600', 'divide-white', 'divide-y-2');
    }

    function openMenu() {
        menu.classList.remove('hidden');
        iconBars.classList.add('hidden');
        iconClose.classList.remove('hidden');
        menu.classList.add('absolute', 'top-14', 'w-full', 'left-0', 'right-auto', 'bg-yellow-600', 'divide-white', 'divide-y-2');
    }

    hamburgerMenu.addEventListener('click', () => {
        const isOpen = menu.classList.contains('absolute');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Tutup menu jika salah satu link diklik (di mode mobile)
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMenu();
            }
        });
    });

    // Tutup menu otomatis saat resize ke ukuran kecil
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            // Mode desktop: tampilkan menu
            menu.classList.remove('hidden');
            menu.classList.remove('absolute', 'top-14', 'w-full', 'left-0', 'right-auto', 'bg-yellow-600', 'divide-white', 'divide-y-2');
            iconBars.classList.remove('hidden');
            iconClose.classList.add('hidden');
        } else {
            // Mode mobile: sembunyikan menu
            closeMenu();
        }
    });
});
