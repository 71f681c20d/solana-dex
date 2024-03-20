use anchor_lang::prelude::*;

declare_id!("GBgHzis7UarrQYHo9viMjhzVEAcVvo7KLPbyShwdWA2M");

#[program]
pub mod solana_dex {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
