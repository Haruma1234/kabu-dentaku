document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // 損益計算
    // =========================

    const calculateButton = document.querySelector("#calculate");
    const calculateTargetButton = document.querySelector("#calculateTarget");

    const accountButtons = document.querySelectorAll(
        ".account-button[data-account]"
    );

    const targetAccountButtons = document.querySelectorAll(
        ".target-account-button"
    );

    const calculationModes = document.querySelectorAll(
        ".calculation-mode"
    );

    const profitMode = document.querySelector("#profitMode");
    const targetMode = document.querySelector("#targetMode");


    // =========================
    // 計算モード切替
    // =========================

    let calculationMode = "profit";


    function updateCalculationMode() {

        calculationModes.forEach(function (button) {

            button.classList.toggle(
                "active",
                button.dataset.mode === calculationMode
            );

        });


        if (profitMode) {

            profitMode.style.display =
                calculationMode === "profit"
                    ? "block"
                    : "none";

        }


        if (targetMode) {

            targetMode.style.display =
                calculationMode === "target"
                    ? "block"
                    : "none";

        }

    }


    calculationModes.forEach(function (button) {

        button.addEventListener("click", function () {

            calculationMode = button.dataset.mode;

            updateCalculationMode();

        });

    });


    updateCalculationMode();


    // =========================
    // 通常の損益計算
    // =========================

    if (calculateButton) {

        let accountType = "taxfree";

        const beforeTaxRow =
            document.querySelector("#beforeTaxRow");

        const sharesSelect =
            document.querySelector("#sharesSelect");

        const sharesCustom =
            document.querySelector("#sharesCustom");


        // =========================
        // 口座区分
        // =========================

        function updateAccountDisplay() {

            accountButtons.forEach(function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.account === accountType
                );

            });


            if (beforeTaxRow) {

                if (accountType === "taxfree") {

                    beforeTaxRow.style.display = "none";

                } else {

                    beforeTaxRow.style.display = "flex";

                }

            }

        }


        updateAccountDisplay();


        accountButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                accountType =
                    button.dataset.account;

                updateAccountDisplay();

            });

        });


        // =========================
        // 株数
        // =========================

        if (sharesSelect && sharesCustom) {

            sharesSelect.addEventListener(
                "change",
                function () {

                    if (sharesSelect.value === "") {

                        sharesCustom.value = "";

                        return;

                    }

                    sharesCustom.value =
                        sharesSelect.value;

                }
            );


            sharesCustom.addEventListener(
                "input",
                function () {

                    const value =
                        Number(sharesCustom.value);


                    if (!value || value <= 0) {

                        sharesSelect.value = "";

                        return;

                    }


                    const matchingOption =
                        Array.from(
                            sharesSelect.options
                        ).find(function (option) {

                            return Number(option.value) === value;

                        });


                    if (matchingOption) {

                        sharesSelect.value =
                            matchingOption.value;

                    } else {

                        sharesSelect.value = "";

                    }

                }
            );

        }


        // =========================
        // 計算
        // =========================

        calculateButton.addEventListener(
            "click",
            function () {

                const buyPrice =
                    Number(
                        document.querySelector(
                            "#buyPrice"
                        ).value
                    );

                const sellPrice =
                    Number(
                        document.querySelector(
                            "#sellPrice"
                        ).value
                    );

                const shares =
                    Number(sharesCustom.value);


                if (
                    !Number.isFinite(buyPrice) ||
                    !Number.isFinite(sellPrice) ||
                    !Number.isFinite(shares) ||
                    buyPrice <= 0 ||
                    sellPrice <= 0 ||
                    shares <= 0
                ) {

                    alert(
                        "購入価格・売却価格・株数を入力してください。"
                    );

                    return;

                }


                // =========================
                // 金額計算
                // =========================

                const buyAmount =
                    buyPrice * shares;

                const grossSellAmount =
                    sellPrice * shares;

                const beforeTaxProfit =
                    grossSellAmount - buyAmount;


                let afterTaxProfit;


                // =========================
                // 税金
                // =========================

                if (accountType === "taxfree") {

                    afterTaxProfit =
                        beforeTaxProfit;

                } else {

                    if (beforeTaxProfit > 0) {

                        afterTaxProfit =
                            beforeTaxProfit *
                            (1 - 0.20315);

                    } else {

                        afterTaxProfit =
                            beforeTaxProfit;

                    }

                }


                // =========================
                // 税引後
                // =========================

                const afterTaxSellAmount =
                    buyAmount + afterTaxProfit;


                const profitRate =
                    (afterTaxProfit / buyAmount) *
                    100;


                // =========================
                // 表示
                // =========================

                const sellAmountElement =
                    document.querySelector(
                        "#sellAmount"
                    );

                const buyAmountElement =
                    document.querySelector(
                        "#buyAmount"
                    );

                const profitElement =
                    document.querySelector(
                        "#profit"
                    );

                const profitRateElement =
                    document.querySelector(
                        "#profitRate"
                    );

                const beforeTaxElement =
                    document.querySelector(
                        "#beforeTaxProfit"
                    );


                sellAmountElement.textContent =
                    formatYen(
                        afterTaxSellAmount
                    );

                buyAmountElement.textContent =
                    formatYen(
                        buyAmount
                    );

                profitElement.textContent =
                    formatProfitYen(
                        afterTaxProfit
                    );

                profitRateElement.textContent =
                    formatPercent(
                        profitRate
                    );

                beforeTaxElement.textContent =
                    formatProfitYen(
                        beforeTaxProfit
                    );


                // =========================
                // 色
                // =========================

                profitElement.classList.remove(
                    "positive",
                    "negative"
                );

                profitRateElement.classList.remove(
                    "positive",
                    "negative"
                );

                beforeTaxElement.classList.remove(
                    "positive",
                    "negative"
                );


                if (afterTaxProfit > 0) {

                    profitElement.classList.add(
                        "positive"
                    );

                    profitRateElement.classList.add(
                        "positive"
                    );

                } else if (afterTaxProfit < 0) {

                    profitElement.classList.add(
                        "negative"
                    );

                    profitRateElement.classList.add(
                        "negative"
                    );

                }


                if (beforeTaxProfit > 0) {

                    beforeTaxElement.classList.add(
                        "positive"
                    );

                } else if (beforeTaxProfit < 0) {

                    beforeTaxElement.classList.add(
                        "negative"
                    );

                }

            }
        );

    }


    // =========================
    // 目標損益率から計算
    // =========================

    if (calculateTargetButton) {

        let targetAccountType = "taxfree";


        const targetBeforeTaxRow =
            document.querySelector(
                "#targetBeforeTaxRow"
            );


        function updateTargetAccountDisplay() {

            targetAccountButtons.forEach(
                function (button) {

                    button.classList.toggle(
                        "active",
                        button.dataset.targetAccount ===
                            targetAccountType
                    );

                }
            );


            if (targetBeforeTaxRow) {

                if (
                    targetAccountType ===
                    "taxfree"
                ) {

                    targetBeforeTaxRow.style.display =
                        "none";

                } else {

                    targetBeforeTaxRow.style.display =
                        "flex";

                }

            }

        }


        updateTargetAccountDisplay();


        targetAccountButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        targetAccountType =
                            button.dataset.targetAccount;

                        updateTargetAccountDisplay();

                    }
                );

            }
        );


        calculateTargetButton.addEventListener(
            "click",
            function () {

                const buyPrice =
                    Number(
                        document.querySelector(
                            "#targetBuyPrice"
                        ).value
                    );

                const targetProfitRate =
                    Number(
                        document.querySelector(
                            "#targetProfitRate"
                        ).value
                    );

                const shares =
                    Number(
                        document.querySelector(
                            "#targetShares"
                        ).value
                    );


                if (
                    !Number.isFinite(buyPrice) ||
                    !Number.isFinite(targetProfitRate) ||
                    !Number.isFinite(shares) ||
                    buyPrice <= 0 ||
                    shares <= 0
                ) {

                    alert(
                        "購入価格・目標損益率・株数を入力してください。"
                    );

                    return;

                }


                /*
                 * 目標損益率は「税引後」を基準とする。
                 *
                 * NISA:
                 *   売却価格 = 購入価格 × (1 + 目標率)
                 *
                 * 特定・一般:
                 *   税引後利益
                 *   = 税引前利益 × (1 - 20.315%)
                 *
                 * よって、
                 *   税引前利益
                 *   = 目標利益 ÷ (1 - 20.315%)
                 */

                const targetRate =
                    targetProfitRate / 100;


                let sellPrice;


                if (
                    targetAccountType ===
                    "taxfree"
                ) {

                    sellPrice =
                        buyPrice *
                        (1 + targetRate);

                } else {

                    sellPrice =
                        buyPrice +
                        (
                            buyPrice *
                            targetRate /
                            (1 - 0.20315)
                        );

                }


                const buyAmount =
                    buyPrice * shares;

                const sellAmount =
                    sellPrice * shares;

                const beforeTaxProfit =
                    sellAmount - buyAmount;


                let afterTaxProfit;


                if (
                    targetAccountType ===
                    "taxfree"
                ) {

                    afterTaxProfit =
                        beforeTaxProfit;

                } else {

                    if (beforeTaxProfit > 0) {

                        afterTaxProfit =
                            beforeTaxProfit *
                            (1 - 0.20315);

                    } else {

                        afterTaxProfit =
                            beforeTaxProfit;

                    }

                }


                const actualProfitRate =
                    (afterTaxProfit / buyAmount) *
                    100;


                // =========================
                // 表示
                // =========================

                const targetSellPriceElement =
                    document.querySelector(
                        "#targetSellPrice"
                    );

                const targetSellAmountElement =
                    document.querySelector(
                        "#targetSellAmount"
                    );

                const targetRateResultElement =
                    document.querySelector(
                        "#targetRateResult"
                    );

                const targetProfitElement =
                    document.querySelector(
                        "#targetProfit"
                    );

                const targetBeforeTaxElement =
                    document.querySelector(
                        "#targetBeforeTaxProfit"
                    );


                targetSellPriceElement.textContent =
                    formatYen(
                        sellPrice
                    );

                targetSellAmountElement.textContent =
                    formatYen(
                        sellAmount
                    );

                targetRateResultElement.textContent =
                    formatPercent(
                        actualProfitRate
                    );

                targetProfitElement.textContent =
                    formatProfitYen(
                        afterTaxProfit
                    );

                targetBeforeTaxElement.textContent =
                    formatProfitYen(
                        beforeTaxProfit
                    );


                // =========================
                // 色
                // =========================

                targetProfitElement.classList.remove(
                    "positive",
                    "negative"
                );

                targetRateResultElement.classList.remove(
                    "positive",
                    "negative"
                );

                targetBeforeTaxElement.classList.remove(
                    "positive",
                    "negative"
                );


                if (afterTaxProfit > 0) {

                    targetProfitElement.classList.add(
                        "positive"
                    );

                    targetRateResultElement.classList.add(
                        "positive"
                    );

                } else if (afterTaxProfit < 0) {

                    targetProfitElement.classList.add(
                        "negative"
                    );

                    targetRateResultElement.classList.add(
                        "negative"
                    );

                }


                if (beforeTaxProfit > 0) {

                    targetBeforeTaxElement.classList.add(
                        "positive"
                    );

                } else if (beforeTaxProfit < 0) {

                    targetBeforeTaxElement.classList.add(
                        "negative"
                    );

                }

            }
        );

    }


    // =========================
    // 電卓（標準電卓挙動＋⌫対応版）
    // =========================

    const calcDisplay = document.querySelector("#calcDisplay");
    const calcButtons = document.querySelectorAll("[data-calc-action]");

    if (calcDisplay && calcButtons.length > 0) {

        let currentValue = "0";
        let previousValue = null;
        let currentOperator = null;
        let waitingForOperand = false;

        function updateCalculatorDisplay() {
            calcDisplay.value = currentValue;
        }

        function inputNumber(number) {
            if (waitingForOperand || currentValue === "Error" || currentValue === "エラー") {
                currentValue = number;
                waitingForOperand = false;
                return;
            }

            if (currentValue === "0") {
                currentValue = number;
            } else {
                currentValue += number;
            }
        }

        function inputDecimal() {
            if (waitingForOperand || currentValue === "Error" || currentValue === "エラー") {
                currentValue = "0.";
                waitingForOperand = false;
                return;
            }

            if (!currentValue.includes(".")) {
                currentValue += ".";
            }
        }

        function inputBackspace() {
            if (waitingForOperand || currentValue === "Error" || currentValue === "エラー") {
                return;
            }

            if (currentValue.length > 1) {
                currentValue = currentValue.slice(0, -1);
            } else {
                currentValue = "0";
            }
        }

        function inputSqrt() {
            const current = Number(currentValue);
            if (current < 0) {
                currentValue = "エラー";
            } else {
                currentValue = String(Math.sqrt(current));
            }
            waitingForOperand = true;
        }

        function inputPercent() {
            const current = Number(currentValue);

            if (currentOperator && previousValue !== null) {
                const previous = Number(previousValue);
                let result;

                if (currentOperator === "/") {
                    // 例: 80 ÷ 800 ％ => 10 (80は800の10%)
                    result = (previous / current) * 100;
                } else if (currentOperator === "*") {
                    // 例: 800 × 10 ％ => 80 (800の10%)
                    result = (previous * current) / 100;
                } else if (currentOperator === "+") {
                    // 例: 1000 ＋ 10 ％ => 1100 (1000の10%増し)
                    result = previous + (previous * current / 100);
                } else if (currentOperator === "-") {
                    // 例: 1000 − 10 ％ => 900 (1000の10%引き)
                    result = previous - (previous * current / 100);
                }

                currentValue = Number.isFinite(result) ? String(result) : "エラー";
                previousValue = null;
                currentOperator = null;
                waitingForOperand = true;
            } else {
                currentValue = String(current / 100);
                waitingForOperand = true;
            }
        }

        function calculateOperation() {
            if (previousValue === null || currentOperator === null) {
                return;
            }

            const current = Number(currentValue);
            const previous = Number(previousValue);
            let result;

            switch (currentOperator) {
                case "+":
                    result = previous + current;
                    break;
                case "-":
                    result = previous - current;
                    break;
                case "*":
                    result = previous * current;
                    break;
                case "/":
                    if (current === 0) {
                        currentValue = "エラー";
                        previousValue = null;
                        currentOperator = null;
                        waitingForOperand = true;
                        return;
                    }
                    result = previous / current;
                    break;
                default:
                    return;
            }

            if (!Number.isFinite(result)) {
                currentValue = "エラー";
            } else {
                currentValue = String(result);
            }

            previousValue = null;
            currentOperator = null;
            waitingForOperand = true;
        }

        function inputOperator(operator) {
            if (currentValue === "Error" || currentValue === "エラー") {
                return;
            }

            if (currentOperator !== null && !waitingForOperand) {
                calculateOperation();
            }

            previousValue = currentValue;
            currentOperator = operator;
            waitingForOperand = true;
        }

        function clearCalculator() {
            currentValue = "0";
            previousValue = null;
            currentOperator = null;
            waitingForOperand = false;
        }

        calcButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const action = button.dataset.calcAction;
                const value = button.dataset.value;

                if (action === "number") {
                    inputNumber(value);
                } else if (action === "decimal") {
                    inputDecimal();
                } else if (action === "backspace") {
                    inputBackspace();
                } else if (action === "sqrt") {
                    inputSqrt();
                } else if (action === "percent") {
                    inputPercent();
                } else if (action === "operator") {
                    inputOperator(value);
                } else if (action === "equals") {
                    calculateOperation();
                } else if (action === "clear") {
                    clearCalculator();
                }

                updateCalculatorDisplay();
            });
        });

        updateCalculatorDisplay();
    }


    // =========================
    // メモ
    // =========================

    const memo =
        document.querySelector("#memo");

    const memoStatus =
        document.querySelector("#memoStatus");

    const clearMemoButton =
        document.querySelector("#clearMemo");


    if (memo) {

        const savedMemo =
            localStorage.getItem(
                "kabuDentakuMemo"
            );


        if (savedMemo !== null) {

            memo.value =
                savedMemo;

        }


        memo.addEventListener(
            "input",
            function () {

                localStorage.setItem(
                    "kabuDentakuMemo",
                    memo.value
                );


                if (memoStatus) {

                    memoStatus.textContent =
                        "保存しました";


                    clearTimeout(
                        memoStatus._timer
                    );


                    memoStatus._timer =
                        setTimeout(
                            function () {

                                memoStatus.textContent =
                                    "自動保存";

                            },
                            1200
                        );

                }

            }
        );

    }


    // =========================
    // メモ消去
    // =========================

    if (clearMemoButton && memo) {

        clearMemoButton.addEventListener(
            "click",
            function () {

                if (!memo.value) {

                    return;

                }


                const confirmed =
                    window.confirm(
                        "メモを消去しますか？"
                    );


                if (!confirmed) {

                    return;

                }


                memo.value = "";

                localStorage.removeItem(
                    "kabuDentakuMemo"
                );


                if (memoStatus) {

                    memoStatus.textContent =
                        "消去しました";


                    clearTimeout(
                        memoStatus._timer
                    );


                    memoStatus._timer =
                        setTimeout(
                            function () {

                                memoStatus.textContent =
                                    "自動保存";

                            },
                            1200
                        );

                }

            }
        );

    }

});


// =========================
// 表示用関数
// =========================

function formatYen(value) {

    return Math.round(value)
        .toLocaleString() +
        "円";

}


function formatProfitYen(value) {

    const sign =
        value > 0
            ? "+"
            : "";

    return sign +
        Math.round(value).toLocaleString() +
        "円";

}


function formatPercent(value) {

    const sign =
        value > 0
            ? "+"
            : "";

    return sign +
        value.toFixed(2) +
        "%";

}

// 平均取得単価の計算
document.addEventListener('DOMContentLoaded', () => {
  // 入力要素の取得
  const currentSharesInput = document.getElementById('current-shares');
  const currentPriceInput  = document.getElementById('current-price');
  const addSharesInput     = document.getElementById('add-shares');
  const addPriceInput      = document.getElementById('add-price');

  // 表示要素の取得
  const newAverageEl = document.getElementById('new-average');
  const totalSharesEl = document.getElementById('total-shares');
  const totalCostEl   = document.getElementById('total-cost');
  const priceDiffEl   = document.getElementById('price-diff');

  // 計算イベントのバインド
  const inputs = [currentSharesInput, currentPriceInput, addSharesInput, addPriceInput];
  inputs.forEach(input => {
    input.addEventListener('input', calculateNanpin);
  });

  function calculateNanpin() {
    const currentShares = parseFloat(currentSharesInput.value) || 0;
    const currentPrice  = parseFloat(currentPriceInput.value) || 0;
    const addShares     = parseFloat(addSharesInput.value) || 0;
    const addPrice      = parseFloat(addPriceInput.value) || 0;

    const totalShares = currentShares + addShares;
    
    if (totalShares === 0) {
      newAverageEl.textContent = '0';
      totalSharesEl.textContent = '0 株';
      totalCostEl.textContent = '0 円';
      priceDiffEl.textContent = '0 円';
      return;
    }

    // 計算ロジック
    const currentTotalCost = currentShares * currentPrice;
    const addTotalCost     = addShares * addPrice;
    const grandTotalCost   = currentTotalCost + addTotalCost;

    // 新しい平均取得単価（小数点第2位で四捨五入）
    const newAverage = grandTotalCost / totalShares;
    const diff = newAverage - currentPrice;

    // 画面への反映（カンマ区切りフォーマット）
    newAverageEl.textContent = newAverage.toLocaleString('ja-JP', { maximumFractionDigits: 1 });
    totalSharesEl.textContent = `${totalShares.toLocaleString('ja-JP')} 株`;
    totalCostEl.textContent = `${grandTotalCost.toLocaleString('ja-JP')} 円`;

    // 取得単価の下落・上昇表示
    if (diff < 0) {
      priceDiffEl.textContent = `${diff.toLocaleString('ja-JP', { maximumFractionDigits: 1 })} 円 (難平効果あり)`;
      priceDiffEl.style.color = '#10b981'; // 緑色
    } else if (diff > 0) {
      priceDiffEl.textContent = `+${diff.toLocaleString('ja-JP', { maximumFractionDigits: 1 })} 円 (買い増し)`;
      priceDiffEl.style.color = '#ef4444'; // 赤色
    } else {
      priceDiffEl.textContent = '変化なし';
      priceDiffEl.style.color = '#64748b';
    }
  }
});