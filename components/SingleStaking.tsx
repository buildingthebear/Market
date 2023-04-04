import React, { ChangeEvent, useState, useEffect } from 'react';
import Web3 from "web3";
import TokenABI from "../contracts/BuildtheBearToken.json";
import StakingABI from "../contracts/BuildtheBearSingleStake.json";
import {AbiItem} from "web3-utils";

const web3 = new Web3(Web3.givenProvider || process.env.JSON_RPC_URL);
const tokenContract = new web3.eth.Contract(TokenABI as AbiItem[], "0x408C02545C554EEBBc5811F92354F726F97C1D56");
const stakingContract = new web3.eth.Contract(StakingABI as AbiItem[], "0xD5dF35F66ecfbA2aD8E608eA7196b990BEC04862");

// List order of events
// Loads, is connected, checks approval amount, prompts if applicable on stake, otherwise just stake
//leading zero doesn't dissappear on input click

function StakingComponent() {
    const [amount, setAmount] = useState(0);
    const [staked, setStaked] = useState("0");
    const [earned, setEarned] = useState("0");

    const handleStake = async()  => {
        try {
            if (window.ethereum !== undefined) {
                const accounts = await web3.eth.requestAccounts();
                const amountWei = BigInt(web3.utils.toWei(amount.toString(), 'ether'));
                const amountInt = Number(amountWei / BigInt(10**9));

                let amountAllowed = "0";

                const allowanceResult = await tokenContract.methods.allowance(accounts[0], stakingContract.options.address).call()
                    .then((allowance: any) => {
                        amountAllowed = String(allowance) + "000000000";
                        console.log(`Token allowance for owner ${accounts[0]} and spender ${stakingContract.options.address}: ${allowance}`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                let allowedInt = Number(BigInt(amountAllowed) / BigInt(10**9));

                if (allowedInt < amountInt) {
                    // Linter doesn't like the number of parameters, but this works
                    const approveResult = await tokenContract.methods.approve(stakingContract.options.address, amountInt).send({from: accounts[0]});
                    const approveTxHash = approveResult.transactionHash;
                    console.log("Approved", approveTxHash);
                }

                const stakeResult = await stakingContract.methods.stake(amountInt).send({from: accounts[0]});
                const stakeTxHash = stakeResult.transactionHash;
                console.log("Staked", stakeTxHash);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleWithdraw = async()  => {
        let amountBalance = "0";

        try {
            if (window.ethereum !== undefined) {
                const accounts = await web3.eth.requestAccounts();
                const amountWei = BigInt(web3.utils.toWei(amount.toString(), 'ether'));
                const amountInt = Number(amountWei / BigInt(10**9));

                const balanceResult = await stakingContract.methods.balanceOf(accounts[0]).call()
                    .then((balance: any) => {
                        amountBalance = String(balance) + "000000000";
                        console.log(`Balance of ${accounts[0]}: ${balance}`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                let balanceInt = Number(BigInt(amountBalance) / BigInt(10**9));

                if (balanceInt >= amountInt) {
                    const stakeResult = await stakingContract.methods.withdraw(amountInt).send({from: accounts[0]});
                    const stakeTxHash = stakeResult.transactionHash;
                    console.log("Un-staked", stakeTxHash);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkRewards = async()  => {
        let accruedRewards = "0";
        let stakedAmount = "0";

        try {
            if (window.ethereum !== undefined) {
                const accounts = await web3.eth.requestAccounts();

                const rewardsResult = await stakingContract.methods.earned(accounts[0]).call()
                    .then((ar: any) => {
                        if (ar > 0) { accruedRewards = String(ar).slice(0, -9); }
                        console.log(`Rewards earned by ${accounts[0]}: ${ar}`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setEarned(accruedRewards);

                const balanceResult = await stakingContract.methods.balanceOf(accounts[0]).call()
                    .then((balance: any) => {
                        if (balance > 0) { stakedAmount = String(balance).slice(0, -9); }
                        console.log(`Balance of ${accounts[0]}: ${balance}`);
                    }).catch((error: any) => {
                        console.error(error);
                    });

                setStaked(stakedAmount);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // figure out how to display pool information and btb collection scaling

    const harvestRewards = async()  => {
        try {
            if (window.ethereum !== undefined) {
                const accounts = await web3.eth.requestAccounts();

                const harvestResult = await stakingContract.methods.getReward().send({from: accounts[0]});
                const harvestTxHash = harvestResult.transactionHash;
                console.log("Harvested", harvestTxHash);

                setEarned("0")
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    };

    checkRewards().then(() => { console.log("Fetched account information"); }).catch((error: any) => {
        console.error(error);
    });

    function stakingInit() {
        checkRewards().then(() => { console.log("Fetched account information"); }).catch((error: any) => {
            console.error(error);
        });
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.onload = function() {
                setInterval(stakingInit, 20000);
            };
        }
    }, []);

    return (
        <div>
            <h3>BTB Single-Staking Pool: </h3>
            <h5>Earn a little extra</h5>
            <hr/>
            <div className="tabSet">
                <button className={"defaultTab tabLink active"}>Staking Controls</button>
                <button className={"tabLink"}>Pool Details</button>
            </div>
            <div id="StakingControls" className="tabContent">
                <div className={"singleStakingContent"}>
                    <ul>
                        <li>
                            <span> BTB staked :</span> <span><b>{staked}</b></span>
                        </li>
                        <li>
                            <span> BTB earned :</span> <span><b>{earned}</b></span>
                        </li>
                    </ul>
                    <input type="number" value={Number(amount)} onChange={handleAmountChange} />
                    <br />
                    <button className={"stakingControl"} onClick={handleStake}>Stake</button>
                    <button className={"stakingControl"} onClick={handleWithdraw}>Withdraw</button>
                    <button className={"stakingControl"} onClick={harvestRewards}>Harvest Earnings</button>
                </div>
            </div>
            <div id="PoolDetails" className="tabContent">
                <ul>
                    <li>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Opens :</h6>
                            <span className="mainSectionCardDescription">On May 1st 2023</span>
                        </div>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Length :</h6>
                            <span className="mainSectionCardDescription">3 month distribution</span>
                        </div>
                        <div className={"inlineText"}>
                            <h6> ╙ Pool Amount :</h6>
                            <span className="mainSectionCardDescription">2% supply available</span>
                        </div>
                        <br/>
                        <br/>
                        <div className={"inlineText"}>
                            <h6> ╙ Early Adopters :</h6>
                            <span className="mainSectionCardDescription">Base reward + 25%</span>
                        </div>
                    </li>
                </ul>
                <br/><br/>
                <span className="mainSectionCardDescription">
                    <a
                        className=""
                        target="_blank"
                        rel="noreferrer"
                        href="https://etherscan.io/token/0xAB8FEfd4CbB4884491053A1d84E7Af17317dA40C"
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
            </div>
        </div>
    );
}

export default function SingleStaking() { return (<StakingComponent /> ) }
