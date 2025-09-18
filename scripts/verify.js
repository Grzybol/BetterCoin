const { run } = require("hardhat");
const dotenv = require("dotenv");

dotenv.config();

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.replace(/^--/, "");
      const value = args[i + 1];
      result[key] = value;
      i += 1;
    }
  }
  return result;
}

async function main() {
  const args = parseArgs();
  const address = args.address || args.token || process.env.CONTRACT_ADDRESS;
  const owner = args.owner || process.env.OWNER_ADDRESS;

  if (!address || !owner) {
    throw new Error("Contract address and owner address are required. Use --address <addr> --owner <addr> or set CONTRACT_ADDRESS and OWNER_ADDRESS.");
  }

  await run("verify:verify", {
    address,
    constructorArguments: [owner],
  });

  console.log(`Verification requested for ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
