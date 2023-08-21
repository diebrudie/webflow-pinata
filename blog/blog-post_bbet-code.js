$(document).ready(function () {
	adjustFigureAlignment();
	backToTopHandler();
	stickyTabHandler();
	setupScrollEvents();
	randomImageStickyBar();
	appendClickToCopyAndZoom();
	newsletterFormSubmit();
});

function adjustFigureAlignment() {
	$('.blog-post__rich-text figure').each(function () {
		$(this)
			.removeClass('w-richtext-align-center')
			.addClass('w-richtext-align-fullwidth');
		$(this).find('div').css('width', '100%');
	});
}

function backToTopHandler() {
	$('.blog-post__back2top').click(function () {
		$('body,html').animate({ scrollTop: 0 }, 'slow');
		$('.blog-post__back2top').removeClass('is--active');
	});
}

function stickyTabHandler() {
	$('.blog-post__sticky-tab-trigger').click(function () {
		$(
			'.blog-post__sticky-tab, .blog-post__signup-sticky-mobile, .blog-post__sticky-tab-arrows'
		).toggleClass('is--active');
	});
}

function setupScrollEvents() {
	var scrollTop = $(this).scrollTop();
	var scrollHeight = $(document).height();
	var windowHeight = $(this).height();
	var scrollPercentage = (scrollTop / (scrollHeight - windowHeight)) * 100;

	if (scrollPercentage >= 10) {
		$('.blog-post__back2top').addClass('is--active');
		//console.log("User has scrolled 10% of the page!");
	} else {
		$('.blog-post__back2top').removeClass('is--active');
	}

	//START => rudderstack events
	let timeSpentOnPage = 0; // in seconds

	let $blogPost = $('#blogPost'); // Section that determines the length
	let blogPostHeight = $blogPost.height();
	let blogPostOffsetTop = $blogPost.offset().top;

	// Array to store all the scroll events
	let scrollEvents = [
		{ name: 'BLOG_SCROLL_50', percent: 50, triggered: false },
		{ name: 'BLOG_SCROLL_75', percent: 75, triggered: false },
		{ name: 'BLOG_SCROLL_90', percent: 90, triggered: false },
		{ name: 'BLOG_ONPAGE_120', percent: 85, time: 120, triggered: false },
	];

	// Increase time spent on page counter every second
	setInterval(function () {
		timeSpentOnPage++;
	}, 1000);

	let $stickySignup = $('.blog-post__signup-sticky');
	let $stickySignupMobTab = $('.blog-post__sticky-tab');
	let $ctaStickySignup = $('#ctaSignupSticky');

	// Hide the sticky signup on initial load
	$stickySignup.css({ opacity: 0 });
	let isStickySignupVisible = false;
	$stickySignupMobTab.css({ opacity: 0 });
	let isStickySignupMobTabVisible = false;

	$ctaStickySignup.css({ 'font-size': '.85rem' });

	// Updated Scroll Logic
	$(window).scroll(function (e) {
		let scrollTop = $(window).scrollTop();
		let scrollPercent = (scrollTop - blogPostOffsetTop) / blogPostHeight;
		let scrollPercentRounded = Math.round(scrollPercent * 100);

		const toggleSticky = (element, threshold, isVisibleFlag) => {
			const shouldShow =
				scrollPercentRounded >= threshold && !isVisibleFlag;
			const shouldHide =
				scrollPercentRounded < threshold && isVisibleFlag;

			if (shouldShow) {
				element.css({ opacity: 1 });
				isVisibleFlag = true;
			} else if (shouldHide) {
				element.css({ opacity: 0 });
				isVisibleFlag = false;
			}

			return isVisibleFlag;
		};

		if ($(window).width() >= 768) {
			// Desktop sticky logic
			isStickySignupVisible = toggleSticky(
				$stickySignup,
				25,
				isStickySignupVisible
			);
			//console.log("isStickySignupVisible: " + isStickySignupVisible);
		} else {
			// Mobile/tab sticky logic
			isStickySignupMobTabVisible = toggleSticky(
				$stickySignupMobTab,
				10,
				isStickySignupMobTabVisible
			);
		}

		scrollEvents.forEach((event) => {
			if (!event.triggered) {
				if (scrollPercentRounded >= event.percent) {
					if (event.time) {
						if (timeSpentOnPage >= event.time) {
							rudderanalytics.track(event.name);
							event.triggered = true;
							//console.log(event.name);
						}
					} else {
						rudderanalytics.track(event.name);
						event.triggered = true;
						//console.log(event.name);
					}
				}
			}
		});
	});
	if ($(window).width() >= 768) {
		// Update height and offset when window resizes
		blogPostHeight = $blogPost.height();
		blogPostOffsetTop = $blogPost.offset().top;
	}
	//END => rudderstack events
}

function randomImageStickyBar() {
	//START => random image on sticky bar
	let images = [
		{
			url: 'https://uploads-ssl.webflow.com/629e4fe96456f848f903e7ef/64d4d73188143c950739a272_img-sticky-signup-1-clouds-v2.png',
			descriptor: 'cloud',
		},
		{
			url: 'https://uploads-ssl.webflow.com/629e4fe96456f848f903e7ef/64d4d72e41e14ef446e5482c_img-sticky-signup-2-space-v2.png',
			descriptor: 'space',
		},
		{
			url: 'https://uploads-ssl.webflow.com/629e4fe96456f848f903e7ef/64d4d7287f20c5a846eb3772_img-sticky-signup-3-keyboard-v2.png',
			descriptor: 'keyboard',
		},
	];

	// Select a random image from the array
	let randomImageObj = images[Math.floor(Math.random() * images.length)];

	// Set the randomly chosen image as the background for the element
	$stickySignup.css('background-image', 'url(' + randomImageObj.url + ')');

	// Assign the descriptor as a data-attribute-image for tracking
	$stickySignup.attr('data-attribute-image', randomImageObj.descriptor);

	// Check if the chosen image's descriptor is "keyboard"
	if (randomImageObj.descriptor === 'keyboard') {
		$stickySignup.css('color', 'white');
		//$ctaStickySignup.removeClass('is--blog-signup-sticky');
		$ctaStickySignup.addClass('is--tertiary');
		$('.blog-post__signup-title').text('Ready to shape the future?');
	}
	//END => random image on sticky bar
}

function appendClickToCopyAndZoom() {
	// Check if highlight.js exists on the page
	if (typeof hljs !== 'undefined') {
		hljs.highlightAll();
	}

	// Now add copy buttons and functionality
	var snippets = document.getElementsByTagName('pre');
	var numberOfSnippets = snippets.length;
	for (var i = 0; i < numberOfSnippets; i++) {
		(function (i) {
			// Adjusted to select the sibling <code> element with class "hljs" of the button
			var code = snippets[i].getElementsByTagName('code')[0].innerText;

			snippets[i].classList.add('hljs');

			snippets[i].innerHTML =
				'<button class="hljs-copy">Copy</button>' +
				snippets[i].innerHTML;

			snippets[i]
				.getElementsByClassName('hljs-copy')[0]
				.addEventListener('click', function () {
					this.innerText = 'Copying..';
					// Use clipboard API for copying
					navigator.clipboard
						.writeText(code)
						.then(() => {
							this.innerText = 'Copied!';
							var button = this;
							setTimeout(function () {
								button.innerText = 'Copy';
							}, 1000);
						})
						.catch((err) => {
							console.error('Could not copy text: ', err);
						});
				});
		})(i);
	}

	//zoom images in lightbox
	var richTextElement = document.querySelector('.blog-post__rich-text');
	var images = richTextElement.querySelectorAll('img');

	images.forEach(function (img) {
		var parentDiv = img.parentElement;
		if (parentDiv) {
			var zoomButton = document.createElement('div'); // Changed this to 'div'
			zoomButton.className = 'zoom-img';
			zoomButton.setAttribute('fs-smartlightbox-element', 'trigger-open');

			// Create the image element and set its attributes
			var zoomIcon = document.createElement('img');
			zoomIcon.src =
				'https://uploads-ssl.webflow.com/629e4fe96456f848f903e7ef/64e31f3dd9ad50c21aea609f_icon-magnifier-black.svg';
			zoomIcon.className = 'zoom-img__icon';
			zoomButton.appendChild(zoomIcon);

			zoomButton.addEventListener('click', function () {
				var lightboxImage = document.querySelector(
					'.c-lightbox__img-zoomed'
				);
				var lightbox = document.querySelector('.c-lightbox');

				if (lightboxImage) {
					lightboxImage.src = img.src; // Set the source of the lightbox image to the clicked image
				}

				// Toggle the class 'is--inactive' on the lightbox
				if (lightbox) {
					lightbox.classList.toggle('is--inactive');
				}

				// Toggle the class 'no-scroll' on the html and body
				document.querySelector('html').classList.toggle('no-scroll');
				document.querySelector('body').classList.toggle('no-scroll');
			});

			parentDiv.appendChild(zoomButton);
		}
	});

	// Handling the closing of the lightbox
	document
		.querySelectorAll('.c-lightbox__close-x, .c-lightbox__close-div')
		.forEach(function (closeElement) {
			closeElement.addEventListener('click', function () {
				var lightbox = document.querySelector('.c-lightbox');
				if (lightbox) {
					lightbox.classList.toggle('is--inactive');
				}

				// Toggle the class 'no-scroll' on the html and body
				document.querySelector('html').classList.toggle('no-scroll');
				document.querySelector('body').classList.toggle('no-scroll');
			});
		});
}

function newsletterFormSubmit() {
	//START => newsletter form submit webhook
	function hubspotCookie() {
		return document.cookie.replace(
			/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
			'$1'
		);
	}

	$('#form-newsletter').submit(function (e) {
		e.preventDefault();
		let timestamp = new Date().toISOString(); // Get current ISO timestamp
		let pageUri = $(location).attr('href');
		let pageTitle = $(document).attr('title');
		let hsCookie = hubspotCookie();

		// Set hidden fields values
		$('#ISOtimestamp').val(timestamp);
		$('#pageUri').val(pageUri);
		$('#pageTitle').val(pageTitle);
		$('#hsCookie').val(hsCookie);

		var form_data = $('form').serialize();
		$.post(
			'https://hook.us1.make.com/hfqtdjf71qhkvif3kgjh3395hg1426nj',
			form_data
		)
			.done(function (data) {
				var parent = $(form.parent());
				// Hide the form
				parent.children('form').css('display', 'none');
				// Display the "Done" block
				parent.children('.w-form-done').css('display', 'block');
				/*setTimeout(function(){
        $('#success-message').show();
      }, 300);*/
			})
			.fail(function (error) {
				$('#success-message').hide();
				$('#wf-form-newsletter').show();
				$('#error-message').show();
			});
	});
	//END => newsletter form submit webhook
}
