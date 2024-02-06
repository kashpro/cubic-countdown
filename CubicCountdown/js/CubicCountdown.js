class Cubic {
  /* Class public methods */
  change = (newOptions) => {
    this.userOptions = newOptions;
    this.oldElement = this.element;
    this.parseOptions(this.userOptions);
    this.modifyTimer();
    this.mountTimer();
  }
  start = () => {
    if (!this.running) {this.tick1000 = setInterval(this.tick1000Handler.bind(this), 1000); this.running = true;}
  }
  stop = () => {
    if (this.running) {clearInterval(this.tick1000); this.running = false;}
  }
  remove = () => {
    if (!this.removed) {this.element.removeChild(this.timer); this.removed = true;}
  }
  restore = () => {
    if (this.removed) {this.element.appendChild(this.timer); this.removed = false;}
  }
  hide = () => {
    this.timer.style.display = "none";
  }
  show = () => {
    this.timer.style.display = "flex";
  }
  getTime = () => {
    const result = {};
    for (let key in this.times) {
      result[key] = this.times[key];
    }
    return result;
  }

  /* Class variables */
  now = new Date();
  toTimeDefault = this.now.setDate(this.now.getDate() + 1);
  options = {
    element: "",
    toTime: Math.floor( (new Date(this.toTimeDefault).getTime()) / 1000 ),
    cubeSize: 150,
    cubeSideMargin: 20,
    shadowIntensity: 100,
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    daysLabel: "days",
    hoursLabel: "hours",
    minutesLabel: "minutes",
    secondsLabel: "seconds",
    cssClass: "zzcubic",
    autoStart: true,
    labelTextSize: 20,
    labelOnTop: false,
    labelOffset: 40,
    cubeTextSize: 100,
    leadingZero: true,
    colonSize: 20,
    animationPreset: 0,
    animationDelay: 50,
    continuousAnimation: false,
    colonAnimation: true,
    shadowColor: "#414141",
    mobileFirst: false,
    onFinish: () => {},
    onTick: () => {},
  };
  onFinish = () => {};
  onTick = () => {};
  cubeSettings = { dd: {}, hh: {}, mm: {}, ss: {}, };
  faceSettings = { currt: {}, currs: {}, currl: {}, nextt: {}, nexts: {}, nextl: {}, };
  divBlank = document.createElement("div");
  spanBlank = document.createElement("span");
  timer = this.divBlank.cloneNode(false);
  boxes = {};
  cubes = {};
  labels = {};
  colons = {};
  faces = {};
  settings = {
    mainAnimationStyle: "0.48s cubic-bezier(.77,0,.18,1)",
    colonAnimationStyle: "0.3s cubic-bezier(.77,0,.18,1) 0.1s",
    perspectiveFactor: 3,
    boxElement: "__box",
    cubeElement: "__cube",
    colonElement: "__colon",
    labelElement: "__label",
    faceElement: "__face",
    dotElement: "__dot",
    warningPrefix: "Cubic Countdown: ",
    warningIncorrectSelector: "Incorrect selector",
    warningElementNotFound: "Element not found",
  };
  element = null;
  oldElement = null;
  times = {dd: null, hh: null, mm: null, ss: null,};
  oldTimes = {dd: null, hh: null, mm: null, ss: null,};
  nextTimes = {dd: null, hh: null, mm: null, ss: null,};
  difference = null;
  rotatePresets = {
    0: "1,0,0,-90deg",
    1: "1,0,0,90deg",
    2: "0,1,0,90deg",
    3: "0,1,0,-90deg",
  };
  running = false;
  removed = false;
  tick1000 = null;
  tick500 = null;
  breakpoint = null;
  oldBreakpoint = null;
  responsiveOptions = null;
  userOptions = null;

  /* Class constructor */
  constructor(userOptions) {
    this.userOptions = userOptions;
    this.init();
    this.parseOptions(this.userOptions);
    this.modifyTimer();
    this.mountTimer();
    this.#calcTimes();
    for (let key in this.faces) {this.faces[key].currt.children[0].textContent = this.times[key];}
    if (!this.running && this.options.autoStart) {this.tick1000 = setInterval(this.tick1000Handler.bind(this), 1000); this.running = true;}
  }

  /* Class private methods */
  init() {
    this.timer.style.display = "flex";
    this.timer.style.alignSelf = "center";
    for (let key in this.cubeSettings) {
      this.boxes[key] = this.divBlank.cloneNode(false);
      this.boxes[key].style.display = "flex";
      this.boxes[key].style.flexWrap = "wrap";
      this.boxes[key].style.flexShrink = 0;
      this.labels[key] = this.spanBlank.cloneNode(false);
      this.labels[key].style.display = "flex";
      this.labels[key].style.justifyContent = "center";
      this.boxes[key].insertBefore(this.labels[key], this.boxes[key].firstChild);
      this.colons[key] = this.divBlank.cloneNode(false);
      this.colons[key].style.order = 2;
      this.colons[key].style.display = "flex";
      this.colons[key].style.flexDirection = "column";
      this.colons[key].style.justifyContent = "space-around";
      this.colons[key].style.transition = "opacity " + this.settings.colonAnimationStyle;
      this.colons[key].appendChild(this.divBlank.cloneNode(false));
      this.colons[key].appendChild(this.divBlank.cloneNode(false));
      this.boxes[key].insertBefore(this.colons[key], this.boxes[key].firstChild);
      this.cubes[key] = this.divBlank.cloneNode(false);
      this.cubes[key].style.order = 1;
      this.cubes[key].style.transformStyle = "preserve-3d";
      this.boxes[key].insertBefore(this.cubes[key], this.boxes[key].firstChild);
      this.faces[key] = {};
      for (let faceKey in this.faceSettings) {
        this.faces[key][faceKey] = this.divBlank.cloneNode(false);
        this.faces[key][faceKey].style.display = "flex";
        this.faces[key][faceKey].style.justifyContent = "center";
        this.faces[key][faceKey].style.alignItems = "center";
        this.faces[key][faceKey].style.position = "absolute";
        this.faces[key][faceKey].style.borderRadius = "1px";
        if (faceKey == "currt" || faceKey == "nextt") {this.faces[key][faceKey].appendChild(this.spanBlank.cloneNode(false));}
        this.cubes[key].appendChild(this.faces[key][faceKey]);
      }
      this.timer.appendChild(this.boxes[key]);
    }
    let throttled = false;
    const delay = 200;
    let resizeTimeout = null;
    window.addEventListener("resize", () => {
      if (!throttled) {
        resizeAction();
        throttled = true;
        setTimeout(function() {
          throttled = false;
        }, delay); 
      }
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeAction.bind(this), delay);
    });

    const resizeAction = () => {
      this.oldElement = this.element;
      this.parseOptions(this.userOptions);
      this.modifyTimer();
      this.mountTimer();
    }
  }
  parseOptions(userOptions) {
    if (typeof userOptions !== "object") {return false;}
    for (let key in userOptions) {
      if (this.options[key] !== undefined && key !== "toTime") {this.options[key] = this.parseValue(userOptions[key], this.options[key]);}
      if (key === "toTime") {this.options[key] = this.parseDateValue(userOptions[key], this.options[key]);}
    }
    if (userOptions.mobileFirst !== undefined) {this.options.mobileFirst = Boolean(userOptions.mobileFirst);}
    this.breakpoint = undefined;
    this.breakpoint = this.selectBreakpoint(userOptions.responsive, this.options.mobileFirst);
    if (this.breakpoint !== undefined) {
      this.responsiveOptions = userOptions.responsive[this.breakpoint];
      if (typeof this.responsiveOptions === "object") {
        if (typeof this.responsiveOptions.options === "object") {
          for (let key in this.responsiveOptions.options ) {
            if (this.options[key] !== undefined && key !== "toTime") {
              this.options[key] = this.parseValue(this.responsiveOptions.options[key], this.options[key]);
            }
            if (key === "toTime") {
              this.options[key] = this.parseDateValue(this.responsiveOptions.options[key], this.options[key]);
            }
          }
        }
      }
    }
    this.options.cubeSize = Math.floor(this.options.cubeSize / 2) * 2;
    this.options.animationPreset = Math.min(this.options.animationPreset, 3);
    this.options.animationDelay = Math.min(this.options.animationDelay, 100);
    this.options.shadowIntensity = Math.min(this.options.shadowIntensity, 100);
    if (typeof this.options.onFinish !== "function") {this.options.onFinish = () => {};}
    this.onFinish = this.options.onFinish;
    if (typeof this.options.onTick !== "function") {this.options.onTick = () => {};}
    this.onTick = this.options.onTick;
  }
  parseValue(userValue, value) {
    switch(typeof value) {
      case "number": {
        userValue = parseInt(userValue, 10);
        if (userValue >= 0) {return userValue;}
        return value;
      }
      case "boolean": {
        return Boolean(userValue);
      }
      case "string": {
        return userValue;
      }
      default: {
        return userValue;
      }
    }
  }
  parseDateValue(userValue, value) {
    userValue = parseInt(new Date(userValue).getTime(), 10);
    if (userValue >= 0) {return Math.floor(userValue/1000);}
    return Math.floor(value/1000);
  }

  selectBreakpoint(responsiveArray, mobileFirst) {
    if (Array.isArray(responsiveArray)) {
      const viewportWidth = window.innerWidth;
      let chosenBreakpoint;
      let chosenDiff = Infinity;
      let currentDiff;
      for (let i = 0; i < responsiveArray.length; i++) {
        if (!mobileFirst) {
          currentDiff = parseInt(responsiveArray[i].breakpoint, 10) - viewportWidth;
        } else {
          currentDiff = viewportWidth - parseInt(responsiveArray[i].breakpoint, 10);
        }
        if (currentDiff >= 0 && currentDiff < chosenDiff) {
          chosenDiff = currentDiff;
          chosenBreakpoint = i;
        }
      }
      return chosenBreakpoint;
    }
    return;
  }


  modifyTimer() {
    this.cubeSettings.dd.labelText = this.options.daysLabel;
    this.cubeSettings.hh.labelText = this.options.hoursLabel;
    this.cubeSettings.mm.labelText = this.options.minutesLabel;
    this.cubeSettings.ss.labelText = this.options.secondsLabel;
    this.faceSettings = {
      currt: {
        0: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        1: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        2: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        3: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
      },
      currs: {
        0: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
          shadow: "linear-gradient(to bottom, transparent, " + this.options.shadowColor + ")",
        },
        1: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
          shadow: "linear-gradient(to top, transparent, " + this.options.shadowColor + ")",
        },
        2: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
          shadow: "linear-gradient(to right, transparent, " + this.options.shadowColor + ")",
        },
        3: {
          transform: "translate3d(0px,0px,0px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
          shadow: "linear-gradient(to left, transparent, " + this.options.shadowColor + ")",
        },
      },
      currl: {
        0: {
          transform: "translate3d(0px,0px,-1px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        1: {
          transform: "translate3d(0px,0px,-1px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        2: {
          transform: "translate3d(0px,0px,-1px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
        3: {
          transform: "translate3d(0px,0px,-1px) rotate3d(0,0,0,0deg)",
          transformOrigin: "50% 50%",
        },
      },
      nextt: {
        0: {
          transform: "translate3d(0px," + (-this.options.cubeSize) + "px,0px) rotate3d(1,0,0,90deg)",
          transformOrigin: "0% 100%",
        },
        1: {
          transform: "translate3d(0px," + (this.options.cubeSize) + "px,0px) rotate3d(1,0,0,-90deg)",
          transformOrigin: "0% 0%",
        },
        2: {
          transform: "translate3d(" + (-this.options.cubeSize) + "px,0px,0px) rotate3d(0,1,0,-90deg)",
          transformOrigin: "100% 0%",
        },
        3: {
          transform: "translate3d(" + (this.options.cubeSize) + "px,0px,0px) rotate3d(0,1,0,90deg)",
          transformOrigin: "0% 0%",
        },
      },
      nexts: {
        0: {
          transform: "translate3d(0px," + (-this.options.cubeSize) + "px,0px) rotate3d(1,0,0,90deg)",
          transformOrigin: "0% 100%",
          shadow: "linear-gradient(to top, transparent, " + this.options.shadowColor + ")",
        },
        1: {
          transform: "translate3d(0px," + (this.options.cubeSize) + "px,0px) rotate3d(1,0,0,-90deg)",
          transformOrigin: "0% 0%",
          shadow: "linear-gradient(to bottom, transparent, " + this.options.shadowColor + ")",
        },
        2: {
          transform: "translate3d(" + (-this.options.cubeSize) + "px,0px,0px) rotate3d(0,1,0,-90deg)",
          transformOrigin: "100% 0%",
          hadow: "linear-gradient(to left, transparent, " + this.options.shadowColor + ")",
        },
        3: {
          transform: "translate3d(" + (this.options.cubeSize) + "px,0px,0px) rotate3d(0,1,0,90deg)",
          transformOrigin: "0% 0%",
          shadow: "linear-gradient(to right, transparent, " + this.options.shadowColor + ")",
        },
      },
      nextl: {
        0: {
          transform: "translate3d(0px," + (-(this.options.cubeSize-1)) + "px,-1px) rotate3d(1,0,0,90deg)",
          transformOrigin: "0% 100%",
        },
        1: {
          transform: "translate3d(0px," + (this.options.cubeSize-1) + "px,-1px) rotate3d(1,0,0,-90deg)",
          transformOrigin: "0% 0%",
        },
        2: {
          transform: "translate3d(" + (-(this.options.cubeSize-1)) + "px,0px,-1px) rotate3d(0,1,0,-90deg)",
          transformOrigin: "100% 0%",
        },
        3: {
          transform: "translate3d(" + (this.options.cubeSize-1) + "px,0px,-1px) rotate3d(0,1,0,90deg)",
          transformOrigin: "0% 0%",
        },
      },
    };
    this.timer.classList.add(this.options.cssClass);
    for (let key in this.cubeSettings) {
      this.boxes[key].classList.add(this.options.cssClass + this.settings.boxElement);
      this.boxes[key].style.width = (this.options.cubeSize + 2 * this.options.cubeSideMargin + this.options.colonSize) + "px";
      this.labels[key].classList.add(this.options.cssClass + this.settings.labelElement);
      this.labels[key].style.fontSize = this.options.labelTextSize + "px";
      this.labels[key].style.width = this.options.cubeSize + "px";
      this.labels[key].style.marginLeft = this.options.cubeSideMargin + "px";
      this.labels[key].textContent = this.cubeSettings[key].labelText;
      if (this.options.labelOnTop) {
        this.labels[key].style.marginTop = 0;
        this.labels[key].style.marginBottom = this.options.labelOffset + "px";
        this.labels[key].style.order = 0;
      } else {
        this.labels[key].style.marginTop = this.options.labelOffset + "px";
        this.labels[key].style.marginBottom = 0;
        this.labels[key].style.order = 3;
      }
      this.colons[key].classList.add(this.options.cssClass + this.settings.colonElement);
      this.colons[key].style.height = this.options.cubeSize;
      this.colons[key].children[0].classList.add(this.options.cssClass + this.settings.dotElement);
      this.colons[key].children[0].style.width = Math.floor(this.options.colonSize) + "px";
      this.colons[key].children[0].style.height = Math.floor(this.options.colonSize) + "px";
      this.colons[key].children[1].classList.add(this.options.cssClass + this.settings.dotElement);
      this.colons[key].children[1].style.width = Math.floor(this.options.colonSize) + "px";
      this.colons[key].children[1].style.height = Math.floor(this.options.colonSize) + "px";
      this.cubes[key].classList.add(this.options.cssClass + this.settings.cubeElement);
      this.cubes[key].style.width = this.options.cubeSize + "px";
      this.cubes[key].style.height = this.options.cubeSize + "px";
      this.cubes[key].style.fontSize = this.options.cubeTextSize + "px";
      this.cubes[key].style.marginLeft = this.options.cubeSideMargin + "px";
      this.cubes[key].style.marginRight = this.options.cubeSideMargin + "px";
      this.cubes[key].style.transform = "perspective(" + (this.options.cubeSize * this.settings.perspectiveFactor) + "px) translate3d(0,0," + (-this.options.cubeSize/2) + "px)"/* + oldCubeRotate*/;
      this.cubes[key].style.transformOrigin = "center center " + (-this.options.cubeSize/2) + "px";
      for (let faceKey in this.faceSettings) {
        this.faces[key][faceKey].classList.add(this.options.cssClass + this.settings.faceElement);
        this.faces[key][faceKey].style.width = this.options.cubeSize + "px";
        this.faces[key][faceKey].style.height = this.options.cubeSize + "px";
        this.faces[key][faceKey].style.transform = this.faceSettings[faceKey][this.options.animationPreset].transform;
        this.faces[key][faceKey].style.transformOrigin = this.faceSettings[faceKey][this.options.animationPreset].transformOrigin;
        if (faceKey === "currs" || faceKey === "nexts") {
          this.faces[key][faceKey].style.background = this.faceSettings[faceKey][this.options.animationPreset].shadow;
          this.faces[key][faceKey].style.opacity = this.options.shadowIntensity/100;
        }
        if (faceKey === "currs") {
          this.faces[key][faceKey].style.opacity = 0;
        }
      }
    }
    if (this.options.showDays) {this.boxes.dd.style.display = "flex";} else {this.boxes.dd.style.display = "none";}
    if (this.options.showHours) {this.boxes.hh.style.display = "flex";} else {this.boxes.hh.style.display = "none";}
    if (this.options.showMinutes) {this.boxes.mm.style.display = "flex";} else {this.boxes.mm.style.display = "none";}
    if (this.options.showSeconds) {this.boxes.ss.style.display = "flex";} else {this.boxes.ss.style.display = "none";}
    for (let key in this.colons) {
      this.colons[key].style.display = "flex";
    }
    for (let key in this.boxes) {
      let nextElement = this.boxes[key].nextElementSibling;
      let status = false;
      while (nextElement) {
        if (nextElement.style.display !== "none") {
          status = true;
          break;
        }
        nextElement = nextElement.nextElementSibling;
      }
      if (!status) {
        this.colons[key].style.display = "none";
        this.boxes[key].style.width = (this.options.cubeSize + 2 * this.options.cubeSideMargin) + "px";
      }
    }
  }
  mountTimer() {
    try {this.element = document.querySelector(this.options.element);} catch(err) {console.warn(this.settings.warningPrefix + this.settings.warningIncorrectSelector);}
    if (!this.element) {console.warn(this.settings.warningPrefix + this.settings.warningElementNotFound);}
    if (this.element && (this.element !== this.oldElement)) {
      try {this.oldElement.removeChild(this.timer);} catch(err) {}
      this.element.appendChild(this.timer);
    }
  }
  #calcTimes() {
    const now = Math.floor(Date.now()/1000);
    const difference = Math.abs(this.options.toTime - now);
    for (let key in this.times) {
      if (key === "dd") {this.times[key] = difference/3600/24;}
      if (key === "hh") {this.times[key] = difference/3600%24;}
      if (key === "mm") {this.times[key] = difference/60%60;}
      if (key === "ss") {this.times[key] = difference%60;}
      this.times[key] = String(Math.floor(this.times[key]));
      if (this.options.leadingZero && this.times[key] < 10) {this.times[key] = "0" + this.times[key];}
    }
  }
  tick1000Handler() {
    this.onTick();
    const rotateStyle0 = "perspective(" + (this.options.cubeSize * this.settings.perspectiveFactor) + "px) translate3d(0,0," + (-this.options.cubeSize/2) + "px) rotate3d(0,0,0,0deg)";
    const rotateStyle1 = "perspective(" + (this.options.cubeSize * this.settings.perspectiveFactor) + "px) translate3d(0,0," + (-this.options.cubeSize/2) + "px) rotate3d(" + this.rotatePresets[this.options.animationPreset] + ")";
    const transitionTransformStyle = "transform " + this.settings.mainAnimationStyle;
    const transitionOpacityStyle = "opacity " + this.settings.mainAnimationStyle;
    for (let key in this.times) {
      this.oldTimes[key] = this.times[key];
    }
    this.#calcTimes();
    const now = Math.floor(Date.now()/1000);
    this.difference = Math.abs(this.options.toTime - now);
    for (let key in this.cubes) {
      let delay;
      if (key === "ss") {delay = 0;}
      if (key === "mm") {delay = this.options.animationDelay;}
      if (key === "hh") {delay = this.options.animationDelay * 2;}
      if (key === "dd") {delay = this.options.animationDelay * 3;}
      if (this.options.continuousAnimation || (this.times[key] != this.oldTimes[key])) {
        const timeout = setTimeout((key) => {
          this.faces[key].nextt.children[0].textContent = this.times[key];
          this.cubes[key].style.transition = transitionTransformStyle;
          this.cubes[key].style.transform = rotateStyle1;
          this.faces[key].currs.style.transition = transitionOpacityStyle;
          this.faces[key].currs.style.opacity = this.options.shadowIntensity/100;
          this.faces[key].nexts.style.transition = transitionOpacityStyle;
          this.faces[key].nexts.style.opacity = 0;
        }, delay, key);
      }
      if (this.options.colonAnimation) {this.colons[key].style.opacity = 0;}
    }
    this.tick500 = setTimeout(()=> {
      for (let key in this.cubes) {
        let delay;
        if (key === "ss") {delay = 0;}
        if (key === "mm") {delay = this.options.animationDelay;}
        if (key === "hh") {delay = this.options.animationDelay * 2;}
        if (key === "dd") {delay = this.options.animationDelay * 3;}
        if (this.options.continuousAnimation || (this.times[key] != this.oldTimes[key])) {
          const timeout = setTimeout((key) => {
            this.faces[key].currt.children[0].textContent = this.times[key];
            this.cubes[key].style.transition = "";
            this.cubes[key].style.transform = rotateStyle0;
            this.faces[key].currs.style.transition ="";
            this.faces[key].currs.style.opacity = 0;
            this.faces[key].nexts.style.transition = "";
            this.faces[key].nexts.style.opacity = this.options.shadowIntensity/100;}, delay, key);
        }
        if (this.options.colonAnimation) {this.colons[key].style.opacity = 1;}
      }
      if (this.difference === 0) {setTimeout(this.onFinish.bind(this), this.options.animationDelay * 3);}
    }, 520);

  }
}
































