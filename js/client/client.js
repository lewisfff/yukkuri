window.currentStep = document.querySelector('#stage span:last-of-type');

console.log(currentStep);

function keyCharPress(char) {
    console.log(char, currentStep.innerText, (char == currentStep.innerText && 'MATCH'));
    if (currentStep.innerText == char) {
        currentStep.remove();
    }
}

window.addEventListener('keypress', e => keyCharPress(e.key));
