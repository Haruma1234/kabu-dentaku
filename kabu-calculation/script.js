const calculateButton =
    document.querySelector("#calculate");

const accountButtons =
    document.querySelectorAll(".account-button");


/* =========================
   損益計算ページ
========================= */

if (calculateButton) {


    /*
     * =========================
     * 口座区分
     * =========================
     */

    let accountType = "taxable";


    accountButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {


                accountButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                accountType =
                    button.dataset.account;


                /*
                 * 税引前損益の表示切り替え
                 */

                const beforeTaxRow =
                    document.querySelector(
                        "#beforeTaxRow"
                    );


                if (accountType === "taxfree") {

                    beforeTaxRow.style.display =
                        "none";

                } else {

                    beforeTaxRow.style.display =
                        "flex";

                }

            }
        );

    });


    /*
     * =========================
     * 株数
     * =========================
     */

    const sharesSelect =
        document.querySelector(
            "#sharesSelect"
        );

    const sharesCustom =
        document.querySelector(
            "#sharesCustom"
        );


    /*
     * 選択欄 → 直接入力欄
     */

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


    /*
     * 直接入力欄 → 選択欄
     */

    sharesCustom.addEventListener(
        "input",
        function () {


            const value =
                Number(
                    sharesCustom.value
                );


            /*
             * 空欄
             */

            if (!value) {

                sharesSelect.value = "";

                return;

            }


            /*
             * 選択肢と一致するか確認
             */

            const matchingOption =
                Array.from(
                    sharesSelect.options
                ).find(
                    function (option) {

                        return (
                            Number(option.value) ===
                            value
                        );

                    }
                );


            /*
             * 一致する場合
             */

            if (matchingOption) {

                sharesSelect.value =
                    matchingOption.value;

            } else {

                /*
                 * 一致しない場合
                 */

                sharesSelect.value = "";

            }

        }
    );


    /*
     * =========================
     * 計算
     * =========================
     */

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


            /*
             * 株数は直接入力欄を使用
             */

            const shares =
                Number(
                    sharesCustom.value
                );


            /*
             * =========================
             * 入力チェック
             * =========================
             */

            if (
                buyPrice <= 0 ||
                sellPrice <= 0 ||
                shares <= 0
            ) {

                alert(
                    "購入価格・売却価格・株数を入力してください。"
                );

                return;

            }


            /*
             * =========================
             * 売買金額
             * =========================
             */

            const buyAmount =
                buyPrice * shares;

            const sellAmount =
                sellPrice * shares;


            /*
             * =========================
             * 税引前損益
             * =========================
             */

            const beforeTaxProfit =
                sellAmount - buyAmount;


            /*
             * =========================
             * 税引後損益
             * =========================
             */

            let afterTaxProfit;


            if (accountType === "taxfree") {


                /*
                 * NISA・非課税
                 */

                afterTaxProfit =
                    beforeTaxProfit;


            } else {


                /*
                 * 特定・一般
                 *
                 * 簡易計算として
                 * 20.315%を使用
                 */

                if (beforeTaxProfit > 0) {

                    afterTaxProfit =
                        beforeTaxProfit *
                        (1 - 0.20315);

                } else {

                    afterTaxProfit =
                        beforeTaxProfit;

                }

            }


            /*
             * =========================
             * 税引後損益率
             * =========================
             */

            const profitRate =
                (afterTaxProfit / buyAmount) *
                100;


            /*
             * =========================
             * 結果要素
             * =========================
             */

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


            /*
             * =========================
             * 結果表示
             * =========================
             */

            sellAmountElement.textContent =
                formatYen(
                    sellAmount
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


            /*
             * =========================
             * 色をリセット
             * =========================
             */

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


            /*
             * =========================
             * 損益の色
             * =========================
             */

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


            /*
             * =========================
             * 税引前損益の色
             * =========================
             */

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


/* =========================
   円表示
========================= */

function formatYen(value) {

    return (
        Math.round(value).toLocaleString() +
        "円"
    );

}


/* =========================
   損益用円表示
========================= */

function formatProfitYen(value) {

    const sign =
        value > 0
            ? "+"
            : "";

    return (
        sign +
        Math.round(value).toLocaleString() +
        "円"
    );

}


/* =========================
   損益率表示
========================= */

function formatPercent(value) {

    const sign =
        value > 0
            ? "+"
            : "";

    return (
        sign +
        value.toFixed(2) +
        "%"
    );

}