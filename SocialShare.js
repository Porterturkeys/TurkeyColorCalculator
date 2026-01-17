document.addEventListener("DOMContentLoaded", function() {
    const shareContainer = document.createElement('div');
    shareContainer.style.textAlign = 'center'; // Center the entire container

    // Add the header text and share buttons
    shareContainer.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 10px;">Share This Calculator:</p>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://porters-rare-heritage-turkeys.neocities.org/TurkeyColorCalculator" target="_blank" style="margin: 30px; display: inline-block; vertical-align: middle;">
            <img src="https://porters-rare-heritage-turkeys.neocities.org/Pictures/FBLogo.jpg" alt="Share on Facebook" style="width: 30px; height: 30px;">
        </a>
       &nbsp;
        <a href="https://x.com/intent/tweet?url=https://porters-rare-heritage-turkeys.neocities.org/TurkeyColorCalculator&text=Check%20out%20this%20awesome%20Turkey%20Color%20Calculator!" target="_blank" style="margin: 30px; display: inline-block; vertical-align: middle;">
            <img src="https://porters-rare-heritage-turkeys.neocities.org/Pictures/logo%20x.jpg" alt="Share on X" style="width: 29px; height: 29px;">
        </a>
       &nbsp;
        <a href="https://pinterest.com/pin/create/button/?url=https://porters-rare-heritage-turkeys.neocities.org/TurkeyColorCalculator&media=https://porters-rare-heritage-turkeys.neocities.org/Pictures/Tails.jpg&description=Try%20this%20Turkey%20Color%20Calculator%20for%20your%20heritage%20breeding%20needs!" target="_blank" style="margin: 30px; display: inline-block; vertical-align: middle;">
            <img src="https://img.icons8.com/color/32/000000/pinterest.png" alt="Share on Pinterest" style="width: 35px; height: 35px;">
        </a>
    `;

    // Append to a specific container on the page
    document.getElementById('shareSection').appendChild(shareContainer);
});
