require('./index.less');
require('./jquery.open.close.js');
import anime from 'animejs'

$(document).ready(function() {

    $('.plugin-holder').openClose({
            wrapper: '#page',
		    otherOpeners: '.Header .airplane-button',
			addClassBeforeAnimation: true,
			hideOnClickOutside: true,
			activeClass:'active',
			opener:'.burger-button',
			slider:'.menu_holder .Menu-list-burger-block',
			animSpeed: 400,
			animDirection:'left',
			effect:'push',
			setWindowHeight: true,
			event:'click touchstart'
    });
    $('.plugin_holder_1').openClose({
            wrapper: '#page',
			otherOpeners: '.burger-button',
			addClassBeforeAnimation: true,
			hideOnClickOutside: true,
			activeClass:'active',
			opener:'.airplane-button',
			slider:'.Menu-list-airplane-block',
			animSpeed: 400,
			animDirection:'left',
			effect:'push',
			setWindowHeight: true,
			event:'click touchstart'
    });
});