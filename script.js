document.addEventListener("DOMContentLoaded", function() {
    const calculateButton = document.querySelector("#calculate");
    const accountButtons = document.querySelectorAll(".account-button");

    if (!calculateButton) {
        return;
    }

    // 初期状態はNISA・非課税
    let accountType = "taxfree";

    const beforeTaxRow = document.querySelector("#beforeTaxRow");
    const sharesSelect = document.querySelector("#sharesSelect");
    const sharesCustom = document.querySelector("#sharesCustom");

    // -------------------------
    // 口座区分
    // -------------------------

    accountButtons.forEach(function(button) {
        button.classList.remove("active");

        if (button.dataset.account === "taxfree") {
            button.classList.add("active");
        }
    });

    // 初期状態では税引前損益を非表示
    if (beforeTaxRow) {
        beforeTaxRow.style.display = "none";
    }

    // 口座区分の切り替え
    accountButtons.forEach(function(button) {
        button.addEventListener("click", function() {

            accountButtons.forEach(function(item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            accountType = button.dataset.account;

            if (beforeTaxRow) {
                if (accountType === "taxfree") {
                    beforeTaxRow.style.display = "none";
                } else {
                    beforeTaxRow.style.display = "flex";
                }
            }
        });
    });

    // -------------------------
    // 株数
    // -------------------------

    if (sharesSelect && sharesCustom) {

        sharesSelect.addEventListener("change", function() {

            if (sharesSelect.value === "") {
                sharesCustom.value = "";
                return;
            }

            sharesCustom.value = sharesSelect.value;
        });

        sharesCustom.addEventListener("input", function() {

            const value = Number(sharesCustom.value);

            if (!value) {
                sharesSelect.value = "";
                return;
            }

            const matchingOption = Array.from(sharesSelect.options).find(function(option) {
                return Number(option.value) === value;
            });

            if (matchingOption) {
                sharesSelect.value = matchingOption.value;
            } else {
                sharesSelect.value = "";
            }
        });
    }

    // -------------------------
    // 計算
    // -------------------------

    calculateButton.addEventListener("click", function() {

        const buyPrice = Number(document.querySelector("#buyPrice").value);
        const sellPrice = Number(document.querySelector("#sellPrice").value);
        const shares = Number(sharesCustom.value);

        if (buyPrice <= 0 || sellPrice <= 0 || shares <= 0) {
            alert("購入価格・売却価格・株数を入力してください。");
            return;
        }

        // 買付金額
        const buyAmount = buyPrice * shares;

        // 税引前の売却金額
        const grossSellAmount = sellPrice * shares;

        // 税引前損益
        const beforeTaxProfit = grossSellAmount - buyAmount;

        let afterTaxProfit;

        if (accountType === "taxfree") {

            // NISA・非課税
            afterTaxProfit = beforeTaxProfit;

        } else {

            // 特定・一般
            if (beforeTaxProfit > 0) {
                afterTaxProfit = beforeTaxProfit * (1 - 0.20315);
            } else {
                afterTaxProfit = beforeTaxProfit;
            }
        }

        // 税引後の実質売却金額
        const afterTaxSellAmount = buyAmount + afterTaxProfit;

        // 税引後損益率
        const profitRate = (afterTaxProfit / buyAmount) * 100;

        const sellAmountElement = document.querySelector("#sellAmount");
        const buyAmountElement = document.querySelector("#buyAmount");
        const profitElement = document.querySelector("#profit");
        const profitRateElement = document.querySelector("#profitRate");
        const beforeTaxElement = document.querySelector("#beforeTaxProfit");

        // 結果表示
        sellAmountElement.textContent = formatYen(afterTaxSellAmount);
        buyAmountElement.textContent = formatYen(buyAmount);
        profitElement.textContent = formatProfitYen(afterTaxProfit);
        profitRateElement.textContent = formatPercent(profitRate);
        beforeTaxElement.textContent = formatProfitYen(beforeTaxProfit);

        // 色をリセット
        profitElement.classList.remove("positive", "negative");
        profitRateElement.classList.remove("positive", "negative");
        beforeTaxElement.classList.remove("positive", "negative");

        // 税引後損益
        if (afterTaxProfit > 0) {

            profitElement.classList.add("positive");
            profitRateElement.classList.add("positive");

        } else if (afterTaxProfit < 0) {

            profitElement.classList.add("negative");
            profitRateElement.classList.add("negative");
        }

        // 税引前損益
        if (beforeTaxProfit > 0) {

            beforeTaxElement.classList.add("positive");

        } else if (beforeTaxProfit < 0) {

            beforeTaxElement.classList.add("negative");
        }
    });
});


// -------------------------
// 表示用関数
// -------------------------

function formatYen(value) {
    return Math.round(value).toLocaleString() + "円";
}


function formatProfitYen(value) {
    const sign = value > 0 ? "+" : "";
    return sign + Math.round(value).toLocaleString() + "円";
}


function formatPercent(value) {
    const sign = value > 0 ? "+" : "";
    return sign + value.toFixed(2) + "%";
}
