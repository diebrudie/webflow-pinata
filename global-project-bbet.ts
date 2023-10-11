import $ from 'jquery';
import { gsap } from "gsap";

alert('connected');
// mobile hamburger menu animation
$(".c-nav__btn-hamb-lottie").on("click", function () {
    $(".c-nav__menu").toggleClass("is--open");
    // disable scroll when mobile menu is open
    $("body").toggleClass("no-scroll");
  });
  
  // disable scroll when dropdown is open on desktop
  $(".c-nav__menu-link.is--dropdown").on("mouseenter mouseleave", function () {
    $("body").toggleClass("no-scroll");
  });
  
  //menu arrow external on hover
  $(".nav__menu-link").on("mouseenter mouseleave", function () {
    $(this).find(".nav__menu-link-arrow.is--external").toggleClass("is--active");
  });
  
  $(document).ready(function () {
    // new mobile hamburger menu
    $(".nav__hamburger-lottie").on("click", function () {
      hamburgerMenu();
    });
 //Footer hover in/out
    $(".c-footer__link").on("mouseenter mouseleave", function () {
      $(this).find(".c-footer__link-arrow").toggleClass("is--active");
    });
  
    //blockchain-logos:hover
    $(".c-logos-crypto__logo-img.is--normal").on(
      "mouseenter mouseleave",
      function () {
        $(this).siblings(".c-logos-crypto__hover-txt").toggleClass("is--active");
        $(this).toggleClass("is--active");
      }
    );
  
    $(".c-logos-crypto__wrp").on("mouseenter mouseleave", function () {
      $(this).siblings(".c-logos-crypto__hover-txt").toggleClass("is--active");
      $(this)
        .find(".c-logos-crypto__logo-img.is--grayscale")
        .toggleClass("is--inactive");
      $(this)
        .find(".c-logos-crypto__logo-img.is--original")
        .toggleClass("is--active");
    });
  
    // code for desktop-menu
    if ($(window).width() > 992) {
      // .cursor class needs to have a mouse click interaction applied
      $(
        "a, .nav__menu-dp-link, .w-checkbox-input, .w-form-label, .w-inline-block"
      ).mouseenter(function () {
        $(".cursor").click();
      });
      $(
        "a, .nav__menu-dp-link, .w-checkbox-input, .w-form-label, .w-inline-block"
      ).mouseleave(function () {
        $(".cursor").click();
      });
  
      // new menu using gsap
      let menuLink = $(".nav__menu-dp-link");
      let content = $(".nav__menu-dp-content");
      let menuBG = $(".nav__menu-bg");
      let dropdownWrap = $(".nav__menu-content");
      let menuArrow = $(".nav__menu-arrow-wrp");
      let inBetweenLinks = $(".nav__menu-link").attr("data-links");
  
      gsap.defaults({
        duration: 0.4
      });
  
      // Open dropdown animation
      let showDropdown = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          dropdownWrap.css("display", "none");
          menuLink.removeClass("active");
        }
      });
      showDropdown
        .from(dropdownWrap, { opacity: 0, rotateX: -10, duration: 0.2 })
        .to(menuArrow, { opacity: 1, duration: 0.2 }, "<");
  
      function revealDropdown(currentLink, currentContent) {
        const dropdownValue = currentLink.attr("data-dropdown");
        const targetDropdown = $(
          `.nav__menu-dp-content[data-dropdown="${dropdownValue}"]`
        );
  
        dropdownWrap.css("display", "flex");
        showDropdown.restart();
  
        gsap.set(menuArrow, {
          width: currentLink.outerWidth(),
          x: currentLink.offset().left
        });
        gsap.set(menuBG, {
          width: currentContent.outerWidth(),
          height: currentContent.outerHeight(),
          x: "-100px"
        });
        gsap.set(content, {
          opacity: 0
        });
        gsap.set(currentContent, {
          opacity: 1,
          x: "0em"
        });
  
        gsap.set(targetDropdown, {
          opacity: 1
        });
      }
  
      function switchDropdown(currentLink, previousContent, currentContent) {
        const dropdownValue = currentLink.attr("data-dropdown");
        const targetDropdown = $(
          `.nav__menu-dp-content[data-dropdown="${dropdownValue}"]`
        );
  
        gsap.to(menuArrow, {
          width: currentLink.outerWidth(),
          x: currentLink.offset().left
        });
        gsap.to(menuBG, {
          width: currentContent.outerWidth(),
          height: currentContent.outerHeight()
        });
  
        let moveDistance = 10;
        if (currentContent.index() < previousContent.index()) {
          moveDistance = moveDistance * -1;
        }
        gsap.fromTo(
          previousContent,
          { opacity: 1, x: "0em" },
          {
            opacity: 0,
            x: moveDistance * -1 + "em",
            duration: 0.3
          }
        );
        gsap.fromTo(
          currentContent,
          { opacity: 0, x: moveDistance + "em" },
          {
            opacity: 1,
            x: "0em",
            duration: 0.3
          }
        );
  
        // Assuming targetDropdown needs similar animation
        gsap.fromTo(
          targetDropdown,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3
          }
        );
      }
  
      // Link Hover In
      menuLink.on("mouseenter", function () {
        // Find the corresponding content based on the data-dropdown attribute
        let dropdownValue = $(this).attr("data-dropdown");
        let currentContent = content.filter(`[data-dropdown="${dropdownValue}"]`);
  
        // Remove the active class from the previous links and contents
        let previousLink = menuLink.filter(".active");
        let previousContent = content.filter(".active");
  
        // Check the previous link and current link
        if (previousLink.length === 0) {
          $(this).addClass("active");
          currentContent.addClass("active");
          revealDropdown($(this), currentContent);
        } else if (previousLink[0] !== this) {
          previousLink.removeClass("active");
          previousContent.removeClass("active");
          $(this).addClass("active");
          currentContent.addClass("active");
          switchDropdown($(this), previousContent, currentContent);
        }
      });
  
      // Detect inner links and close the dropdown when hovered
      $(".nav__menu-dp-wrap [data-link='innerLink']").on(
        "mouseenter",
        function () {
          showDropdown.reverse();
        }
      );
  
      // Menu Hover Out
      $(".nav__menu-dp-wrap").on("mouseleave", function () {
        showDropdown.reverse();
      });
  
      //end of DOM delyed script
    }
  });
  