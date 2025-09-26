// utils/registerScrollTrigger.js
import gsap from 'gsap';

export const registerScrollTrigger = async () => {
    if (typeof window !== 'undefined') {
        const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
        gsap.registerPlugin(ScrollTrigger);
    }
};
