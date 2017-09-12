(function ($) {

	"use strict";

	var $document = $(document),
		$window = $(window),
		$body = $('body'),
		scrollBarWidth = getScrollbarWidth(),

		// Template options
		templateOption = {
			mobileHeaderBreikpoint: 1025 // in px
		};

	/* ---------------------------------------------
				Scripts initialization
	--------------------------------------------- */
	$document.ready(function () {

		var windowWidth = window.innerWidth || $window.width();
		var windowH = $window.height();
		
		$('body').addClass('is-loaded');
					
		// navigation
		var pushMenu = {
			options: {
				menuTrigger: 'js-pushmenu-toggle',
				firstLevel: 'js-pushmenu',
				closeSubFirst: 'js-close-pushmenu',
				navLevel: 'pushmenu-sub',
				navLabel: 'pushmenu-sub-label',
				openLevel: 'open-sub',
				closeSub: 'close-sub',
				darkness: 'darkness',
				backText: '<i class="icon icon-arrow_left"></i> Back'
			},
			init: function init(options) {
				$.extend(this.options, options);
				pushMenu._handlers(this);
				(windowWidth < templateOption.mobileHeaderBreikpoint) ? $body.addClass('mobilemenu').removeClass('desktopmenu'): $body.addClass('desktopmenu').removeClass('mobilemenu')
			},
			reinit: function reinit(windowWidth) {
				(windowWidth < templateOption.mobileHeaderBreikpoint) ? $body.addClass('mobilemenu').removeClass('desktopmenu'): $body.addClass('desktopmenu').removeClass('mobilemenu')
			},
			_handlers: function _handlers() {
				var $menuTrigger = $('.' + this.options.menuTrigger),
					firstLevel = '.' + this.options.firstLevel,
					openLevel = this.options.openLevel,
					closeSub = this.options.closeSub,
					closeSubFirst = this.options.closeSubFirst,
					darkness = this.options.darkness,
					navLevel = this.options.navLevel,
					navLabel = this.options.navLabel,
					backText = this.options.backText

				$('a', $(firstLevel)).each(function () {
					var $this = $(this);
					if ($this.next('ul').length) {
						$this.addClass(openLevel)
					}
				})

				$('ul', $(firstLevel)).each(function () {
					var $this = $(this),
						cloneLink = $this.prev('a').clone();
					$this.prepend('<li class="' + navLabel + '"></li>')
						.prepend('<li class="' + closeSub + '"><span>' + backText + '</span></li>');
					cloneLink.removeClass(openLevel).prependTo('.' + navLabel, $this);
				})

				$menuTrigger.on('click touchstart', function (e) {
					e.preventDefault();
					$(firstLevel).hasClass('is-open') ? pushMenu._closeMenu(this) : pushMenu._openMenu(this)
				});

				$document.on('click', '.' + openLevel, function (e) {
					if ($body.hasClass('mobilemenu')) {
						$(this).next('.' + navLevel).addClass('is-open');
						$(this).closest('ul').addClass('is-hide');
						$(this).parent('li').removeClass('is-hover');
						e.preventDefault();
					}
				})

				$document.on('mouseenter', firstLevel + ' li', function (e) {
					$(this).addClass('is-hover');
				}).on('mouseleave', firstLevel + ' li', function (e) {
					$(this).removeClass('is-hover');
				})

				$document.on('click touchstart', '.' + closeSub, function () {
					$(this).closest('.' + navLevel).removeClass('is-open');
					$(this).closest('ul').parent('li').closest('ul').removeClass('is-hide');
				});

				$document.on('click touchstart', '.' + closeSubFirst, function () {
					pushMenu._closeMenu();
				});

				$document.on('click', '.' + darkness, function () {
					pushMenu._closeMenu();
				});

				$document.on('mouseenter', firstLevel + ' li', function (e) {
					if ($('ul', this).length) {
						var $elm = $('ul:first', this),
							windowW = $('body').width(),
							isVisible = $elm.offset().left + $elm.width() <= windowW;
						if (!isVisible) {
							$(this).addClass('to-right');
						} else {
							setTimeout(function () {
								$(this).removeClass('to-right');
							}, 0);
						}
					}
				});

			},
			_openMenu: function _openMenu() {
				var $firstLevel = $('.' + this.options.firstLevel);
				$('.header-wrap').css({
					'width': $('.header-wrap').width() + 'px'
				});
				$firstLevel.addClass('is-open');
				$body.addClass('pushmenu-is-open').css({
					'margin-right': scrollBarWidth
				});
			},
			_closeMenu: function _closeMenu() {
				var $firstLevel = $('.' + this.options.firstLevel),
					$openLevel = $('.' + this.options.openLevel);
				$firstLevel.removeClass('is-open').removeClass('is-hide');
				$openLevel.siblings().removeClass('is-open').removeClass('is-hide');
				$body.removeClass('pushmenu-is-open').css({
					'margin-right': 0
				});
				$('.header-wrap').css({
					'width': ''
				});
			}
		}

		// script initialization
		// functions
		modernizrCheck();
		mainSliderIni('.js-home-slider', {
			dots: true,
			autoplay: true,
			autoplaySpeed: 10000,
			fade: true,
			speed: 1000,
			pauseOnHover: false,
			pauseOnDotsHover: true,
			cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
			arrows: false,
			responsive: [{
				breakpoint: 768,
				settings: {
					dots: false
				}
			}]
		});
		projectSliderIni('.js-projects-carousel');
		strategySliderIni('.js-strategy-carousel');
		dataBg('[data-bg]');
		makeCollapse('.collapsed-xs');
		backTop('.js-toTop');
		counterNum('[data-count]', 3000); // 3000 - speed in ms
		animateSkillbar('.skillbar', 1000); // 1000 - speed in ms
		portfolioGrid();
		blogGrid();
		//landingNav();
		contactForm('#contactForm');
		contactFormPopup('#contactFormPopup');
		subscribeForm('#subscribeForm');
		commentForm('#commentForm');
		magnificPopupIni('.open-popup-link');
		magnificPopupVideoIni('.popup-video');
		magnificPopupGalleryIni('.js-product-gallery');
		teamCarousel('.js-team-box-carousel');
		brandsCarousel('.js-brands-carousel');
		testimonialsCarousel('.js-testimonials-carousel');
		googleMapIni('mapFooter', 17, 45.5230942,-73.5835341);
		// objects
		var pushMenu = Object.create(pushMenu);
		pushMenu.init();
		// widgets
		$('.header--sticky').stickyHeader();
		$('body.landing-page nav').pageScroller();
		//$('html').scrollWithEase();
	
		// Resize window events
		$(window).on('resize', debounce(function (e) {
			var windowWidth = window.innerWidth || $window.width();
			pushMenu.reinit(windowWidth);
			slickMobile(windowWidth, '.js-mobile-carousel', 992, 1, 1);
		}))

	})

	/* ---------------------------------------------
				Functions
	--------------------------------------------- */
	function isMobile() {
		return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)))
	}

	function modernizrCheck() {
		if (Modernizr.touch && isMobile()) {
			$('body').addClass('touch');
		} else {
			$('body').addClass('no-touch');
		}
		Modernizr.on('videoautoplay', function (result) {
			if (result) {
				$('body').addClass('videoautoplay');
			}
		});
	}
	// scrollBarWidth
	function getScrollbarWidth() {
		var outer = document.createElement("div");
		outer.style.visibility = "hidden";
		outer.style.width = "100px";
		outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

		document.body.appendChild(outer);

		var widthNoScroll = outer.offsetWidth;
		// force scrollbars
		outer.style.overflow = "scroll";

		// add innerdiv
		var inner = document.createElement("div");
		inner.style.width = "100%";
		outer.appendChild(inner);

		var widthWithScroll = inner.offsetWidth;

		// remove divs
		outer.parentNode.removeChild(outer);

		return widthNoScroll - widthWithScroll;
	}

	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	// magnific popup inline
	function magnificPopupIni(link) {
		$(link).magnificPopup({
			type: 'inline',
			removalDelay: 500,
			callbacks: {
				beforeOpen: function () {
					this.st.mainClass = this.st.el.attr('data-effect');
					$('.header-wrap').css({
						'width': $('.header-wrap').width() + 'px'
					});
					$body.addClass('mfp-is-open');
				},
				afterClose: function () {
					$body.removeClass('mfp-is-open');
					$('.header-wrap').css({
						'width': ''
					});
				}
			}
		})
	}

	// magnific popup inline
	function magnificPopupVideoIni(link) {
		$(link).magnificPopup({
			type: 'iframe',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false,
			removalDelay: 500,
			callbacks: {
				beforeOpen: function () {
					this.st.iframe.markup = this.st.iframe.markup.replace('mfp-iframe-scaler', 'mfp-iframe-scaler mfp-with-anim');
					this.st.mainClass = this.st.el.attr('data-effect');
					$('.header-wrap').css({
						'width': $('.header-wrap').width() + 'px'
					});
					$body.addClass('mfp-is-open');
				},
				afterClose: function () {
					$body.removeClass('mfp-is-open');
					$('.header-wrap').css({
						'width': ''
					});
				}
			},
		})
	}

	// portfolio gallery
	function magnificPopupGalleryIni(link) {
		$(link).magnificPopup({
			delegate: 'a',
			type: 'image',
			removalDelay: 500,
			gallery: {
				enabled: true
			},
			preload: [1, 5],
			callbacks: {
				beforeOpen: function () {
					this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
					this.st.mainClass = this.st.el.attr('data-effect');
					$('.header-wrap').css({
						'width': $('.header-wrap').width() + 'px'
					});
					$body.addClass('mfp-is-open');
				},
				afterClose: function () {
					$body.removeClass('mfp-is-open');
					$('.header-wrap').css({
						'width': ''
					});
				}
			}
		})
	}

	// team box carousel
	function teamCarousel(carousel) {
		if ($(carousel).length) {
			$(carousel).slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true,
				autoplay: false,
				arrows: true,
				dots: false,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 4
					}
							}, {
					breakpoint: 768,
					settings: {
						slidesToShow: 3
					}
							}, {
					breakpoint: 481,
					settings: {
						slidesToShow: 1,
						centerMode: true,
						centerPadding: '50px'
					}
						}]
			});
		}
	}

	// brands carousel
	function brandsCarousel(carousel) {
		if ($(carousel).length) {
			$(carousel).slick({
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: true,
				autoplay: true,
				arrows: true,
				dots: false,
				responsive: [{
					breakpoint: 992,
					settings: {
						slidesToShow: 3
					}
							}, {
					breakpoint: 768,
					settings: {
						slidesToShow: 2
					}
							}, {
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						arrows: false,
						dots: true
					}
						}]
			});
		}
	}

	// testimonial carousel
	function testimonialsCarousel(carousel) {
		if ($(carousel).length) {
			$(carousel).slick({
				mobileFirst: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: true,
				autoplay: false,
				arrows: false,
				dots: true,
				fade: true,
				responsive: [{
					breakpoint: 992,
					settings: {
						customPaging: function (slider, i) {
							return '<button class="tab">' + $('.js-testimonials-carousel .testimonial-item:nth-child(' + (i + 1) + ')').find('.testimonial-item-image').html() + '</button>';
						},
					}
						}]
			});
		}
	}

	// portfolio grid
	function portfolioGrid() {
		var filtr,
			$filterList = $('.filtr-list li'),
			$filterContainer = $('.filtr-container'),
			$shomMore = $('.js-filtr-showmore');
		if ($filterContainer.length) {
			$filterList.on('click', function () {
				$filterList.removeClass('active');
				$(this).addClass('active');
			});
			$filterContainer.imagesLoaded(function () {
				filtr = $filterContainer.filterizr();
				$filterContainer.addClass('is-loaded');
			});
			$shomMore.on('click', function (e) {
				e.preventDefault();
				var toAppend = $('.ajax-data').children();
				filtr._fltr.appendToGallery(toAppend);
				$(this).hide();
			})
		}
	}

	// blog grid
	function blogGrid() {
		var filtr,
			$filterList = $('.filtr-list li'),
			$filterContainer = $('.filtr-container-blog'),
			$shomMore = $('.js-filtr-showmore');
		if ($filterContainer.length) {
			$filterList.on('click', function () {
				$filterList.removeClass('active');
				$(this).addClass('active');
			});
			$filterContainer.imagesLoaded(function () {
				filtr = $filterContainer.filterizr(('setOptions', {
					layout: 'sameWidth'
				}));
				$filterContainer.addClass('is-loaded');
			});
			$shomMore.on('click', function (e) {
				e.preventDefault();
				var toAppend = $('.ajax-data').children();
				filtr._fltr.appendToGallery(toAppend);
				$(this).hide();
			})
		}
	}

	// background image via data-attribute
	function dataBg(obj) {
		if ($(obj).length) {
			$(obj).each(function () {
				var $this = $(this),
					bg = $this.attr('data-bg');
				~bg.indexOf("#") ? $this.css({
					'background-color': bg
				}) : $this.css({
					'background-image': 'url(' + bg + ')'
				});
			})
		}
	}

	function makeCollapse(collapse) {
		$(collapse).each(function () {
			$(this).prepend('<input type="checkbox" class="collapsed-checkbox" checked><i class="collapsed-caret"></i>')
		})
	}

	// set page offset
	function offsetContent(header, content) {
		var $header = $(header);
		if (!$header.hasClass('header--transparent')) {
			if (!$header.hasClass('is-sticky')) {
				setTimeout(function () {
					$(content).css({
						'margin-top': $header.innerHeight()
					});
				}, 100);
			} else {
				setTimeout(function () {
					$(content).css({
						'margin-top': $header.innerHeight() + 34
					});
				}, 2000);
			}
		}
	}

	// back to top
	function backTop(button) {
		var $button = $(button);
		$(window).on('scroll', function () {
			if ($(this).scrollTop() >= 500) {
				$button.addClass('visible');
			} else {
				$button.removeClass('visible');
			}
		});
		$button.on('click', function (e) {
			e.preventDefault();
			$('body,html').animate({
				scrollTop: 0
			}, 1000);
		});
	}

	// Mobile Only carousel initialization
	function slickMobile(windowWidth, carousel, breakpoint, slidesToShow, slidesToScroll) {
		if ($(carousel).length && (windowWidth < breakpoint + 1)) {
			$(carousel).slick({
				mobileFirst: true,
				slidesToShow: slidesToShow,
				slidesToScroll: slidesToScroll,
				infinite: true,
				autoplay: false,
				arrows: false,
				dots: true,
				responsive: [{
					breakpoint: breakpoint,
					settings: "unslick"
				}]
			});
		}
	}



	// Slider Animation
	function doAnimationsStart(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = $this.data('delay');
			var $animationType = $this.data('animate-start');
			$this.css({
				'animation-delay': $animationDelay + 'ms',
				'-webkit-animation-delay': $animationDelay + 'ms'
			});
			$this.addClass('animated ' + $animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType);
			});
		});
	}

	function doAnimationsEnd(elements) {
		var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		elements.each(function () {
			var $this = $(this);
			var $animationDelay = 0;
			var $animationType = $this.data('animate-end');
			$this.css({
				'animation-delay': '',
				'-webkit-animation-delay': ''
			});
			$this.addClass($animationType).one(animationEndEvents, function () {
				$this.removeClass($animationType).removeClass('animated');
			});
		});
	}
	
	// strategy slider
	function strategySliderIni(slider) {
		var $slider = $(slider);
		$slider.on('init', function (e, slick, currentSlide) {
			var $firstAnimatingElements = $('div.strategy-box:first-child').find('[data-animate-start]');
			doAnimationsStart($firstAnimatingElements);
		});
		$slider.on('afterChange', function (e, slick, currentSlide) {
			var $currentSlide = $('div.strategy-box[data-slick-index="' + currentSlide + '"]');
			var $animatingElements = $currentSlide.find('[data-animate-start]');
			doAnimationsStart($animatingElements);
		});
		$slider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
			var $currentSlide = $('div.strategy-box[data-slick-index="' + currentSlide + '"]');
			var $animatingElements = $currentSlide.find('[data-animate-end]');
			doAnimationsEnd($animatingElements);
		});
		$slider.slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 400,
			infinite: true,
			autoplay: true,
			arrows: false,
			dots: true,
			fade: true,
			speed: 1000
		})
	}
	
	// project slider
	function projectSliderIni(slider) {
		var $slider = $(slider);
		$slider.on('init', function (e, slick, currentSlide) {
			arrowText()
		});
		$slider.on('afterChange', function (e, slick, currentSlide) {
			arrowText()
		});
		$slider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
			$('.slick-next .text').animate({
				'opacity': 0,
				'left': '20px'
			}, 400);
			$('.slick-prev .text').stop(true, true).animate({
				'opacity': 0,
				'right': '20px'
			}, 400);
		});
		$slider.slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			speed: 600,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 6000,
			arrows: true,
			dots: false,
			centerMode: true,
			centerPadding: '0',
			cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
			appendArrows: '.projects-slider-control-arrows',
			prevArrow: '<button type="button" class="slick-prev"><span><span class="text"></span></span></button>',
			nextArrow: '<button type="button" class="slick-next"><span><span class="text"></span></span></button>',
			responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					centerPadding: '120px'
				}
				}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					centerMode: false,
					arrows: false,
					dots: true
				}
				}]
		})

		function arrowText() {
			if ($slider.children.length > 2) {
				$('.projects-slider-control-arrows').hide();
				return false;
			} else {
				var nextText = $('.slick-active', $slider).next().length ? $('.slick-active', $slider).next().find('.project-box-text').html() : $('.slick-slide', $slider).first().find('.project-box-text').html();
				var prevText = $('.slick-active', $slider).prev().length ? $('.slick-active', $slider).prev().find('.project-box-text').html() : $('.slick-slide', $slider).last().find('.slide-text-1 > span').html();
				$('.slick-next .text').html(nextText);
				$('.slick-prev .text').html(prevText);
				$('.slick-next .text').stop(true, true).animate({
					'opacity': 1,
					'left': ''
				}, 400);
				$('.slick-prev .text').stop(true, true).animate({
					'opacity': 1,
					'right': ''
				}, 400);
			}
		}
	}

	// main slider
	function mainSliderIni(slider, settings) {
		var $slider = $(slider);
		var slideVideo = '.slide-video',
			videoControl = '.video-control',
			videoStopBtn = '.video-stop',
			videoPlayBtn = '.video-play';

		function videoPlay() {
			var currentSlide = '.slick-active';
			var $currentVideo = $(currentSlide + ' ' + slideVideo, $slider);
			$slider.slick('slickPause');
			$currentVideo[0].play();
			$(currentSlide).addClass('is-playing').removeClass('is-pause');
			$currentVideo.on('ended', function () {
				$slider.slick('slickNext');
				$slider.slick('slickPlay');
			});
		}

		function videoStop() {
			var currentSlide = '.slick-active',
				$currentVideo = $(currentSlide + ' ' + slideVideo, $slider);
			$currentVideo[0].pause();
			$(currentSlide).removeClass('is-playing').addClass('is-pause');
			$slider.slick('slickPlay');
		}
		$(videoPlayBtn).on('click', function () {
			videoPlay();
		});

		$(videoStopBtn).on('click', function () {
			videoStop();
		});
		$slider.on('init', function (e, slick, currentSlide) {
			var $firstAnimatingElements = $('div.slide:first-child').find('[data-animate-start]');
			var $currentSlide = $('div.slide:first-child');
			doAnimationsStart($firstAnimatingElements);
			if ($currentSlide.hasClass('slider-dark')) {
				$body.addClass('has-dark-menu');
			} else {
				$body.removeClass('has-dark-menu');
			}
			setTimeout(function () {
				if ($currentSlide.attr('data-autoplay') === 'true' && $('body').hasClass('videoautoplay')) {
					videoPlay();
				}
			}, 1000);
		});
		$slider.on('afterChange', function (e, slick, currentSlide) {
			var $currentSlide = $('div.slide[data-slick-index="' + currentSlide + '"]');
			var $animatingElements = $currentSlide.find('[data-animate-start]');
			if ($currentSlide.hasClass('slider-dark')) {
				$body.addClass('has-dark-menu');
			} else {
				$body.removeClass('has-dark-menu');
			}
			doAnimationsStart($animatingElements);
			if ($(slideVideo, $slider).length) {
				$(slideVideo, $slider).each(function () {
					$(this)[0].pause();
				});
			}
			if ($('.slick-active ' + slideVideo, $slider).length) {
				if ($currentSlide.hasClass('is-playing')) {
					videoPlay();
				} else if ($('.slick-active').attr('data-autoplay') === 'true' && $('body').hasClass('videoautoplay') && !$currentSlide.hasClass('is-pause')) {
					videoPlay();
				}
				$(videoControl).addClass('visible');
			} else {
				$(videoControl).removeClass('visible');
			}
		});
		$slider.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
			var $currentSlide = $('div.slide[data-slick-index="' + currentSlide + '"]');
			var $animatingElements = $currentSlide.find('[data-animate-end]');
			doAnimationsEnd($animatingElements);
			$slider.slick('slickPlay');
		});
		$slider.slick(
			settings
		);
	}

	function contactForm(form) {
		var $contactForm = $(form)
		$contactForm.validator().on('submit', function (e) {
			if (!e.isDefaultPrevented()) {
				e.preventDefault();
				$contactForm.ajaxSubmit({
					type: "POST",
					data: $contactForm.serialize(),
					url: "php/process-contact.php",
					success: function success() {
						$('.success-confirm', $contactForm).fadeIn();
						$contactForm.get(0).reset();
					},
					error: function error() {
						$('.error-confirm', $contactForm).fadeIn();
					}
				});
			}
		})
	}

	$.fn.stickyHeader = function () {
		var $header = this,
			$body = $('body'),
			headerOffset = $header.hasClass('header--transparent') ? 130 : 100;

		$(window).scroll(function () {
			var st = getCurrentScroll();
			if (st > headerOffset) {
				$header.addClass('is-sticky');
				$body.addClass('hdr-sticky');
			} else {
				$header.removeClass('is-sticky');
				$body.removeClass('hdr-sticky');
			}
		});
		$(window).scroll();

		function getCurrentScroll() {
			return window.pageYOffset || document.documentElement.scrollTop;
		}
	}

	$.fn.pageScroller = function (options) {

		var settings = $.extend({
			nav: $(this),
			links: $(this).find('a.inside-link'),
			navActiveClass: 'active',
			scrollContainer: $('html, body'),
			scrollSpeed: 1000,
			section: $('.section, header'),
			navHeight: 100
		}, options);
		
		settings.links.each(function () {
			var link = $(this),
				targetSection = $(link.attr('href'));
			link.on('click', function (e) {
				e.preventDefault();
				settings.links.parent('li').removeClass(settings.navActiveClass);
				link.parent('li').addClass(settings.navActiveClass);
				settings.scrollContainer.stop().animate({
					scrollTop: targetSection.offset().top - settings.navHeight
				}, settings.scrollSpeed);
			});
		});

		$(window).on('scroll', function () {
			var wScroll = $(window).scrollTop() + settings.navHeight + 1;
			settings.section.each(function (index) {
				var id = $(this).attr('id'),
					top = $(this).offset().top,
					secHeight = $(this).outerHeight();
				if (top <= wScroll && (top + secHeight) > wScroll) {
					settings.links.parent('li').removeClass(settings.navActiveClass);
					settings.nav.find('a[href="#' + id + '"]').parent('li').addClass(settings.navActiveClass);
				}
			});
		});
	};
	
	function counterNum(obj, duration) {
		$(obj).closest('.section').waypoint(function () {
			$(obj).each(function () {
				var $this = $(this),
					countTo = $this.attr('data-count');
				$({
					countNum: $this.text()
				}).animate({
					countNum: countTo
				}, {
					duration: duration,
					easing: 'linear',
					step: function () {
						$this.text(Math.floor(this.countNum), 10);
					},
					complete: function () {
						$this.text(this.countNum);
					}
				});
			});
		}, {
			triggerOnce: true,
			offset: '80%'
		});
	}

	function animateSkillbar(obj, duration) {
		$(obj).closest('.section').waypoint(function () {
			$(obj).each(function () {
				$(this).find('.skillbar-bar').animate({
					width: $(this).attr('data-percent')
				}, duration);
			});
		}, {
			triggerOnce: true,
			offset: '80%'
		});
	}

	function anchorScroll(offset, duration) {
		$('a[href*=\\#]').on('click', function (event) {
			event.preventDefault();
			$('html,body').animate({
				scrollTop: $(this.hash).offset().top - offset
			}, duration);
		});
	}

	// Google Map
	function googleMapIni(id, mapZoom, lat, lng) {
		if ($('#' + id).length) {
			// Create google map
			// Basic options for a simple Google Map
			// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
			var mapOptions = {
				// How zoomed in you want the map to start at (always required)
				zoom: mapZoom,
				scrollwheel: false, // The latitude and longitude to center the map (always required)
				center: new google.maps.LatLng(lat, lng),
				// How you would like to style the map. 
				// This is where you would paste any style found on Snazzy Maps.
				styles: [{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [{
						"color": "#e9e9e9"
				}, {
						"lightness": 17
				}]
			}, {
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [{
						"color": "#f5f5f5"
				}, {
						"lightness": 20
				}]
			}, {
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [{
						"color": "#ffffff"
				}, {
						"lightness": 17
				}]
			}, {
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [{
						"color": "#ffffff"
				}, {
						"lightness": 29
				}, {
						"weight": 0.2
				}]
			}, {
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [{
						"color": "#ffffff"
				}, {
						"lightness": 18
				}]
			}, {
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [{
						"color": "#ffffff"
				}, {
						"lightness": 16
				}]
			}, {
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [{
						"color": "#f5f5f5"
				}, {
						"lightness": 21
				}]
			}, {
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [{
						"color": "#dedede"
				}, {
						"lightness": 21
				}]
			}, {
					"elementType": "labels.text.stroke",
					"stylers": [{
						"visibility": "on"
				}, {
						"color": "#ffffff"
				}, {
						"lightness": 16
				}]
			}, {
					"elementType": "labels.text.fill",
					"stylers": [{
						"saturation": 36
				}, {
						"color": "#333333"
				}, {
						"lightness": 40
				}]
			}, {
					"elementType": "labels.icon",
					"stylers": [{
						"visibility": "off"
				}]
			}, {
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [{
						"color": "#f2f2f2"
				}, {
						"lightness": 19
				}]
			}, {
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [{
						"color": "#fefefe"
				}, {
						"lightness": 20
				}]
			}, {
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [{
						"color": "#fefefe"
				}, {
						"lightness": 17
				}, {
						"weight": 1.2
				}]
			}]
			};
			// Get the HTML DOM element that will contain your map 
			// We are using a div with id="map" seen below in the <body class="preloader-on">
			var mapElement = document.getElementById(id);
			// Create the Google Map using our element and options defined above
			var map = new google.maps.Map(mapElement, mapOptions);
			var image = 'images/map-marker.png';
			// Let's also add a marker while we're at it
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lng),
				map: map,
				icon: image
			});
		}
	}

	function animateSkillbar(obj, duration) {
		$(obj).closest('.section').waypoint(function () {
			$(obj).each(function () {
				$(this).find('.skillbar-bar').animate({
					width: $(this).attr('data-percent')
				}, duration);
			});
		}, {
			triggerOnce: true,
			offset: '80%'
		});
	}

	function contactForm(form) {
		var $contactForm = $(form);
		$contactForm.validator().on('submit', function (e) {
			if (!e.isDefaultPrevented()) {
				e.preventDefault();
				$contactForm.ajaxSubmit({
					type: "POST",
					data: $contactForm.serialize(),
					url: "php/process-contact.php",
					success: function success() {
						$('.success-confirm', $contactForm).fadeIn();
						$contactForm.get(0).reset();
					},
					error: function error() {
						$('.error-confirm', $contactForm).fadeIn();
					}
				});
			}
		});
	}

	function contactFormPopup(form) {
		var $contactFormPopup = $(form);
		$contactFormPopup.validator().on('submit', function (e) {
			if (!e.isDefaultPrevented()) {
				e.preventDefault();
				$contactFormPopup.ajaxSubmit({
					type: "POST",
					data: $contactFormPopup.serialize(),
					url: "php/process-contact-popup.php",
					success: function success() {
						$('.success-confirm', $contactFormPopup).fadeIn();
						$contactFormPopup.get(0).reset();
					},
					error: function error() {
						$('.error-confirm', $contactFormPopup).fadeIn();
					}
				});
			}
		});
	}

	function commentForm(form) {
		var $commentForm = $(form);
		$commentForm.validator().on('submit', function (e) {
			if (!e.isDefaultPrevented()) {
				e.preventDefault();
				$commentForm.ajaxSubmit({
					type: "POST",
					data: $commentForm.serialize(),
					url: "php/process-comment.php",
					success: function success() {
						$('.success-confirm', $commentForm).fadeIn();
						$commentForm.get(0).reset();
					},
					error: function error() {
						$('.error-confirm', $commentForm).fadeIn();
					}
				});
			}
		});
	}

	function subscribeForm(form) {
		var $subscribeForm = $(form);
		$subscribeForm.validator().on('submit', function (e) {
			if (!e.isDefaultPrevented()) {
				e.preventDefault();
				$subscribeForm.ajaxSubmit({
					type: "POST",
					data: $subscribeForm.serialize(),
					url: "php/process-subscribe.php",
					success: function success() {
						$('.success-confirm', $subscribeForm).fadeIn();
						$subscribeForm.get(0).reset();
					},
					error: function error() {
						$('.error-confirm', $subscribeForm).fadeIn();
					}
				});
			}
		});
	}


	// END FUNCTIONS

})(jQuery);