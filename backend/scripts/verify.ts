import env, { ethers } from "hardhat";

const Verify = async (address: string, args: any[]) => {
  try {
    await env.run("verify:verify", {
      address: address,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message === "Missing or invalid ApiKey") {
      console.log("Skip verifing with", e.message);
      return;
    }
    if (e.message === "Contract source code already verified") {
      console.log("Skip verifing with", e.message);
      return;
    }
    throw e;
  }
};

const main = async () => {
  await Verify("0x15EBaAD8717A6B71116ffAF1E0FD4A3b4DE0F96C", []);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
