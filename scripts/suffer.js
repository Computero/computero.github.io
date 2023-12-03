window.onload = function() {
    var img = new Image();
    img.src = 'images/wateringhole.png';
    img.onload = function() {
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        var imgAspect = this.width / this.height;
        var bgWidth = viewportHeight * imgAspect;
        document.body.style.backgroundSize = bgWidth + 'px ' + viewportHeight + 'px';
        document.body.style.backgroundRepeat = 'no-repeat';
    }

    var around = document.getElementById('around');
    var textElement = document.getElementById('text');
    var aroundBlur = document.getElementById('around-blur');
    var tooltip = document.getElementById('tooltip');

    aroundBlur.style.display = 'block';
    tooltip.style.display = 'block';

    // Disable context menu (right click)
    around.oncontextmenu = function(e) {
        e.preventDefault();
    };

    // Disable dragging
    around.ondragstart = function(e) {
        e.preventDefault();
    };

    around.onmouseover = function() {
        aroundBlur.style.opacity = '1';
        tooltip.style.opacity = '1';
    };

    around.onmouseout = function() {
        aroundBlur.style.opacity = '0';
        tooltip.style.opacity = '0';
    };

    around.onmousemove = function(e) {
        tooltip.style.left = e.pageX + 'px';
        tooltip.style.top = e.pageY + 'px';
    };

    around.addEventListener('mousedown', handleMouseDown);
    around.addEventListener('mouseup', handleMouseUp);
    around.addEventListener('mouseleave', handleMouseUp);
    
    function handleMouseDown() {
        around.style.transform = 'translate(-50%, -50%) scale(1.2)';
        aroundBlur.style.transform = 'translate(-50%, -50%) scale(1.35)';
    }
    
    function handleMouseUp() {
        around.style.transform = 'translate(-50%, -50%) scale(1.1)';
        aroundBlur.style.transform = 'translate(-50%, -50%) scale(1.15)';
    }

    around.addEventListener('mousedown', handleMouseDown);
    around.addEventListener('mouseup', handleMouseUp);
    around.addEventListener('mouseleave', handleMouseUp);

    function handleMouseDown() {
        around.style.transform = 'translate(-50%, -50%) scale(1.2)';
        aroundBlur.style.transform = 'translate(-50%, -50%) scale(1.35)';
    }

    function handleMouseUp() {
        around.style.transform = 'translate(-50%, -50%) scale(1.1)';
        aroundBlur.style.transform = 'translate(-50%, -50%) scale(1.15)';
    }

    // Add event listeners
    around.addEventListener('click', handleClick);
    textElement.addEventListener('click', handleClick);
    let isTyping = false

    function handleClick() {
        if (isTyping) return;
        // Hide images
        around.style.display = 'none';
        aroundBlur.style.display = 'none';

        // Change background color and remove background image
        document.body.style.backgroundColor = 'black';
        document.body.style.backgroundImage = 'none';

        // Show the text element
        textElement.style.display = 'block';
        textElement.style.opacity = '1';

        // Start typing effect
        typeText(textElement.textContent);
    }

    function typeText(text) {
        let displayText = '';
        let i = 0;
        let delay = 25;

        isTyping = true;

        function type() {
            if (i < text.length) {
                let char = text[i];

                if (char === '/') {
                    let sequence = text.slice(i, i+2);

                    switch (sequence) {
                        case '/s':
                            delay = 0;
                            i += 2;
                            break;
                        case '/e':
                            delay = 100;
                            i += 2;
                            break;
                        case '/!':
                            displayText = '';
                            i += 2;
                            break;
                        case '/?':
                            textElement.addEventListener('click', () => { i += 2; type(); });
                            return;
                        case '/n':
                            displayText += '<br>';
                            i += 2;
                            break;
                        default:
                            displayText += char;
                            i++;
                            break;
                    }
                } else {
                    displayText += char;
                    i++;
                }

                textElement.innerHTML = displayText;

                setTimeout(type, delay);
            }
            else {
                isTyping = false;
            }
        }

        type();
    }
    
}
