import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CounterProgram } from "../target/types/counter_program";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("counter-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env())
  const provider = anchor.AnchorProvider.env()
  const program = anchor.workspace.CounterProgram as Program<CounterProgram>

	// create counter keypair
  let counter = Keypair.generate()

  it("Create Counter account!", async () => {
    const tx = await program.methods.create()
    .accounts({
      counter: counter.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([counter])
    .rpc()
    console.log("Your transaction signature", tx)

    let state = await program.account.counter.fetch(counter.publicKey);
    expect(state.count.toNumber()).to.equal(0);
  });

  it("Increment twice adds two.", async () => {
    let tx = await program.methods.increment()
    .accounts({
      counter: counter.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()
    console.log("First transaction signature", tx)

    let state = await program.account.counter.fetch(counter.publicKey);
    expect(state.count.toNumber()).to.equal(1);
    
    tx = await program.methods.increment()
    .accounts({
      counter: counter.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()
    console.log("First transaction signature", tx)

    state = await program.account.counter.fetch(counter.publicKey);
    expect(state.count.toNumber()).to.equal(2);
  });

  it("Decrement removes one.", async () => {
    let tx = await program.methods.decrement()
    .accounts({
      counter: counter.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()
    console.log("First transaction signature", tx)

    let state = await program.account.counter.fetch(counter.publicKey);
    expect(state.count.toNumber()).to.equal(1);
  });
});
