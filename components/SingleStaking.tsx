import React, {ChangeEvent, useState, useEffect, MouseEventHandler} from 'react';
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import TokenABI from "../contracts/BuildtheBearToken.json";
import StakingABI from "../contracts/BuildtheBearSingleStake.json";

const web3 = new Web3(Web3.givenProvider || process.env.JSON_RPC_URL);
const tokenContract = new web3.eth.Contract(TokenABI as AbiItem[], "0x408C02545C554EEBBc5811F92354F726F97C1D56");
const stakingContract = new web3.eth.Contract(StakingABI as AbiItem[], "0xbE13d9086BC1DF1DE91e01F0eA5009753B8cdDf6");

// Build the Bear Single-Staking Component
function StakingComponent() {
    // Chain information
    const [amount, setAmount] = useState(1000);
    const [allowed, setAllowance] = useState(0);
    const [balance, setBalance] = useState("0");
    const [staked, setStaked] = useState("0");
    const [earned, setEarned] = useState("0");
    const [timeLeft, setTimeLeft] = useState("0 Days 0 Hours 0 Minutes");

    // Check / prompt staking contract's spending allowance for message sender's BTB, then stake
    const handleStake = async() => {
        try {
            openTransactionIndicator();

            if (typeof window !== 'undefined' && window.ethereum !== undefined && amount > 0) {
                const accounts = await web3.eth.requestAccounts();
                const amountWei = BigInt(web3.utils.toWei(amount.toString(), 'ether'));
                const amountInt = Number(amountWei / BigInt(10**9));

                if (amount > allowed) {
                    // Linter doesn't like the number of parameters, but this works
                    const approveResult = await tokenContract.methods.approve(stakingContract.options.address, amountInt).send({from: accounts[0]});
                    const approveTxHash = approveResult.transactionHash;

                    $(".stakeButton").text("Stake");
                    console.log("%cSingle-Staking Widget: Approved BTB for spend", approveTxHash);
                }

                const stakeResult = await stakingContract.methods.stake(amountInt).send({from: accounts[0]});
                const stakeTxHash = stakeResult.transactionHash;
                console.log("%cSingle-Staking Widget: Staked BTB", `color: green; padding: 2px;`, stakeTxHash);
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeTransactionIndicator();
        }
    };

    // Allow the user to un-stake their BTB
    const handleWithdraw = async() => {
        let amountBalance = "0";

        try {
            openTransactionIndicator();

            if (typeof window !== 'undefined' && window.ethereum !== undefined && amount > 0) {
                const accounts = await web3.eth.requestAccounts();
                const amountWei = BigInt(web3.utils.toWei(amount.toString(), 'ether'));
                const amountInt = Number(amountWei / BigInt(10**9));

                // Can be condensed to use fetched 'staked' amount
                const balanceResult = await stakingContract.methods.balanceOf(accounts[0]).call()
                    .then((balance: any) => {
                        amountBalance = String(balance) + "000000000";

                        console.log(`Balance of ${accounts[0]}: ${balance}`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                let balanceInt = Number(BigInt(amountBalance) / BigInt(10**9));

                if (balanceInt >= amountInt) {
                    const withdrawResult = await stakingContract.methods.withdraw(amountInt).send({from: accounts[0]});
                    const withdrawTxHash = withdrawResult.transactionHash;

                    console.log("%cSingle-Staking Widget: Un-Staked BTB", `color: green; padding: 2px;`, withdrawTxHash);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeTransactionIndicator();
        }
    }

    // Harvest all BTB reward earned
    const harvestRewards = async() => {
        try {
            openTransactionIndicator();

            if (typeof window !== 'undefined' && window.ethereum !== undefined && Number(earned) > 0) {
                const accounts = await web3.eth.requestAccounts();

                const harvestResult = await stakingContract.methods.getReward().send({from: accounts[0]});
                const harvestTxHash = harvestResult.transactionHash;

                console.log("%cSingle-Staking Widget: Harvested BTB rewards", `color: green; padding: 2px;`, harvestTxHash);

                setEarned("0")
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeTransactionIndicator();
        }
    }

    // Fetch staking contract's BTB spending allowance, user's BTB balance, staked balance, rewards earned, and pool-end timestamp
    const fetchChainInfo = async() => {
        let timeLeftString = "0 Days 0 Hours 0 Minutes";
        let currentTime = new Date().getTime() / 1000;
        let remainingTime = 0;
        let allowedAmount = 0;
        let balanceAmount = "0";
        let earnedAmount = "0";
        let stakedAmount = "0";

        try {
            if (typeof window !== 'undefined' && window.ethereum !== undefined) {
                const accounts = await web3.eth.requestAccounts();

                const allowanceResult = await tokenContract.methods.allowance(accounts[0], stakingContract.options.address).call()
                    .then((allowance: Number) => {
                        let printedAmount = String(allowance).slice(0, -9);
                        allowedAmount = Number(allowance);

                        if (printedAmount.length < 1) {
                            printedAmount = "0";
                        }

                        console.log(`%cSingle-Staking Widget: Spending allowance: ${printedAmount} BTB`, `color: green; padding: 2px;`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                allowedAmount = Number(BigInt(allowedAmount) / BigInt(10 ** 9));

                setAllowance(allowedAmount);

                const balanceResult = await tokenContract.methods.balanceOf(accounts[0]).call()
                    .then((bal: any) => {
                        if (bal > 0) {
                            balanceAmount = String(bal).slice(0, -9);

                            if (balanceAmount.length < 1) {
                                balanceAmount = "0";
                            }
                        }

                        console.log(`%cSingle-Staking Widget: Un-Staked balance: ${balanceAmount} BTB`, `color: green; padding: 2px;`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setBalance(balanceAmount);

                const stakedResult = await stakingContract.methods.balanceOf(accounts[0]).call()
                    .then((stake: any) => {
                        if (stake > 0) {
                            stakedAmount = String(stake).slice(0, -9);

                            if (stakedAmount.length < 1) {
                                stakedAmount = "0";
                            }
                        }

                        console.log(`%cSingle-Staking Widget: Staked balance: ${stakedAmount} BTB`, `color: green; padding: 2px;`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setStaked(stakedAmount);

                const rewardsResult = await stakingContract.methods.earned(accounts[0]).call()
                    .then((ar: any) => {
                        if (ar > 0) {
                            earnedAmount = String(ar).slice(0, -9);

                            if (earnedAmount.length < 1) {
                                earnedAmount = "0";
                            }
                        }

                        console.log(`%cSingle-Staking Widget: Rewards earned: ${earnedAmount} BTB`, `color: green; padding: 2px;`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setEarned(earnedAmount);

                const finishAtResult = await stakingContract.methods.finishAt().call()
                    .then((fin: any) => {
                        if (Number(fin) > 0 && currentTime < Number(fin)) {
                            remainingTime = Number(fin) - currentTime;
                            timeLeftString = formatTimestamp(remainingTime);
                        }
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setTimeLeft(timeLeftString);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Update amount to maximum stake for the user
    const stakeAll: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAmount(Number(balance));
    };

    // Update amount to maximum withdrawal for the user
    const withdrawAll: MouseEventHandler<HTMLButtonElement> = (event) => {
        setAmount(Number(staked));
    };

    // Update amount on input change
    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    };

    // Update interface on amount / allowed change
    function updateStakeButtons() {
        if (amount <= allowed) {
            $(".stakeButton").text("Stake");
        } else {
            $(".stakeButton").text("Approve");
        }
    }

    // Update interface on transaction initiation
    function openTransactionIndicator() {
        $(".transaction-overlay").removeClass("hidden background");
    }

    function closeTransactionIndicator() {
        $(".transaction-overlay").addClass("hidden");

        setTimeout(function() {
            $(".transaction-overlay").addClass("background");
        }, 500);
    }

    // Format pool-end timestamp for display
    function formatTimestamp(timestamp : any) {
        const secondsInDay = 60 * 60 * 24;
        const secondsInHour = 60 * 60;
        const secondsInMinute = 60;

        const days = Math.floor(timestamp / secondsInDay);
        timestamp -= days * secondsInDay;

        const hours = Math.floor(timestamp / secondsInHour);
        timestamp -= hours * secondsInHour;

        const minutes = Math.floor(timestamp / secondsInMinute);

        return `${days} Days ${hours} Hours ${minutes} Minutes`;
    }

    // Fetch chain information every 20 seconds
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.onload = function() {
                fetchChainInfo().then(r => console.log("%cSingle-Staking Widget: Fetched chain information", `color: green; padding: 2px;`));

                setInterval(() => {
                    fetchChainInfo().then(r => console.log("%cSingle-Staking Widget: Fetched chain information", `color: green; padding: 2px;`));
                }, 20000);
            };
        }
    }, []);

    // Update interface on amount / allowed change
    useEffect(() => {
        if (typeof $ !== 'undefined') {
            updateStakeButtons();
        }
    }, [amount, allowed]);

    // Component HTML
    return (
        <div>
            <h3>BTB Single - Staking Pool : </h3>
            <h5>Put your tokens to work</h5>
            <hr/>
            <div className="tabSet">
                <button className={"defaultTab tabLink active"}>Staking</button>
                <button className={"tabLink"}>Details</button>
            </div>
            <div id="Staking" className="tabContent">
                <div className={"singleStakingContent"}>
                    <div className={"stakingAmount"}>
                        <input type="number" value={Number(amount)} onChange={handleAmountChange} />
                        <span>BTB</span>
                    </div>
                    <button className={"stakingControl stakeButton"} onClick={handleStake}>Approve</button>
                    <button className={"stakingControl stakeAllButton"} onClick={stakeAll}>All</button>
                    <br />
                    <button className={"stakingControl withdrawButton"} onClick={handleWithdraw}>Withdraw</button>
                    <button className={"stakingControl withdrawAllButton"} onClick={withdrawAll}>All</button>
                    <ul>
                        <li>
                            <span> BTB staked :</span> <span><b>{staked}</b></span>
                        </li>
                        <li>
                            <span> BTB earned :</span> <span><b>{earned}</b></span>
                        </li>
                    </ul>
                    <button className={"stakingControl harvestButton"} onClick={harvestRewards}>Harvest Earnings</button>
                </div>
            </div>
            <div id="Details" className="tabContent">
                <ul>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Size :</h6>
                            <span className="mainSectionCardDescription">2% Supply or 20,000 BTB</span>
                        </div>
                    </li>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Length :</h6>
                            <span className="mainSectionCardDescription">3 month distribution</span>
                        </div>
                    </li>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Closes :</h6>
                            <span className="mainSectionCardDescription">{timeLeft}</span>
                        </div>
                    </li>
                    <li>
                        <br/>
                        <div className={"inlineText"}>
                            <h6> ╙ Early Adopters :</h6>
                            <span className="mainSectionCardDescription">Base reward + 25%</span>
                        </div>
                    </li>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ BTB PFP :</h6>
                            <span className="mainSectionCardDescription">Will be Base reward + 20%</span>
                        </div>
                    </li>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ Subsequent :</h6>
                            <span className="mainSectionCardDescription">Each scales down by 5%</span>
                        </div>
                    </li>
                </ul>
                <br/>
                <span className="mainSectionCardDescription">
                    <a
                        className=""
                        target="_blank"
                        rel="noreferrer"
                        href="https://goerli.etherscan.io/address/0xbe13d9086bc1df1de91e01f0ea5009753b8cddf6"
                    >
                        ➟ View on Explorer{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version={"1.0"}
                            width="294.000000pt"
                            height="294.000000pt"
                            viewBox="0 0 294.000000 294.000000"
                            preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,294.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none" >
                                <path d="M1301 2930 c-337 -43 -628 -186 -871 -430 -211 -210 -336 -441 -402 -738 -18 -78 -22 -131 -22 -272 -1 -200 15 -310 70 -477 33 -103 112 -273 142 -307 35 -38 88 -56 164 -55 120 1 168 12 200 48 l28 31 0 423 c0 406 1 423 20 455 30 49 72 62 197 62 129 0 170 -10 209 -51 l29 -30 3 -415 c2 -387 4 -415 20 -410 9 3 36 10 59 16 24 6 51 22 62 37 21 25 21 36 21 540 0 562 -1 555 58 598 23 17 46 20 164 23 150 4 182 -4 215 -55 16 -25 18 -71 23 -499 l5 -472 55 23 c66 28 95 55 104 96 3 17 6 281 6 585 l0 554 34 38 34 37 144 3 c161 4 189 -4 224 -61 18 -30 19 -58 22 -484 1 -249 5 -453 8 -453 2 0 48 35 102 77 178 141 370 340 417 432 29 56 17 137 -39 262 -232 522 -732 860 -1296 874 -74 2 -168 0 -209 -5z"/>
                            </g>
                        </svg>
                    </a>
                </span>
                <br/>
            </div>
        </div>
    );
}

export default function SingleStaking() { return (<StakingComponent /> ) }
