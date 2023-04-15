import { ethers } from "hardhat";
import { BattleCommitAndReveal } from "../typechain-types/index";

async function main() {
  const battleAddress = "0xcd5A2BA5883CBFc341094f8fcdF96e9b18F6B529";
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
