import React from 'react';
import Accordion from '../components/Accordion';
import {crownIcon, telegramIcon, githubIcon} from '../components/svgIcons';

// Build the Bear Henry Component
function HenryComponent() {// Component HTML
    return (
        <div>
            <div className="mainSectionCard henryWidget" id="henryWidget">
                <div className="henryBackground"></div>
                <Accordion title="Henry the Hypemachine" icon={crownIcon}>
                    <h5>Bring life to your Telegram</h5>
                    <hr/>
                    <ul>
                        <li>
                            <span className="mainSectionCardDescription">Henry is our open-source Telegram bot. He listens in on group chats and joins the conversation when intrigued</span>
                            <br/><br/>
                            <a
                                className=""
                                target="_blank"
                                rel="noreferrer"
                                href="https://t.me/HenrytheHypeBot"
                            >
                                <b>➟ Meet Him on Telegram{" "}
                                    {telegramIcon}
                                </b>
                            </a>
                        </li>
                        <li>
                            <a
                                className=""
                                target="_blank"
                                rel="noreferrer"
                                href="https://github.com/buildingthebear/henry"
                            >
                                ➟ Contribute on GitHub{" "}
                                    {githubIcon}
                            </a>
                        </li>
                    </ul>
                </Accordion>
            </div>
        </div>
    );
}

export default function HenryWidget() { return (<HenryComponent /> ) }