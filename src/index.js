require('./index.less');
require('./jquery.open.close.js');
import anime from 'animejs'

$(document).ready(function() {

    $('.plugin-holder').openClose({
            wrapper: '#page',
		    otherOpeners: '.Header .airplane-button',
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass:'active',
			opener:'.burger-button',
			slider:'.menu_holder .Menu-list-burger-block',
			animSpeed: 400,
			animDirection:'left',
			effect:'push',
			setWindowHeight: true,
			event:'click touchstart'
    });
    // $('.plugin_holder_1').OpenClose({
    //         wrapper: '#page',
	// 		otherOpeners: '.header-holder .mobile-btn',
	// 		addClassBeforeAnimation: true,
	// 		hideOnClickOutside: false,
	// 		activeClass:'active',
	// 		opener:'.opener',
	// 		slider:'.slide',
	// 		animSpeed: 400,
	// 		animDirection:'left',
	// 		effect:'fade',
	// 		setWindowHeight: false,
	// 		event:'click touchstart'
    // });
});