document.addEventListener("DOMContentLoaded", function () {

    const calculateButton = document.querySelector("#calculate");
    const accountButtons = document.querySelectorAll(".account-button");

    if (calculateButton) {

        // =========================
        // 損益計算
        // =========================

        let accountType = "taxfree";

        const beforeTaxRow = document.querySelector("#beforeTaxRow");
        const sharesSelect = document.querySelector("#sharesSelect");
        const sharesCustom = document.querySelector("#sharesCustom");


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

                accountType = button.dataset.account;

                updateAccountDisplay();

            });

        });


        // =========================
        // 株数
        // =========================

        if (sharesSelect && sharesCustom) {

            sharesSelect.addEventListener("change", function () {

                if (sharesSelect.value === "") {

                    sharesCustom.value = "";

                    return;

                }

                sharesCustom.value = sharesSelect.value;

            });


            sharesCustom.addEventListener("input", function () {

                const value = Number(sharesCustom.value);


                if (!value || value <= 0) {

                    sharesSelect.value = "";

                    return;

                }


                const matchingOption = Array.from(
                    sharesSelect.options
                ).find(function (option) {

                    return Number(option.value) === value;

                });


                if (matchingOption) {

                    sharesSelect.value = matchingOption.value;

                } else {

                    sharesSelect.value = "";

                }

            });

        }


        // =========================
        // 計算
        // =========================

        calculateButton.addEventListener("click", function () {

            const buyPrice = Number(
                document.querySelector("#buyPrice").value
            );

            const sellPrice = Number(
                document.querySelector("#sellPrice").value
            );

            const shares = Number(
                sharesCustom.value
            );


            if (
                !Number.isFinite(buyPrice) ||
                !Number.isFinite(sellPrice) ||
                !Number.isFinite(shares) ||
                buyPrice <= 0 ||
                sellPrice <= 0 ||
                shares <= 0
            ) {

                alert("購入価格・売却価格・株数を入力してください。");

                return;

            }


            // =========================
            // 金額計算
            // =========================

            const buyAmount = buyPrice * shares;

            const grossSellAmount = sellPrice * shares;

            const beforeTaxProfit =
                grossSellAmount - buyAmount;


            let afterTaxProfit;


            // =========================
            // 税金
            // =========================

            if (accountType === "taxfree") {

                afterTaxProfit = beforeTaxProfit;

            } else {

                if (beforeTaxProfit > 0) {

                    afterTaxProfit =
                        beforeTaxProfit * (1 - 0.20315);

                } else {

                    afterTaxProfit = beforeTaxProfit;

                }

            }


            // =========================
            // 税引後
            // =========================

            const afterTaxSellAmount =
                buyAmount + afterTaxProfit;


            const profitRate =
                (afterTaxProfit / buyAmount) * 100;


            // =========================
            // 表示
            // =========================

            const sellAmountElement =
                document.querySelector("#sellAmount");

            const buyAmountElement =
                document.querySelector("#buyAmount");

            const profitElement =
                document.querySelector("#profit");

            const profitRateElement =
                document.querySelector("#profitRate");

            const beforeTaxElement =
                document.querySelector("#beforeTaxProfit");


            sellAmountElement.textContent =
                formatYen(afterTaxSellAmount);

            buyAmountElement.textContent =
                formatYen(buyAmount);

            profitElement.textContent =
                formatProfitYen(afterTaxProfit);

            profitRateElement.textContent =
                formatPercent(profitRate);

            beforeTaxElement.textContent =
                formatProfitYen(beforeTaxProfit);


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

                profitElement.classList.add("positive");
                profitRateElement.classList.add("positive");

            } else if (afterTaxProfit < 0) {

                profitElement.classList.add("negative");
                profitRateElement.classList.add("negative");

            }


            if (beforeTaxProfit > 0) {

                beforeTaxElement.classList.add("positive");

            } else if (beforeTaxProfit < 0) {

                beforeTaxElement.classList.add("negative");

            }

        });

    }


    // =========================
    // 電卓
    // =========================

    const calcDisplay = document.querySelector("#calcDisplay");
    const calcButtons = document.querySelectorAll(
        "[data-calc-action]"
    );


    if (calcDisplay && calcButtons.length > 0) {

        let currentValue = "0";
        let previousValue = null;
        let currentOperator = null;
        let waitingForOperand = false;


        function updateCalculatorDisplay() {

            calcDisplay.value = currentValue;

        }


        function inputNumber(number) {

            if (
                waitingForOperand ||
                currentValue === "Error"
            ) {

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

            if (
                waitingForOperand ||
                currentValue === "Error"
            ) {

                currentValue = "0.";
                waitingForOperand = false;

                return;

            }


            if (!currentValue.includes(".")) {

                currentValue += ".";

            }

        }


        function calculateOperation() {

            if (
                previousValue === null ||
                currentOperator === null
            ) {

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

                        currentValue = "Error";
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

                currentValue = "Error";

            } else {

                currentValue = String(result);

            }


            previousValue = null;
            currentOperator = null;
            waitingForOperand = true;

        }


        function inputOperator(operator) {

            if (currentValue === "Error") {

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

                const action =
                    button.dataset.calcAction;

                const value =
                    button.dataset.value;


                if (action === "number") {

                    inputNumber(value);

                } else if (action === "decimal") {

                    inputDecimal();

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

    const memo = document.querySelector("#memo");
    const memoStatus = document.querySelector("#memoStatus");


    if (memo) {

        const savedMemo =
            localStorage.getItem("kabuDentakuMemo");


        if (savedMemo !== null) {

            memo.value = savedMemo;

        }


        memo.addEventListener("input", function () {

            localStorage.setItem(
                "kabuDentakuMemo",
                memo.value
            );


            if (memoStatus) {

                memoStatus.textContent = "保存しました";

                clearTimeout(memoStatus._timer);

                memoStatus._timer = setTimeout(
                    function () {

                        memoStatus.textContent = "自動保存";

                    },
                    1200
                );

            }

        });

    }

});


// =========================
// 表示用関数
// =========================

function formatYen(value) {

    return Math.round(value).toLocaleString() + "円";

}


function formatProfitYen(value) {

    const sign = value > 0 ? "+" : "";

    return sign +
        Math.round(value).toLocaleString() +
        "円";

}


function formatPercent(value) {

    const sign = value > 0 ? "+" : "";

    return sign +
        value.toFixed(2) +
        "%";

}