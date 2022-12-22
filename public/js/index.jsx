document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        let url = 'https://api.binance.us/api/v3/ticker/24hr?symbols=["BTCUSD","ETHUSD","BNBUSD","ADAUSD","SOLUSD"]';
        let arr = [];
        let cur = [{Symbol: "BTC", Name: "Bitcoin"},
            {Symbol: "ETH", Name: "Ethereum"},
            {Symbol: "BNB", Name: "BNB"},
            {Symbol: "ADA", Name: "Cardano"},
            {Symbol: "SOL", Name: "Solana"}];
        let acc = ``;

        async function getMarketPrices() {
            // fetch information for #marketPrices
            try {
                let res = await fetch(url);
                arr = await res.json();
            } catch (error) {
                console.log(error);
            }

            for (let i = 0; i < arr.length; i++) {
                let obj = arr[i], dir = 'up ', emoji = '📈', className = 'up', currencyName = '';

                if (obj.priceChangePercent < 0) {
                    dir = 'down ';
                    className = 'down';
                    emoji = '📉';
                }

                $('#marketPrices').append('<div class="cardContainer"><button class="card accordion" data-symbol="' + obj.symbol +
                    '" data-lastPrice="' + obj.lastPrice + '"><div class="cardInner"><div class="cardFront">' + obj.symbol +
                    ' ' + emoji + '</div><div class="cardBack">$' + obj.lastPrice.toString() + '</div></div></button></div>');

                cur.forEach(function(c){
                    if (c.Symbol == obj.symbol.slice(0, -3)) {
                        currencyName = c.Name;
                    }
                });

                $('.cardContainer').last().append('<div class="panel ' + className + '">' + dir + obj.priceChangePercent + '%<br><a class="cardLink" target="_blank" href="https://coinmarketcap.com/currencies/' + currencyName + '/">coinmarketcap</a></div>')
            }

            // detailed information for banner currency
            $('.accordion').on('click', function() {
                this.classList.toggle("active");

                let panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }

        $('.tabLink').on('click', function() {
            let tabPanelID = $(this).text().replace(/['\s]+/g, "");

            openRoadmapTab(tabPanelID, $(this));
        });

        function openRoadmapTab(tabPanelID, tabLink) {
            let i, tabContent, tabPanel, tabLinks;

            tabContent = document.getElementsByClassName("tabContent");

            for (i = 0; i < tabContent.length; i++) {
                let t = tabContent[i];
                t.setAttribute("style", "display: none;");
            }

            tabLinks = document.getElementsByClassName("tabLink");

            for (i = 0; i < tabLinks.length; i++) {
                tabLinks[i].setAttribute("class", "tabLink");
            }

            tabPanel = document.getElementById(tabPanelID);
            tabPanel.setAttribute("style", "display: block;");

            tabLink.attr("class", "tabLink active");
        }

        async function fadeCardsIn() {
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            }

            for (let i = 0; i < $('.mainSectionCard').length; i++) {
                $('.mainSectionCard').eq(i).css("opacity", 1);

                await sleep(400)
            }
        }

        document.getElementById("defaultTab").click();

        fadeCardsIn().then(r => console.log("Please, feel free to browse our wares"));

        // getMarketPrices().then(r => console.log("Fetched Rates"));
    }
}