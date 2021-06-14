var talk = {
  slides: function() {
    return(
      Array.from(document.getElementsByClassName("talk-slide"))
    );
  },

  activeSlide: function() {
    return(
      this.slides().find(function(slide) {
        return(
          !slide.className.match("talk-hidden-content")
        );
      })
    );
  },

  numberOfSlides: function() {
    return(
      this.slides().length
    );
  },

  numberOfActiveSlide: 1,

  displaySlide: function(slide) {
    slide.classList.remove("talk-hidden-content");
  },

  hideSlide: function(slide) {
    slide.classList.add("talk-hidden-content");
  },

  displayNumberOfSlides: function() {
    var numberOfSlides = document.getElementById("js-talk-number-of-slides");

    numberOfSlides.href = document.location.href.split("?")[0].split("#")[0] + "?slide=" + this.numberOfActiveSlide;
    numberOfSlides.textContent = "(" + this.numberOfActiveSlide + "/" + this.numberOfSlides() + ")";
  },

  expandSlides: function() {
    document.getElementsByTagName("header")[0].classList.add("talk-hidden-content");
    document.getElementsByClassName("talk-navigation")[0].classList.add("talk-hidden-content");
    document.getElementsByTagName("footer")[0].classList.add("talk-hidden-content");
  },

  reduceSlides: function() {
    document.getElementsByTagName("header")[0].classList.remove("talk-hidden-content");
    document.getElementsByClassName("talk-navigation")[0].classList.remove("talk-hidden-content");
    document.getElementsByTagName("footer")[0].classList.remove("talk-hidden-content");
  },

  previousSlide: function() {
    var activeSlide = this.activeSlide();
    var previousSlide = activeSlide.previousElementSibling;

    if (previousSlide) {
      this.hideSlide(activeSlide);
      this.displaySlide(previousSlide);
      this.numberOfActiveSlide -= 1;
      this.displayNumberOfSlides();
    }
  },

  nextSlide: function() {
    var activeSlide = this.activeSlide();
    var nextSlide = activeSlide.nextElementSibling;

    if (nextSlide) {
      this.hideSlide(activeSlide);
      this.displaySlide(nextSlide);
      this.numberOfActiveSlide += 1;
      this.displayNumberOfSlides();
    }
  },

  start: function() {
    var numberOfActiveSlideFromParams = parseInt((new URL(document.location)).searchParams.get("slide"));
    if (!Number.isNaN(numberOfActiveSlideFromParams) &&
        numberOfActiveSlideFromParams > 0 &&
        numberOfActiveSlideFromParams <= this.numberOfSlides()) {
      this.numberOfActiveSlide = numberOfActiveSlideFromParams;
    }

    var slidesToHide = this.slides();
    slidesToHide.splice(this.numberOfActiveSlide - 1, 1);
    slidesToHide.forEach(function(slide) {
      this.hideSlide(slide);
    }.bind(this));

    this.displayNumberOfSlides();

    var previousOnKeyUp = document.onkeyup;
    document.onkeyup = function(keyboardEvent) {
      if (previousOnKeyUp) {
        previousOnKeyUp(keyboardEvent);
      }

      switch(keyboardEvent.key) {
        case "e":
          keyboardEvent.preventDefault();
          this.expandSlides();
          break;
        case "r":
          keyboardEvent.preventDefault();
          this.reduceSlides();
          break;
        case "j":
        case "l":
        case "PageDown":
        case "ArrowRight":
          keyboardEvent.preventDefault();
          this.nextSlide();
          break;
        case "k":
        case "h":
        case "PageUp":
        case "ArrowLeft":
          keyboardEvent.preventDefault();
          this.previousSlide();
          break;
      }
    }.bind(this);

    document.getElementById("js-talk-previous-slide").onclick = function() {
      this.previousSlide();
    }.bind(this);

    document.getElementById("js-talk-next-slide").onclick = function() {
      this.nextSlide();
    }.bind(this);
  }
}

talk.start();
