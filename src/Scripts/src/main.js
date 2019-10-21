/*jshint esversion: 6 */
// Globals ========================================================= *
// Bootstrap
import './Globals/bootstrap-setup.js';
// Scripts ========================================================= *
//Set page title based on data-title attribute on body tag
const PageBodyData = document.getElementsByTagName('body')[0].getAttribute('data-title');
const PageTitle = document.getElementsByTagName('title')[0].textContent = PageBodyData;
