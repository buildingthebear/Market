document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        async function fadeCardsIn() {
            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            }

            for (let i = 0; i < $('.mainSectionCard').length; i++) {
                if (i % 2 == 0) { $(".defaultTab").each(function() { this.click(); }); }

                $('.mainSectionCard').eq(i).css("opacity", 1);

                await sleep(150)
            }
        }

        if (typeof window !== 'undefined' && typeof $ !== 'undefined') {
            window.onload = function() {
                $('.tabLink').on('click', function() {
                    let tabPanelID = $(this).text().replace(/['\s]+/g, "");

                    openCardTab($(this).parent(), tabPanelID, $(this));
                });
            };
        }

        fadeCardsIn().then(r => console.log("Please, feel free to browse our wares"));
    }
}

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