"use client";

// Font
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Styles
import "../styles/globals.css";
import Link from "next/link";

import React, { useMemo } from "react";
import { AppProps } from "next/app";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint = useMemo(() => "https://api.devnet.solana.com", []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <div className="bg-black p-8 rounded shadow-md text-center text-white">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Anchor Escrow UI
            </h1>
            <div className="flex flex-wrap justify-center">
              <Link
                href="/create-escrow"
                className="bg-purple-500 text-white px-4 py-2 rounded m-2"
              >
                Create Escrow
              </Link>
              <Link
                href="/refund-escrow"
                className="bg-purple-500 text-white px-4 py-2 rounded m-2"
              >
                Refund Escrow
              </Link>
              <Link
                href="/take-escrow"
                className="bg-purple-500 text-white px-4 py-2 rounded m-2"
              >
                Take Escrow
              </Link>
            </div>
          </div>
        </header>

        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <div className="m-4">
                <WalletMultiButton className="bg-purple-500 text-white" />
              </div>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
