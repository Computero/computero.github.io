// script.js
window.onload = function() {
    const bg = document.getElementById('background');
    bg.height = bg.height * .95;
    bg.width = bg.width * .95;
    const img1 = document.getElementById('image1');
    const img2 = document.getElementById('image2');
    const img3 = document.getElementById('image3');
    const img4 = document.getElementById('image4');
    const images = [img2, img3, img4];
    img2.height = 45;
    img2.width = 45;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');


    // Set canvas size to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let clickPositions = [];
    let currentImg = img1;
    let firstImgPos = null;
    let prevMousePos = null;
    let imageFlipped = false;
    let lastFlipPos = null;
    let flipThreshold = 50;
    let holdTimer = null;
    let holdPos = null;
    let holdFlag = false;

    function getRandomImage() {
        return images[Math.floor(Math.random() * images.length)];
    }

    bg.onload = function() {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }

    img1.onload = function() {
        ctx.drawImage(img1, 0, 0, img1.width, img1.height);
    }

    document.onmousemove = function(e) {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        // Draw image at each click position
        for (let pos of clickPositions) {
            if (pos.flip) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(pos.img, -(pos.x - pos.img.width / 2), pos.y - pos.img.height / 2, -pos.img.width, pos.img.height);
                ctx.restore();
            } else {
                ctx.drawImage(pos.img, pos.x - pos.img.width / 2, pos.y - pos.img.height / 2, pos.img.width, pos.img.height);
            }
        }
    
        // Draw first image if it exists
        if (firstImgPos) {
            if (firstImgPos.flip) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(img1, -(firstImgPos.x - img1.width / 2), firstImgPos.y - img1.height / 2, -img1.width, img1.height);
                ctx.restore();
            } else {
                ctx.drawImage(img1, firstImgPos.x - img1.width / 2, firstImgPos.y - img1.height / 2, img1.width, img1.height);
            }
        }

        //Flip image if mouse moves past threshold
        if (lastFlipPos === null || Math.abs(e.pageX - lastFlipPos) > flipThreshold) {
            if (prevMousePos && e.pageX > prevMousePos) {
                imageFlipped = true;
            } else {
                imageFlipped = false;
            }
            lastFlipPos = e.pageX;
        }
    
        // Draw the current image under the mouse cursor
        if (prevMousePos && e.pageX > prevMousePos) {
            ctx.save();
            ctx.scale(-1, 1);
            imageFlipped = true;
            ctx.drawImage(currentImg, -(e.pageX - currentImg.width/2), e.pageY - currentImg.height / 2, -currentImg.width, currentImg.height);
            ctx.restore();
        } else {
            imageFlipped = false;
            ctx.drawImage(currentImg, e.pageX - currentImg.width / 2, e.pageY - currentImg.height / 2, currentImg.width, currentImg.height);
        }
    
        prevMousePos = e.pageX;
    }
    
    document.onclick = function(e) {
        if (holdFlag) {
            holdFlag = false;
            return;
        }
        // If clicked on first image, remove it and change cursor image back to first image
        if (firstImgPos && Math.abs(e.pageX - firstImgPos.x) < img1.width / 2 && Math.abs(e.pageY - firstImgPos.y) < img1.height / 2) {
            firstImgPos = null;
            currentImg = img1;
        } else {
            // Store click position
            if (currentImg === img1) {
                firstImgPos = {x: e.pageX, y: e.pageY, flip: imageFlipped};
            } else {
                clickPositions.push({x: e.pageX, y: e.pageY, img: currentImg, flip: imageFlipped});
            }
    
            // Change the current image
            currentImg = getRandomImage();
        }
    }

    document.onmousedown = function(e) {
        // Start the hold timer
        holdTimer = setTimeout(function() {
            // Check each image in clickPositions
            for (let i = 0; i < clickPositions.length; i++) {
                let pos = clickPositions[i];
                // Calculate the distance from the hold position to the center of the image
                let dx = holdPos.x - pos.x;
                let dy = holdPos.y - pos.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                // If the distance is less than half the width of the image, remove the image
                if (distance < pos.img.width / 2) {
                    clickPositions.splice(i, 1);
                    break;
                }
            }
            holdTimer = null;
            holdPos = null;
            holdFlag = true;
        }, 200); // Change this to increase or decrease the hold time
        holdPos = {x: e.pageX, y: e.pageY};
    };
    
    document.onmouseup = function(e) {
        // Clear the hold timer
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
            holdPos = null;
        }
    };
}