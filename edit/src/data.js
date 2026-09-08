/* The repo's own data files, loaded as the side-effect scripts they are. Order matters:
   overlays.js reads window.CALLS and window.POSTS when it defines the question cards
   and the social creatives. */
import '../../videos.js';
import '../../calls.js';
import '../../posts.js';
import '../../overlays.js';

export const DATA = { VIDEOS: window.VIDEOS, CALLS: window.CALLS };
export const ART = window.OVERLAY_ART;
