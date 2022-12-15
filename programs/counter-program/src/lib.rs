use anchor_lang::prelude::*;

declare_id!("2QmXMXyMAmZCE92Uqm2YhKgpqH3Teo6vZDNg7CRHYCK7");

#[program]
pub mod counter_program {
    use super::*;

    pub fn create(ctx: Context<Create>) -> Result<()> {
        ctx.accounts.counter.authority = ctx.accounts.authority.key();
        ctx.accounts.counter.count = 0;

        msg!("Created account {} with authority/signer {}",ctx.accounts.counter.key(), ctx.accounts.authority.key());
        Ok(())
    }

    pub fn increment(ctx: Context<CounterAccess>) -> Result<()> {
        ctx.accounts.counter.count += 1;

        msg!("Incremented account {}: {}",ctx.accounts.counter.key(), ctx.accounts.counter.count);
        Ok(())
    }

    pub fn decrement(ctx: Context<CounterAccess>) -> Result<()> {
        ctx.accounts.counter.count -= 1;

        msg!("Decremented account {}: {}",ctx.accounts.counter.key(), ctx.accounts.counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CounterAccess<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, Counter>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = authority, space = 8 + 40)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
}
