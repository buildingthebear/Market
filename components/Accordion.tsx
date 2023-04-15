import React, {ReactNode, useState, useEffect, useRef} from 'react';

interface AccordionProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}

const upChevron = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-up</title><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>
);

const downChevron = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
);

const toggleAllAccordions = (button: JQuery, delay: number) => {
    const expandAll = button.text() === 'Expand All Sections';

    button.text(expandAll && $(".accordionContent.open").length == 0 ? 'Collapse All Sections' : 'Expand All Sections');

    let at = 1;

    $(".accordionTitle").each(function () {
        setTimeout(() => {
            const content = $(this).next();
            if (expandAll && !content.is('.open')) {
                $(this).trigger('click');
            } else if (!expandAll && content.is('.open')) {
                $(this).trigger('click');
            }
        }, at * delay);

        at += 1;
    });
};



const whenAvailable = () => {
    if (typeof $ === 'undefined') {
        setTimeout(whenAvailable, 50);
    } else {
        $("#toggleAllAccordions").on("click", function() {
            toggleAllAccordions($(this), 100)
        });

        $(".accordionContent.open").each(function() {
            $(this).prev().trigger("click");
        });
    }
};

whenAvailable();

const Accordion: React.FC<AccordionProps> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);

        setTimeout(function() {
            if ($(".accordionContent.closed").length > 0) {
                $("#toggleAllAccordions").text("Expand All Sections");
            } else {
                $("#toggleAllAccordions").text("Collapse All Sections");
            }
        }, 600);
    };

    useEffect(() => {
        const parentElement = contentRef.current?.parentElement;
        if (parentElement) {
            parentElement.addEventListener("click", handleParentClick);
        }

        return () => {
            if (parentElement) {
                parentElement.removeEventListener("click", handleParentClick);
            }
        };
    }, []);

    const handleParentClick = (event: MouseEvent) => {
        const accordionTitle = (event.target as Element).closest(".accordionTitle");
        if (accordionTitle === null || accordionTitle === undefined || !accordionTitle.contains(event.target as Node)) {
            // If the click target is not the accordion title or its children, toggle the accordion
            toggleAccordion();
        }
    };

    return (
        <div ref={contentRef}>
            <div className="accordion">
                <h3 className="accordionTitle" onClick={toggleAccordion}>
                    {icon} {title} {isOpen ? upChevron : downChevron}
                </h3>
                <div className={`accordionContent ${isOpen ? 'open' : 'closed'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Accordion;