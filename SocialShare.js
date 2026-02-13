(function () {
    var attempts = 0;
    var maxAttempts = 50; // ~5 seconds

    function injectShare() {
        var shareSection = document.getElementById('shareSection');
        if (!shareSection) {
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(injectShare, 100);
            }
            return;
        }

        // Center the container
        shareSection.style.textAlign = "center";
        shareSection.style.marginTop = "40px"; // optional spacing from content

        var url = "https://turkeycolorcalculator.com";

        shareSection.innerHTML = `
            <p style="font-weight:bold;margin-bottom:10px;">Share This Calculator:</p>

            <a href="https://www.facebook.com/sharer/sharer.php?u=${url}"
               target="_blank"
               style="margin:20px;display:inline-block;">
                <img src="https://porters-rare-heritage-turkeys.neocities.org/Pictures/FBLogo.jpg"
                     style="width:30px;height:30px;" alt="Facebook">
            </a>

            <button id="copyLinkBtn"
                    style="margin:20px;padding:6px 10px;cursor:pointer; display:inline-block;">
                📋 Copy Link
            </button>

            <a href="mailto:?subject=Turkey Color Calculator&body=${url}"
               style="margin:20px;display:inline-block;">
                ✉️ Email
            </a>
        `;

        var btn = document.getElementById('copyLinkBtn');
        if (btn) {
            btn.onclick = function () {
                try {
                    navigator.clipboard.writeText(url);
                    this.textContent = "✅ Copied!";
                    setTimeout(() => this.textContent = "📋 Copy Link", 2000);
                } catch (e) {
                    prompt("Copy this link:", url);
                }
            };
        }
    }

    injectShare();
})();






