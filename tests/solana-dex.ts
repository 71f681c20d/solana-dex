import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaDex } from "../target/types/solana_dex";
import * as splToken from "@solana/spl-token";
import { TOKEN_SWAP_PROGRAM_ID } from "@solana/spl-token-swap";
import { SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
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

    let x_mint;
    let y_mint;
    let token_x_account;
    let token_y_account;

    let swapAuthority;
    let bump;


  it("Initialize token swap account", async () => {
    const tx = await program.methods
      .initializeTokenSwapAccount()
      .accounts({
        signer: owner,
        tokenSwapAccount: tokenSwapStateAccount.publicKey,
        tokenSwapProgram: TOKEN_SWAP_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tokenSwapStateAccount])
      .rpc();
    console.log(
      "Token Swap State Account: " +
      tokenSwapStateAccount.publicKey.toString()
    );
    // const commitment: Commitment = "confirmed";
    const tokenSwapAccountInfo = await provider.connection.getAccountInfo(
      tokenSwapStateAccount.publicKey
    );
    assert.equal(
      tokenSwapAccountInfo.owner.toString(),
      TOKEN_SWAP_PROGRAM_ID.toString()
    );
  });

  it("Initialize Mint Accounts", async () => {
    x_mint = anchor.web3.Keypair.generate();
    y_mint = anchor.web3.Keypair.generate();
    console.log("Mint Authority :: " + mintAuthority.publicKey.toString());
    console.log("x_mint :: " + x_mint.publicKey.toString());
    console.log("y_mint :: " + y_mint.publicKey.toString());
    const tx = await program.methods
      .initializeMintAccounts()
      .accounts({
        signer: owner,
        mintAuthority: mintAuthority.publicKey,
        xMint: x_mint.publicKey,
        yMint: y_mint.publicKey,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([x_mint, y_mint])
      .rpc();
  });

  it("Initialize swap pool Authority (PDA), and Token Accounts", async () => {
    [swapAuthority, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [tokenSwapStateAccount.publicKey.toBuffer()],
      TOKEN_SWAP_PROGRAM_ID
    );
    console.log("Swap Pool Authority :: " + swapAuthority.toString());

    token_x_account = anchor.web3.Keypair.generate();
    console.log(`token_x_account :: `, token_x_account.publicKey.toString());

    token_y_account = anchor.web3.Keypair.generate();
    console.log(`token_y_account :: `, token_y_account.publicKey.toString());

    const tx = await program.methods
      .initializeTokenAccounts()
      .accounts({
        signer: owner,
        tokenAuthority: swapAuthority,
        xMint: x_mint.publicKey,
        yMint: y_mint.publicKey,
        tokenXAccount: token_x_account.publicKey,
        tokenYAccount: token_y_account.publicKey,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([token_x_account, token_y_account])
      .rpc();
  });

});
