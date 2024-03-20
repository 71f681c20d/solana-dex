use anchor_lang::prelude::*;
use spl_token_swap::state::SwapVersion;
use anchor_spl::token::{Mint, Token };

declare_id!("GBgHzis7UarrQYHo9viMjhzVEAcVvo7KLPbyShwdWA2M");

#[program]
pub mod solana_dex {
    use super::*;

    pub fn initialize_token_swap_account(ctx: Context<InitializeTokenSwapAccount>) -> Result<()> {
        msg!("Created Token Swap State Account---");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTokenSwapAccount<'info> {
    #[account(mut)]
    signer: Signer<'info>, 
    #[account(
        init, 
        payer=signer, 
        space=SwapVersion::LATEST_LEN, 
        owner=token_swap_program.key()
    )]
    /// CHECK: This is safe since we don't read or write from this account
    token_swap_account: AccountInfo<'info>, 
    /// CHECK: This is safe since we don't read or write from this account
    token_swap_program: AccountInfo<'info>, 
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeMintAccounts<'info> {
    #[account(mut)]
    signer: Signer<'info>, 
    /// CHECK: This is not dangerous because we don't read or write from this account
    mint_authority: AccountInfo<'info>, 
    #[account(
        init, 
        payer=signer, 
        mint::decimals = 9, 
        mint::authority = mint_authority
    )]
    x_mint: Account<'info, Mint>,
    #[account(
        init, 
        payer=signer, 
        mint::decimals = 9, 
        mint::authority = mint_authority
    )]
    y_mint: Account<'info, Mint>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
}

