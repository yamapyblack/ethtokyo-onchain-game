import { ethers } from "hardhat";
import { BattleCommitAndReveal } from "../typechain-types/index";

async function main() {
  const battleAddress = "0x35e369Aa802a996F3c4A3debA04425F06175609D";
  //set merkle root
  const battle = (await ethers.getContractAt(
    "BattleCommitAndReveal",
    battleAddress
  )) as BattleCommitAndReveal;
  const tx = await battle.forceReset();
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
