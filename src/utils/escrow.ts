import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import idl from "@/lib/idl.json";

const ESCROW_PROGRAM_ID = new PublicKey(idl.metadata.address);
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const getProvider = () => {
  const connection = new Connection("https://api.devnet.solana.com");
  const wallet = window.solana;
  console.log(
    "Creating provider with connection:",
    connection,
    " and wallet:",
    wallet
  );
  return new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
};

const getProgram = () => {
  const provider = getProvider();
  console.log("Loading program with IDL:", idl, " and provider:", provider);
  return new Program(idl as any, ESCROW_PROGRAM_ID, provider);
};

export const createEscrow = async (
  seed: number,
  deposit: number,
  receive: number
): Promise<string> => {
  console.log(
    "Initializing createEscrow with seed:",
    seed,
    ", deposit:",
    deposit,
    ", receive:",
    receive
  );
  const program = getProgram();
  const provider = program.provider;
  const maker = provider.publicKey;

  if (!maker) {
    throw new Error("Maker's public key is undefined.");
  }

  console.log("Maker PublicKey:", maker.toBase58());

  console.log("Finding program address");
  const [escrowPda] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      maker.toBuffer(),
      new BN(seed).toArrayLike(Buffer, "le", 8),
    ],
    ESCROW_PROGRAM_ID
  );

  console.log("Escrow PDA:", escrowPda.toBase58());

  console.log("Getting associated token addresses");
  const makerAtaA = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, maker);
  console.log("Maker ATA (A):", makerAtaA.toBase58());
  const vault = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, escrowPda);
  console.log("Vault:", vault.toBase58());

  console.log("Creating escrow transaction");
  const tx = await program.methods
    .make(new BN(seed), new BN(deposit), new BN(receive))
    .accounts({
      maker,
      mintA: makerAtaA,
      mintB: vault,
      makerAtaA,
      escrow: escrowPda,
      vault,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Transaction signature:", tx);
  return tx;
};

export const refundEscrow = async (seed: number): Promise<string> => {
  console.log("Initializing refundEscrow with seed:", seed);
  const program = getProgram();
  const provider = program.provider;
  const maker = provider.publicKey;

  if (!maker) {
    throw new Error("Maker's public key is undefined.");
  }

  console.log("Maker PublicKey:", maker.toBase58());

  console.log("Finding program address");
  const [escrowPda] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      maker.toBuffer(),
      new BN(seed).toArrayLike(Buffer, "le", 8),
    ],
    ESCROW_PROGRAM_ID
  );

  console.log("Escrow PDA:", escrowPda.toBase58());

  console.log("Getting associated token addresses");
  const makerAtaA = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, maker);
  console.log("Maker ATA (A):", makerAtaA.toBase58());
  const vault = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, escrowPda);
  console.log("Vault:", vault.toBase58());

  console.log("Creating refund transaction");
  const tx = await program.methods
    .refund()
    .accounts({
      maker,
      mintA: makerAtaA,
      makerAtaA,
      escrow: escrowPda,
      vault,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Transaction signature:", tx);
  return tx;
};

export const takeEscrow = async (seed: number): Promise<string> => {
  console.log("Initializing takeEscrow with seed:", seed);
  const program = getProgram();
  const provider = program.provider;
  const taker = provider.publicKey;

  if (!taker) {
    throw new Error("Taker's public key is undefined.");
  }

  console.log("Taker PublicKey:", taker.toBase58());

  console.log("Finding program address");
  const [escrowPda] = await PublicKey.findProgramAddress(
    [
      Buffer.from("escrow"),
      taker.toBuffer(),
      new BN(seed).toArrayLike(Buffer, "le", 8),
    ],
    ESCROW_PROGRAM_ID
  );

  console.log("Escrow PDA:", escrowPda.toBase58());

  console.log("Getting associated token addresses");
  const takerAtaA = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, taker);
  console.log("Taker ATA (A):", takerAtaA.toBase58());
  const takerAtaB = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, taker);
  console.log("Taker ATA (B):", takerAtaB.toBase58());
  const makerAtaB = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, taker);
  console.log("Maker ATA (B):", makerAtaB.toBase58());
  const vault = await getAssociatedTokenAddress(TOKEN_PROGRAM_ID, escrowPda);
  console.log("Vault:", vault.toBase58());

  console.log("Creating take transaction");
  const tx = await program.methods
    .take()
    .accounts({
      taker,
      mintA: takerAtaA,
      mintB: takerAtaB,
      takerAtaA,
      takerAtaB,
      makerAtaB,
      escrow: escrowPda,
      vault,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Transaction signature:", tx);
  return tx;
};
