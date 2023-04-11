import React, { useState } from 'react';

interface AccordionProps {
    title: string;
}

const upChevron = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-up</title><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" /></svg>
);

const downChevron = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
);

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion">
            <h3 className="accordion-title" onClick={toggleAccordion}>
                {title} {isOpen ? upChevron : downChevron}
            </h3>
            <div className={`accordion-content ${isOpen ? 'open' : 'closed'}`}>
                {children}
            </div>
        </div>
    );
};

export default Accordion;
