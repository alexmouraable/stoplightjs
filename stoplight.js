/**
 * StoplightJS - Tour Guide Library
 * 
 * @author Álex dos S. Moura <alexmoura658@gmail.com>
 * @version 1.0.0
 * @description A JavaScript library for creating tour guides in Web Applications.
 * @license MIT
 * @copyright 2024 Álex dos S. Moura
 */

var stoplight = {};

stoplight.element = (function() {
    const displayProperty = "display";

    function show(element) {
        element.style[displayProperty] = "block";
    }

    function hide(element) {
        element.style[displayProperty] = "none";
    }

    return {
        show,
        hide
    };
}());

stoplight.backdrop = (function() {
    const htmlElement = document.documentElement,
        overflowyProperty = "overflowY",
        backdrop = document.querySelector(".js-stoplight-backdrop");

    function show() {
        htmlElement.style[overflowyProperty] = "hidden";
        stoplight.element.show(backdrop);
    }

    function hide() {
        stoplight.element.hide(backdrop);
        htmlElement.style[overflowyProperty] = "auto";
    }

    return {
        show,
        hide
    };
}());

stoplight.nothing = function() {};

stoplight.tour = function({
    headerHeightInPixels = 0,
    stepCssSelector = ".js-stoplight-step",
    onFinished = stoplight.nothing
}) {
    const initialStepNumber = 1,
        initialStep = getStepByNumber(initialStepNumber),
        stepInnerCssSelector = ".js-stoplight-step-inner",
        stepContentCssSelector = ".js-stoplight-step-content",
        overlayClass = "stoplight-overlay",
        stepInnerClass = "stoplight-step__inner",
        stepContentClass = "stoplight-step__content";

    let currentStepNumber = initialStepNumber,
        currentStep = initialStep;

    function start() {
        stoplight.backdrop.show();
        showStep(initialStep);
    }

    function finish() {
        hideStep(currentStep);
        stoplight.backdrop.hide();
        onFinished();
    }

    function nextStep() {
        hideStep(currentStep);

        currentStepNumber += 1;
        currentStep = getStepByNumber(currentStepNumber);

        showStep(currentStep);
    }

    function previousStep() {
        hideStep(currentStep);

        currentStepNumber -= 1;
        currentStep = getStepByNumber(currentStepNumber);

        showStep(currentStep);
    }

    function getStepByNumber(number) {
        const stepByNumberCssSelector = `
            ${stepCssSelector}[data-stoplight-step="${number}"]
        `;
        
        return document.querySelector(stepByNumberCssSelector);
    }

    function showStep(step) {
        const stepInner = step.querySelector(stepInnerCssSelector),
            stepContent = step.querySelector(stepContentCssSelector),
            overlay = document.createElement("div");

        overlay.className = overlayClass;
        
        stepInner.appendChild(overlay);
        stepInner.classList.add(stepInnerClass);

        stepContent.classList.add(stepContentClass);

        goToStep(step);
    }

    function hideStep(step) {
        const stepInner = step.querySelector(stepInnerCssSelector),
            stepContent = step.querySelector(stepContentCssSelector),
            overlay = step.querySelector(`.${overlayClass}`);

        overlay.remove();

        stepInner.classList.remove(stepInnerClass);

        stepContent.classList.remove(stepContentClass);
    }

    function goToStep(step) {
        const position = step.offsetTop - headerHeightInPixels;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });
    }

    document.querySelectorAll(".js-stoplight-start-tour-button")
        .forEach(startTourButton => {
            startTourButton.addEventListener("click", start);
        });

    document.querySelectorAll(".js-stoplight-next-step-button")
        .forEach(nextStepButton => {
            nextStepButton.addEventListener("click", nextStep);
        });

    document.querySelectorAll(".js-stoplight-previous-step-button")
        .forEach(previousStepButton => {
            previousStepButton.addEventListener("click", previousStep);
        });

    document.querySelectorAll(".js-stoplight-finish-tour-button")
        .forEach(finishTourButton => {
            finishTourButton.addEventListener("click", finish);
        });
};