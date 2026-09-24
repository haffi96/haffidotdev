import { domMax } from "motion/react";

// Loaded lazily by <LazyMotion> so animation features stay out of the initial bundle.
// domMax (rather than domAnimation) is needed for shared-layout `layoutId` animations.
export default domMax;
