let timeoutId = null;
function handleClick(event) {
    const touchHand = document.getElementById('touching-hand');
    //console.log(document.querySelector("#touching-hand"));
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    touchHand.style.top = mouseY - touchHand.clientHeight*0.02 + 'px';
    touchHand.style.right = (window.innerWidth - touchHand.clientWidth*0.10 - mouseX) + 'px';
    timeoutId = setTimeout(function() {
        touchHand.style.top = '85vh';
        touchHand.style.right = '100vw';
        timeoutId = null;
    }, 900);
}

function moveLadybug() {
    const ladybug = document.getElementById('ladybug');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const ladybugWidth = ladybug.clientWidth;
    const ladybugHeight = ladybug.clientHeight;

    let x = Math.random() * (windowWidth - ladybugWidth);
    let y = Math.random() * (windowHeight - ladybugHeight);

    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;

    function animate() {
        x += dx;
        y += dy;

        if (x + ladybugWidth >= windowWidth || x <= 0) {
            dx = -dx;
        }

        if (y + ladybugHeight >= windowHeight || y <= 0) {
            dy = -dy;
        }

        const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        ladybug.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

        requestAnimationFrame(animate);
    }

    animate();
}

moveLadybug();
//console.log(map);

document.addEventListener('click', handleClick);