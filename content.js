const priceRegex = /\$\s?([\d,]+(?:\.\d{2})?)/g;
applyTariffs();
function applyTariffs() {
    chrome.storage.sync.get(["selectedCountry", "tariffPercentage", "markupPercentage", "isPercentagePricing"], function (data) {
        const tariffPercentage = data.tariffPercentage || 0;
        const markupPercentage = data.markupPercentage || 0;
        const isPercentagePricing = data.isPercentagePricing === "true";

        const walk = (node) => {
            if (node.nodeType === 3) { // Text node
                
                let originalPriceText = node.textContent;
                if(originalPriceText.includes("With Tariff:")){
                    originalPriceText = originalPriceText.split("(")[0];
                }
                const newText = originalPriceText.replace(priceRegex, (match, p1) => {
                    const originalPrice = parseFloat(p1.replace(/,/g, ''));
                    let adjustedPrice = 0;
                    if (isPercentagePricing) {
                        adjustedPrice = originalPrice * (1 + tariffPercentage / 100);
                    } else {
                        const importPrice = originalPrice /(1 + markupPercentage / 100);
                        const tariffTaxes = importPrice * tariffPercentage / 100;
                        adjustedPrice = originalPrice+tariffTaxes;
                    }
                    // const originalPrice = match.replace(/^([^\(]*)/, `$1 (with tariff: $${adjustedPrice.toFixed(2)})`)
                    return `${match} (With Tariff: $${adjustedPrice.toFixed(2)})`;
                });
                if (newText !== originalPriceText) {
                    node.textContent = newText;
                }
            } else if (node.nodeType === 1 && node.childNodes && !['SCRIPT', 'STYLE'].includes(node.tagName)) {
                node.childNodes.forEach(walk);
            }
        };
        walk(document.body);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "applyTariff") {
        applyTariffs();
    }
});