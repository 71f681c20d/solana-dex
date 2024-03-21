use anchor_lang::prelude::*;
use spl_token_swap::state::SwapVersion;
use anchor_spl::token::{ Mint, Token, TokenAccount };

declare_id!("GBgHzis7UarrQYHo9viMjhzVEAcVvo7KLPbyShwdWA2M");

#[program]
pub mod solana_dex {
    use super::*;

    pub fn initialize_token_swap_account(ctx: Context<InitializeTokenSwapAccount>) -> Result<()> {
        msg!("Created Token Swap State Account---");
        Ok(())
    }

    pub fn initialize_mint_accounts(ctx: Context<InitializeMintAccounts>) -> Result<()> {
        msg!("Created Token X Mint Account---");
        msg!("Created Token Y Mint Account---");
        Ok(())
    }

    pub fn initialize_token_accounts(ctx: Context<InitializeTokenAccounts>) -> Result<()> {
        msg!("Created Token X Account---");
        msg!("Created Token Y Account---");
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
    /// CHECK: This is safe since we don't read or write from this account
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

#[derive(Accounts)]
pub struct InitializeTokenAccounts<'info> {
    #[account(mut)]
    signer: Signer<'info>, // Signer
    /// CHECK: This is not dangerous because we don't read or write from this account
    token_authority: AccountInfo<'info>, // Authority of the token Accounts
    x_mint: Account<'info, Mint>,  // X-mint
    y_mint: Account<'info, Mint>,  // Y-mint
    #[account(
        init,
        payer=signer,
        token::mint = x_mint,
        token::authority = token_authority,
    )]
    token_x_account: Account<'info, TokenAccount>, // Token X ATA
    #[account(
        init,
        payer=signer,
        token::mint = y_mint,
        token::authority = token_authority,
    )]
    token_y_account: Account<'info, TokenAccount>, // Token Y ATA
    token_program: Program<'info, Token>, // Token Program
    rent: Sysvar<'info, Rent>,     // Rent
    system_program: Program<'info, System>, // System Program
}

