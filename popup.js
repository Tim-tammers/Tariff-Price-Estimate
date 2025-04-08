
  let selectedCountry = document.getElementById("countrySelect");
  let selectedCategory = document.getElementById("categorySelect");



  document.addEventListener("DOMContentLoaded", function () {
    
    for (const country in countryMap) {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        document.getElementById("countrySelect").appendChild(option);
    }
    for (const category in categoryMap) {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        document.getElementById("categorySelect").appendChild(option);
    }
    chrome.storage.sync.get(["selectedCountry","isPercentagePricing", "selectedCategory"], function (data) {
        if (data.selectedCountry) {
            selectedCountry.value = data.selectedCountry;
        }
        if (data.selectedCategory) {
            selectedCategory.value = data.selectedCategory;
          }
        if (data.isPercentagePricing) {
            pricingModelSelect.value = data.isPercentagePricing;
        }
      });
  });

  document.getElementById("applyTariff").addEventListener("click", function () {

    const tariffPercentage = countryMap[selectedCountry.value] || 0; // Default to 0 if no country selected
    const markupPercentage = categoryMap[selectedCategory.value] || 15;
    const isPercentagePricing = document.getElementById("pricingModelSelect").value;
    // Save the selected tariff to Chrome storage
    chrome.storage.sync.set({ selectedCountry: selectedCountry.value, 
        tariffPercentage,
        markupPercentage,
        selectedCategory: selectedCategory.value, 
        isPercentagePricing }, function () {
            chrome.runtime.sendMessage({ action: "applyTariff" });
    });
  });


