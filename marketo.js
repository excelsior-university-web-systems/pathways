(function() {
    MktoForms2.whenReady(function(form){
        function moveCaptchaDisclaimer() {
            try {
                // Get the elements
                const captchaDisclaimer = document.querySelector('.mktoCaptchaDisclaimer');
                const buttonRow = document.querySelector('.mktoButtonRow');
                const elements = document.getElementsByClassName('mktoHtmlText');
                // Find the last mktoHtmlText element
                if (elements.length > 0) {
                    const lastElement = elements[elements.length - 1];
                    const parentElement = lastElement.closest('.mktoFormCol');
                    // Find parent mktoFormCol, then hide it
                    if (parentElement) {
                        parentElement.style.display = 'none';
                    }
                }                
                // Check if elements exist
                if (captchaDisclaimer && buttonRow) {
                    console.log('Elements found, moving captcha disclaimer');
                    // Move the captcha disclaimer element to be after the button row
                    buttonRow.parentNode.insertBefore(captchaDisclaimer, buttonRow.nextSibling);
                    // Add margin to the top of captcha disclaimer
                    captchaDisclaimer.style.marginTop = '15px';
                }
            } catch (error) {
                console.error('An error occurred in moveCaptchaDisclaimer:', error);
            }
        }
        console.log('MktoForms2 ready, calling moveCaptchaDisclaimer');
        setTimeout(moveCaptchaDisclaimer, 250); // Delay to ensure form elements are loaded
    });
})();