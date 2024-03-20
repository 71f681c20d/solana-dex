import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaDex } from "../target/types/solana_dex";
import { assert } from "chai";

describe("solana-dex", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaDex as Program<SolanaDex>;

  const owner = provider.wallet.publicKey;
  const signer = provider.wallet;
  const mintAuthority = anchor.web3.Keypair.generate();

  const tokenSwapStateAccount = anchor.web3.Keypair.generate();

  it("Initialize token swap account", async () => {
    const tx = await program.methods
      .initializeTokenSwapAccount()
      .accounts({
        signer: owner,
        tokenSwapAccount: tokenSwapStateAccount.publicKey,
        tokenSwapProgram: program.programId,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tokenSwapStateAccount])
      .rpc();
    console.log(
      "Token Swap State Account :: " +
      tokenSwapStateAccount.publicKey.toString()
    );
    // const commitment: Commitment = "confirmed";
    const tokenSwapAccountInfo = await provider.connection.getAccountInfo(
      tokenSwapStateAccount.publicKey
    );
    assert.equal(
      tokenSwapAccountInfo.owner.toString(),
      program.programId.toString()
    );
  });
});
