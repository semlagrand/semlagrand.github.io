import { setupThreeJS } from './modules/index.three.js';
import { mouseLocation, scrollLocation } from './modules/mouse.js';

document.addEventListener('DOMContentLoaded', setupThreeJS);

document.addEventListener('mousemove', mouseLocation);
document.addEventListener('scroll', scrollLocation);
