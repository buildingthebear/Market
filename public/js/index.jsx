document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        $('.tabLink').on('click', function() {
            let tabPanelID = $(this).text().replace(/['\s]+/g, "");

            openCardTab($(this).parent(), tabPanelID, $(this));
        });

        function openCardTab(tabSet, tabPanelID, tabLink) {
            let i, tabContent, tabPanel, tabLinks;

            tabContent = tabSet.parents(".mainSectionCard").find(".tabContent");

            for (i = 0; i < tabContent.length; i++) {
                let t = tabContent[i];

                t.setAttribute("style", "display: none;");
            }

            tabLinks = tabSet.find(".tabLink");

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

                await sleep(150)
            }
        }

        $(".defaultTab").each(function() {
            this.click();
        });

        fadeCardsIn().then(r => console.log("Please, feel free to browse our wares"));
    }
}