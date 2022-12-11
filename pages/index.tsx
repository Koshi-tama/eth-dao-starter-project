import { useState, useEffect, useMemo } from "react";
import type { NextPage } from "next";
import { ConnectWallet, ChainId, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

import { Proposal } from "@thirdweb-dev/sdk";;
import { AddressZero } from "@ethersproject/constants";

const Home: NextPage = () => {
  const address = useAddress();
  console.log("Wallet Address: ", address);

  const [network, switchNetwork] = useNetwork();

  // edition-drop: ERC1155
  const editionDrop = useContract("0x0336A48c1453512083f8d5bbf18744A9bD82F683", "edition-drop").contract;
  const token = useContract("0x4B81bee5441DA2c96ad16139e4bd26ad818b5901", "token").contract;
  const vote = useContract("0xfDb98238B9d9b348e4294aACB6Ff5526A76b13Fc", "vote").contract;

  const [hasCliamedNFT, setHasCliamedNFT] = useState(false);

  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);

  const [memberAddress, setMemberAddress] = useState<string[] | undefined>([]);

  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [isVoting, setIsVoting] = useState(false);

  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "...." + str.substring(str.length - 4);
  }

  useEffect(() => {
    if(!hasCliamedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposals = await vote!.getAll();
        setProposals(proposals);
        console.log("Proposals: ", proposals);
      } catch( error) {
        console.log("failed to get proposals", error);
      }
    }
    getAllProposals();
  }, [hasCliamedNFT, vote])

  useEffect(() => {
    if(!hasCliamedNFT) {
      return;
    }

    if(!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote!.hasVoted(proposals[0].proposalId.toString(), address);
        setHasVoted(hasVoted);
        if(hasVoted) {
          console.log("User has alredy voted!")
        } else {
          console.log("User has not voted yet!");
        }
      } catch (error) {
        console.error("Failed to che ck if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasCliamedNFT, proposals, address, vote]);

  useEffect(() => {
    if(!hasCliamedNFT) {
      return;
    }

    const getAllAddress = async () => {
      try {
        const memberAddress = await editionDrop?.history.getAllClaimerAddresses(
          0
        );
        setMemberAddress(memberAddress);
        console.log("Mmebers Address:", memberAddress);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddress();
  }, [hasCliamedNFT, editionDrop?.history]);
  
  useEffect(() => {
    if(!hasCliamedNFT) {
      return;
    }

    const getAllBalance = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("Amounts", amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalance();
  }, [hasCliamedNFT, editionDrop?.history]);

  const memberList = useMemo(() => {
    return memberAddress?.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }: {holder: string}) => holder === address);

      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddress, memberTokenAmounts]);

  useEffect(() => {
    if(!address) {
      return;
    }
    const checkBalance = async () => {
      try {
        //第二引数はtoken idを設定 ※初期ローディング時に
        const balance = await editionDrop?.balanceOf(address, 0);
        console.log("Baqlance: " + balance);
        if (balance?.gt(0)) {
          setHasCliamedNFT(true);
          console.log("this user has a member ship!")
        } else {
          setHasCliamedNFT(false);
          console.log("this user doesn't have a member NFT.")
        }
      }catch(error) {
        setHasCliamedNFT(false);
        console.error("failed to get balanmce", error);
      }
    };

    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim("0", 1);
      console.log(
        `successfully Minted! Check it out on Opensea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`
      );
      setHasCliamedNFT(true);
    }catch(error) {
      setHasCliamedNFT(false);
      console.error("failed to mint NFT!", error);
    } finally {
      setIsClaiming(false);
    }
  }

  if(!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to Labo DAO!!
          </h1>
          <p></p>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  } else if (address && network && network?.data?.chain?.id !== ChainId.Goerli) {
    console.log("wallet address : ", address);
    console.log("network: ", network?.data?.chain?.id);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Goerliにきりかえてください。
          </h1>
          <p>このdAppはGoerliネットワークのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  } else if (hasCliamedNFT) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
        <h1 className={styles.title}>🍪DAO Member Page</h1>
        <p>Congratulations on being a member</p>
          <div>
            <div>
              <h2>■ Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList!.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <h2>■ Active Proposals</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // ダブルクリックを防ぐためにボタンを無効化します
                  setIsVoting(true);

                  // フォームから値を取得します
                  const votes = proposals.map((proposal) => {
                    const voteResult = {
                      proposalId: proposal.proposalId,
                      vote: 2,
                    };
                    proposal.votes.forEach((vote) => {
                      const elem = document.getElementById(
                        proposal.proposalId + "-" + vote.type
                      ) as HTMLInputElement;

                      if (elem!.checked) {
                        voteResult.vote = vote.type;
                        return;
                      }
                    });
                    return voteResult;
                  });

                  // ユーザーが自分のトークンを投票に委ねることを確認する必要があります
                  try {
                    // 投票する前にウォレットがトークンを委譲する必要があるかどうかを確認します
                    const delegation = await token!.getDelegationOf(address);
                    // トークンを委譲していない場合は、投票前に委譲します
                    if (delegation === AddressZero) {
                      await token!.delegateTo(address);
                    }
                    // 提案に対する投票を行います
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId, vote: _vote }) => {
                          // 提案に投票可能かどうかを確認します
                          const proposal = await vote!.get(proposalId);
                          // 提案が投票を受け付けているかどうかを確認します
                          if (proposal.state === 1) {
                            return vote!.vote(proposalId.toString(), _vote);
                          }
                          return;
                        })
                      );
                      try {
                        // 提案が実行可能であれば実行する
                        await Promise.all(
                          votes.map(async ({ proposalId }) => {
                            const proposal = await vote!.get(proposalId);

                            // state が 4 の場合は実行可能と判断する
                            if (proposal.state === 4) {
                              return vote!.execute(proposalId.toString());
                            }
                          })
                        );
                        // 投票成功と判定する
                        setHasVoted(true);
                        console.log("successfully voted");
                      } catch (err) {
                        console.error("failed to execute votes", err);
                      }
                    } catch (err) {
                      console.error("failed to vote", err);
                    }
                  } catch (err) {
                    console.error("failed to delegate tokens");
                  } finally {
                    setIsVoting(false);
                  }
                }}
              >
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId.toString()} className="card">
                    <h5>{proposal.description}</h5>
                    <div>
                      {proposal.votes.map(({ type, label }) => (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + "-" + type}
                            name={proposal.proposalId.toString()}
                            value={type}
                            // デフォルトで棄権票をチェックする
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + "-" + type}>
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p></p>
                <button disabled={isVoting || hasVoted} type="submit">
                  {isVoting
                    ? "Voting..."
                    : hasVoted
                      ? "You Already Voted"
                      : "Submit Votes"}
                </button>
                <p></p>
                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to
                    sign.
                  </small>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
    } else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Mint your free DAO Membership NFT
          </h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Minting..." : "Mint your nft {FREE}"}
          </button>
        </main>
      </div>
    )
  }
};

export default Home;
