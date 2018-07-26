import anime from 'animejs'
(function() {
console.log(anime);
	function OpenClose(options) {
		this.options = $.extend({
			wrapper: '#wrapper',
			otherOpeners: '.header-holder .mobile-btn',
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 400,
			animDirection:'left',
			effect:'fade',
			setWindowHeight: false,
			event:'click touchstart'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		ca: null,
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.win = $(window);
			this.holder = $(this.options.holder);
			this.wrapper = $(this.options.wrapper);
			this.otherOpeners = $(this.options.otherOpeners);
			this.opener = this.holder.find(this.options.opener);
			this.slider = $(this.options.slider);
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.bind(self.options.event, this.eventHandler);

			// hover mode handler
			if(self.options.event === 'over') {
				self.opener.bind('mouseenter', function() {
					self.showSlide();
				});
				self.holder.bind('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if(self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).bind('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}

			// resize slide
			self.resizeHandler = function(){
				if (self.options.setWindowHeight) {
					self.slider.css({
						height: self.win.height()
					});
				}
			};
			this.win.on('load resize orientationchange', self.resizeHandler);
			
			var w = self.slider.outerWidth();
			var opener_w =self.opener.outerWidth()
			if(w >=(screen.width - opener_w)) {
				w = screen.width - opener_w
				self.slider.width(w);
			}
			self.slider.css('right',-w);
			self.slider.css('top','0');
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			
			self.slider.removeClass(slideHiddenClass);
			$(document).bind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true, self);
			toggleEffects[self.options.effect].show({
				me:self,
				box: self.slider,
				wrapper: self.wrapper,
				opener: self.opener,
				otherOpeners: self.otherOpeners,
				speed: self.options.animSpeed,
				animDirection:self.options.animDirection,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true, self);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).unbind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false, self);
			toggleEffects[self.options.effect].hide({
				me:self,
				box: self.slider,
				wrapper: self.wrapper,
				opener: self.opener,
				otherOpeners: self.otherOpeners,
				speed: self.options.animSpeed,
				animDirection:self.options.animDirection,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false, self);
					if (self.options.effect === 'push') {
						self.wrapper.removeAttr('style');
						self.slider.css({display:''});
					}
				}
			});
		},
		destroy: function() {
			var self = this;
			this.win.off('resize orientationchange', this.resizeHandler);
			setTimeout(function(){
				self.slider.removeClass(slideHiddenClass).css({display:'', height: ''});
			},0);

			this.opener.unbind(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			this.otherOpeners.removeAttr('style');
			this.wrapper.removeAttr('style');
			$(document).unbind('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if(typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		},
		push: {
			show: function(o) {
				// var animObj={};
				// animObj[o.animDirection]=-o.box.outerWidth();
				 o.box.show();
				 o.otherOpeners.not(o.opener).hide();
				// o.wrapper.animate(animObj, o.speed, o.complete);
				//-----------------------
				o.me.ca = anime({
					targets:[o.wrapper[0],o.box[0]],
					elasticity: 0,
					easing: 'easeInOutSine',//'easeInQuart',
					duration: 400,
					translateX: o.box.width()*-1,
					complete:o.complete
				});
				

			},
			hide: function(o) {
				 o.otherOpeners.removeAttr('style');
				// o.wrapper.animate(animObj, o.speed, o.complete);
				if(o.me.ca.began && !o.me.ca.completed) {
					o.me.ca.complete = o.complete;
					o.me.ca.play();
					o.me.ca.reverse();
					return;
				}
				o.me.ca = anime({
					targets:[o.wrapper[0],o.box[0]],
					elasticity: 0,
					easing: 'easeInOutSine',//'easeInQuart',
					duration: 400,
					translateX: 0,
					complete:o.complete
				});
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		return this.each(function() {
			jQuery(this).data('OpenClose', new OpenClose($.extend(opt, {holder: this})));
		});
	};
}());
