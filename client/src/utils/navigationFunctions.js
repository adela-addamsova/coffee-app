    // Scroll to top
    export const scrollToTop = () => window.scrollTo({ top: 0 });

    // Scroll to section
    export const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView(
        );
    };

    // Handle scroll or route change
    export const handleNavigation = (e, item, location, navigate, closeMenu) => {
        if (item.to) return;

        e.preventDefault();

        if (item.scrollTop) {
            scrollToTop();
            if (closeMenu) closeMenu();
            return;
        }

        if (item.sectionId) {
            const isHome = location.pathname === '/';

            if (isHome) {
                scrollTo(item.sectionId);
            } else {
                navigate('/', { state: { scrollToId: item.sectionId } });
            }

            if (closeMenu) closeMenu();
            return;
        }

        if (closeMenu) closeMenu();
    };
