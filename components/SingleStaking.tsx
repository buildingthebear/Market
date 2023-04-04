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
            <h3>BTB Single-Staking : </h3>
            <h5>Earn a little extra</h5>
            <hr/>
            <div className={"singleStakingContent"}>
                <ul>
                    <li>
                        <span className="mainSectionCardDescription">Pool: 2% Supply Distributed over 3 months time, starting May 2023</span>
                        <br/><br/>
                    </li>
                    <li>
                        <span> BTB staked :</span> <span><b>{staked}</b></span>
                    </li>
                    <li>
                        <span> BTB earned :</span> <span><b>{earned}</b></span>
                    </li>
                </ul>
                <input type="number" value={Number(amount)} onChange={handleAmountChange} />
                <button onClick={handleStake}>Stake</button>
                <button onClick={handleWithdraw}>Withdraw</button>
                <button onClick={harvestRewards}>Harvest Earnings</button>
            </div>
        </div>
    );
}

export default function SingleStaking() { return (<StakingComponent /> ) }
