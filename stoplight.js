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

stoplight.backdrop = (function() {
    const htmlElement = document.documentElement,
        bodyElement = document.body,
        backdrop = document.createElement("div"),
        backdropClassName = "stoplight-backdrop",
        backdropVisibleClassName = `${backdropClassName}--visible`;

    backdrop.className = backdropClassName;

    bodyElement.appendChild(backdrop);

    function show() {
        htmlElement.style.overflowY = "hidden";

        backdrop.classList.add(backdropVisibleClassName);
    }

    function hide() {
        htmlElement.style.overflowY = "auto";

        backdrop.classList.remove(backdropVisibleClassName);
    }

    return {
        show,
        hide
    };
}());

stoplight.tour = function(headerHeightInPixels = 0) {
    const initialStepContainerNumber = 1,
        stepContainerCssSelector = ".js-stoplight-step-container",
        initialStepContainer = getStepContainerByNumber(initialStepContainerNumber),
        stepClassName = "stoplight-step",
        overlayClassName = "stoplight-overlay",
        dialogVisibleClassName = "stoplight-dialog--visible",
        stepCount = document.querySelectorAll(stepContainerCssSelector).length;

    let currentStepContainerNumber = initialStepContainerNumber,
        currentStepContainer = initialStepContainer;

    function start() {
        stoplight.backdrop.show();
        showStepFromContainer(currentStepContainer);
    }

    function finish() {
        hideStepFromContainer(currentStepContainer);
        stoplight.backdrop.hide();
    }

    function nextStep() {
        hideStepFromContainer(currentStepContainer);

        currentStepContainerNumber += 1;
        currentStepContainer = getStepContainerByNumber(currentStepContainerNumber);

        showStepFromContainer(currentStepContainer);
    }

    function previousStep() {
        hideStepFromContainer(currentStepContainer);

        currentStepContainerNumber -= 1;
        currentStepContainer = getStepContainerByNumber(currentStepContainerNumber);

        showStepFromContainer(currentStepContainer);
    }

    function getStepContainerByNumber(number) {
        const stepContainerByNumberCssSelector = `
            ${stepContainerCssSelector}[data-stoplight-step="${number}"]
        `;
        
        return document.querySelector(stepContainerByNumberCssSelector);
    }

    function showStepFromContainer(stepContainer) {
        const step = getStepFromContainer(stepContainer),
            overlay = document.createElement("div"),
            dialog = getDialogFromContainer(stepContainer);

        overlay.className = overlayClassName;

        step.appendChild(overlay);
        step.classList.add(stepClassName);

        dialog.classList.add(dialogVisibleClassName);

        goToStep(step);
    }

    function hideStepFromContainer(stepContainer) {
        const step = getStepFromContainer(stepContainer),
            overlay = step.querySelector(`.${overlayClassName}`),
            dialog = getDialogFromContainer(stepContainer);

        overlay.remove();

        step.classList.remove(stepClassName);

        dialog.classList.remove(dialogVisibleClassName);
    }
    
    function getStepFromContainer(stepContainer) {
        return stepContainer.querySelector(".js-stoplight-step");
    }

    function getDialogFromContainer(stepContainer) {
        return stepContainer.querySelector(".js-stoplight-dialog");
    }

    function goToStep(step) {
        const position = step.offsetTop - headerHeightInPixels;

        window.scrollTo({
            top: position,
            behavior: "smooth"
        });
    }

    return {
        start,
        finish,
        nextStep,
        previousStep,
        currentStep: initialStepContainerNumber,
        stepCount
    };
};