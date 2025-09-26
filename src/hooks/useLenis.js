import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const useLenis = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5, // Adjust the scroll duration
            smooth: true,
            smoothTouch: false, // Set to true if you want smooth touch scrolling
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy(); // Cleanup on unmount
        };
    }, []);
};

export default useLenis;
