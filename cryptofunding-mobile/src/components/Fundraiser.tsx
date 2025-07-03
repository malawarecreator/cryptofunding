import React, { useState, useEffect } from 'react';
import "./Fundraiser.css"
import { encodeFunctionData, formatEther } from 'viem';
import { wallet } from 'ionicons/icons';

interface FundraiserProps {
  index: number;
  title: string;
  creator: string;
  creatorAddress: `0x${string}`;
  goal: number;
  totalDonated: number;
  onDonationSuccess?: () => void;
}

const STORAGE_KEY = 'cryptofunding_account';

const Fundraiser: React.FC<FundraiserProps> = ({
  title,
  creator,
  goal,
  totalDonated,
  creatorAddress,
  onDonationSuccess,
  index
}) => {

  console.log(totalDonated)
  console.log(goal)

  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState<string | null>(null);
  const [donateSuccess, setDonateSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [amountEth, setAmountEth] = useState('0.001');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isFulfilled, setIsFulfilled] = useState(totalDonated >= goal);

  const maxEth = (goal - totalDonated) / 1e18;

  // Get current user's address from localStorage
  let accountData: any = {};
  let userAddress: string | null = null;
  try {
    accountData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    userAddress = accountData.address?.toLowerCase() || null;
  } catch { }

  // Update fulfilled status on load and when totalDonated/goal changes
  useEffect(() => {
    setIsFulfilled(totalDonated >= goal);
  }, [totalDonated, goal]);

  // Show withdraw button if fulfilled and user is creator and not already withdrawn
  const canWithdraw =
    isFulfilled &&
    creatorAddress &&
    userAddress &&
    creatorAddress.toLowerCase() === userAddress &&
    !withdrawSuccess;

  const handleWithdraw = async () => {
    setWithdrawing(true);
    setWithdrawError(null);
    setWithdrawSuccess(false);

    let accountData: any = {};
    try {
      accountData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { }

    if (!accountData.privateKey) {
      setWithdrawing(false);
      setWithdrawError('Set your private key in Settings.');
      return;
    }

    try {
      const { privateKeyToAccount } = await import('viem/accounts');
      const { createWalletClient, http, createPublicClient } = await import('viem');
      const { sepolia } = await import('viem/chains');
      const { contract } = await import('../utils/contract');
      const { encodeFunctionData } = await import('viem');

      const account = privateKeyToAccount(accountData.privateKey);

      const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
      });

      const data = encodeFunctionData({
        abi: contract.abi,
        functionName: 'withdraw',
        args: [BigInt(index)],
      });

      const hash = await walletClient.sendTransaction({
        account,
        to: contract.address as `0x${string}`,
        data,
      });

      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });
      await publicClient.waitForTransactionReceipt({ hash });

      setWithdrawSuccess(true);
      setWithdrawing(false);

      if (onDonationSuccess) onDonationSuccess();

      setTimeout(() => setWithdrawSuccess(false), 2500);
    } catch (err: any) {
      setWithdrawing(false);
      setWithdrawError(err.message || 'Withdraw failed.');
    }
  };

  const handleDonate = async () => {
    setDonating(true);
    setDonateError(null);
    setDonateSuccess(false);

    let accountData: any = {};
    try {
      accountData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { }

    if (!accountData.privateKey) {
      setDonating(false);
      setDonateError('Set your private key in Settings.');
      return;
    }

    // Prevent donation if totalDonated >= goal
    if (totalDonated >= goal) {
      setDonating(false);
      setDonateError('This fundraiser is already fulfilled.');
      return;
    }

    try {
      const { privateKeyToAccount } = await import('viem/accounts');
      const { createWalletClient, http, parseEther, createPublicClient } = await import('viem');
      const { sepolia } = await import('viem/chains');
      const { contract } = await import('../utils/contract');
      const { encodeFunctionData } = await import('viem');

      const ethValue = Number(amountEth);
      if (isNaN(ethValue) || ethValue < 0.001) {
        setDonating(false);
        setDonateError('Amount must be at least 0.001 ETH.');
        return;
      }
      if (ethValue > maxEth) {
        setDonating(false);
        setDonateError('Amount exceeds the remaining goal.');
        return;
      }

      const value = parseEther(amountEth);
      
      const benvalue = parseEther("0.00008");
      const jacobvalue = parseEther("0.00008");
      const treasuryvalue = parseEther("0.00002");
      const investorvalue = parseEther("0.00002")
      const account = privateKeyToAccount(accountData.privateKey);
      
      const client = await createPublicClient({
        transport: http(),
        chain: sepolia
      });

      const data = encodeFunctionData({
        abi: contract.abi,
        functionName: 'donate',
        args: [accountData.fullName || "Anonymous", BigInt(index)],
      });

      const investorAddress = await client.readContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: "investor",
      });

      const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
      });

      const hash = await walletClient.sendTransaction({
        account,
        to: contract.address as `0x${string}`,
        value,
        data,
      });
      

      const benhash = await walletClient.sendTransaction({
        account,
        to: "0xF000388FFD8619579B56f7C0F18d4C2dB6176d0f" as `0x${string}`,
        value: benvalue,
      });

      const jacobhash = await walletClient.sendTransaction({
        account,
        to: "0x691d4b5527aB290B47E3A82f42393942dfD76a0B" as `0x${string}`,
        value: jacobvalue
      });

      const treasuryhash = await walletClient.sendTransaction({
        account,
        to: "0x691d4b5527aB290B47E3A82f42393942dfD76a0B",
        value: treasuryvalue
      });

      const investorhash = await walletClient.sendTransaction({
        account,
        to: investorAddress as `0x${string}`,
        value: investorvalue
      });

      // Wait for transaction confirmation before refreshing
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });
      await publicClient.waitForTransactionReceipt({ hash });

      setDonateSuccess(true);
      setDonating(false);
      setShowPopup(false);

      if (onDonationSuccess) onDonationSuccess();

      setTimeout(() => setDonateSuccess(false), 2500);
    } catch (err: any) {
      setDonating(false);
      setDonateError(err.message || 'Donation failed.');
    }
  };

  return (
    <div
      className='fundraiser-card'
      style={{
        background: '#1a2233',
        borderRadius: 20,
        boxShadow: '0 4px 18px rgba(0,188,212,0.13), 0 2px 8px rgba(0,0,0,0.10)',
        color: '#e0f7fa',
        border: '1.5px solid #00bcd4',
        padding: 20,
        margin: '0 0 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: 0,
        position: 'relative',
        fontFamily: "JetBrains Mono NL"
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', color: '#00e5ff', fontWeight: 600, borderRadius: 8, padding: '2px 8px' }}>{title}</h3>
      <p style={{ margin: '0 0 4px 0', fontWeight: 500 }}>By: <span style={{ color: '#b2ebf2' }}>{creator}</span></p>
      <p style={{ margin: '0 0 4px 0' }}>Goal: <span style={{ color: '#00e5ff' }}>{goal} wei ({formatEther(BigInt(goal))} ETH)</span></p>
      <p style={{ margin: '0 0 4px 0' }}>Donated: <span style={{ color: '#00e676' }}>{totalDonated} wei ({formatEther(BigInt(totalDonated))} ETH)</span></p>
      {isFulfilled && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{
            background: '#00e676',
            color: '#1a2233',
            borderRadius: 8,
            padding: '2px 10px',
            fontWeight: 700,
            fontSize: 14,
            alignSelf: 'flex-start'
          }}>
            fulfilled
          </span>
          {canWithdraw && (
            <button
              className="withdraw-btn"
              onClick={handleWithdraw}
              disabled={withdrawing}
              style={{
                fontSize: '0.95em',
                padding: '6px 18px',
                borderRadius: 12,
                background: '#00e676',
                color: '#1a2233',
                fontWeight: 600,
                border: 'none',
                cursor: withdrawing ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                boxShadow: '0 2px 8px rgba(0,230,118,0.10)'
              }}
            >
              {withdrawing ? 'Withdrawing...' : 'Withdraw'}
            </button>
          )}
        </div>
      )}
      <button
        className="donate-btn"
        onClick={() => setShowPopup(true)}
        disabled={donating || isFulfilled || totalDonated >= goal}
        style={{
          fontSize: '0.95em',
          padding: '6px 18px',
          marginTop: 8,
          borderRadius: 12,
          background: isFulfilled || totalDonated >= goal ? '#bdbdbd' : '#00bcd4',
          color: isFulfilled || totalDonated >= goal ? '#263043' : '#1a2233',
          fontWeight: 600,
          border: 'none',
          cursor: donating || isFulfilled || totalDonated >= goal ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          boxShadow: '0 2px 8px rgba(0,188,212,0.10)'
        }}
      >
        Donate
      </button>
      {donateError && <span style={{ color: '#ff5252', marginLeft: 8, marginTop: 8, borderRadius: 8, background: '#2a1a1a', padding: '2px 8px' }}>{donateError}</span>}
      {donateSuccess && <span style={{ color: '#00e676', marginLeft: 8, marginTop: 8, borderRadius: 8, background: '#1a3321', padding: '2px 8px' }}>Thank you!</span>}
      {withdrawError && <span style={{ color: '#ff5252', marginLeft: 8, marginTop: 8, borderRadius: 8, background: '#2a1a1a', padding: '2px 8px' }}>{withdrawError}</span>}
      {withdrawSuccess && <span style={{ color: '#00e676', marginLeft: 8, marginTop: 8, borderRadius: 8, background: '#1a3321', padding: '2px 8px' }}>Withdrawn!</span>}
      
      {showPopup && !isFulfilled && (
        <div
          className="donate-popup"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(20,30,40,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="donate-popup-content"
            style={{
              background: '#1a2233',
              borderRadius: 18,
              padding: '28px 24px 20px 24px',
              boxShadow: '0 8px 32px rgba(0,188,212,0.18), 0 4px 16px rgba(0,0,0,0.12)',
              color: '#e0f7fa',
              minWidth: 260,
              maxWidth: '90vw',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <h4 style={{ margin: '0 0 16px 0', color: '#00e5ff', fontWeight: 600 }}>Donate to {title}</h4>

            <label style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}>
              Amount (ETH):
              <input
                type="number"
                min="0.001"
                max={maxEth}
                step="0.001"
                value={amountEth}
                onChange={e => setAmountEth(e.target.value)}
                style={{
                  marginLeft: 8,
                  width: 100,
                  borderRadius: 8,
                  border: '1px solid #00bcd4',
                  padding: '4px 8px',
                  background: '#263043',
                  color: '#e0f7fa',
                  fontSize: '1em'
                }}
                disabled={donating}
              />
            </label>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button
                className="donate-btn"
                onClick={handleDonate}
                disabled={donating}
                style={{
                  borderRadius: 10,
                  background: '#00bcd4',
                  color: '#1a2233',
                  fontWeight: 600,
                  border: 'none',
                  padding: '6px 18px',
                  fontSize: '1em',
                  cursor: donating ? 'not-allowed' : 'pointer'
                }}
              >
                {donating ? 'Donating...' : 'Confirm'}
              </button>
              <button
                className="donate-btn"
                onClick={() => { setShowPopup(false); setDonateError(null); }}
                disabled={donating}
                style={{
                  borderRadius: 10,
                  background: '#263043',
                  color: '#e0f7fa',
                  fontWeight: 600,
                  border: 'none',
                  padding: '6px 18px',
                  fontSize: '1em',
                  cursor: donating ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
            <p style={{fontSize: 8, margin: '24px 0 0 0', color: '#00e5ff', fontWeight: 600, textAlign: 'center' }}>
              A small fee of 5110358500000 wei or $0.50 will be added alongside your donation and sent to the developers
            </p>
            {donateError && <div style={{ color: '#ff5252', marginTop: 12, borderRadius: 8, background: '#2a1a1a', padding: '2px 8px' }}>{donateError}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundraiser;