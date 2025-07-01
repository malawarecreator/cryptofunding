import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel, IonTextarea } from '@ionic/react';
import './Create.css';
import { contract } from '../utils/contract';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient } from 'viem';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { sepolia } from "viem/chains";

const STORAGE_KEY = 'cryptofunding_account';

const Create: React.FC = () => {
    const [title, setTitle] = useState('');
    const [creatorFullName, setCreatorFullName] = useState('');
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    // Load address and private key from localStorage (set in Settings)
    const accountData = (() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch {
            return {};
        }
    })();

    // Autofill full name if available
    React.useEffect(() => {
        if (accountData.fullName && !creatorFullName) {
            setCreatorFullName(accountData.fullName);
        }
    }, [accountData.fullName, creatorFullName]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setError(null);

        if (!accountData.privateKey) {
            setStatus('error');
            setError('Please set your private key in Settings.');
            return;
        }

        // Ensure goal in wei is greater than 0.01 ETH (0.01 * 1e18 = 10000000000000000)
        const goalWei = BigInt(goal);
        if (goalWei < 10000000000000000n) {
            setStatus('error');
            setError('Goal must be at least 0.01 ETH (10,000,000,000,000,000 wei).');
            return;
        }

        try {
            const data = encodeFunctionData({
                abi: contract.abi,
                functionName: 'createFundraiser',
                args: [title, creatorFullName, description, goalWei],
            });

            const account = privateKeyToAccount(accountData.privateKey);

            const walletClient = createWalletClient({
                account,
                chain: sepolia,
                transport: http(),
            });

            // Send the transaction
            const hash = await walletClient.sendTransaction({
                account,
                to: contract.address as `0x${string}`,
                data,
            });

            setStatus('success');
            setError(null);
            console.log('Transaction hash:', hash);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Failed to create fundraiser.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Fundraiser</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="create-content">
                    <form onSubmit={handleSubmit}>
                        <IonItem>
                            <IonLabel position="stacked">Title</IonLabel>
                            <IonInput
                                value={title}
                                onIonChange={e => setTitle(e.detail.value!)}
                                placeholder="Fundraiser title"
                                required
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Your Full Name</IonLabel>
                            <IonInput
                                value={creatorFullName}
                                onIonChange={e => setCreatorFullName(e.detail.value!)}
                                placeholder="Your full name"
                                required
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <IonTextarea
                                value={description}
                                onIonChange={e => setDescription(e.detail.value!)}
                                placeholder="Describe your fundraiser"
                                required
                                autoGrow
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Goal (wei)</IonLabel>
                            <IonInput
                                value={goal}
                                onIonChange={e => setGoal(e.detail.value!)}
                                placeholder="Goal amount in wei"
                                type="number"
                                min="1"
                                required
                            />
                        </IonItem>
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <IonButton type="submit" disabled={status === 'submitting'}>
                                {status === 'submitting' ? 'Submitting...' : 'Create'}
                            </IonButton>
                            {status === 'success' && (
                                <span className="saved-message" style={{ color: '#00e676', marginLeft: 12 }}>
                                    Fundraiser created! It may take a while for you to see your fundraiser.
                                </span>
                            )}
                            {status === 'error' && (
                                <span className="saved-message" style={{ color: '#ff5252', marginLeft: 12 }}>
                                    {error}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Create;