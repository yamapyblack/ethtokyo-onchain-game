import { ethers } from "hardhat";
import { BattleCommitAndReveal } from "../typechain-types/index";

async function main() {
  const battleAddress = "0x1F10736a2CAcCc02DED83f7B2d3D7Fd45AC824De";
  //set merkle root
  const battle = (await ethers.getContractAt(
    "BattleCommitAndReveal",
    battleAddress
  )) as BattleCommitAndReveal;
  const tx = await battle.setstageSpan(10000000000);
  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
