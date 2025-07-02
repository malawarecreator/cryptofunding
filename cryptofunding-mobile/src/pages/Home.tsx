import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import './Home.css';
import Fundraiser from '../components/Fundraiser';
import { useEffect, useState, useRef, useCallback } from 'react';
import { contract } from "../utils/contract";
import { createPublicClient, http } from 'viem';
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const Home: React.FC = () => {
  const [fundraisers, setFundraisers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  // Memoize fetchFundraisers so it can be passed as a stable prop
  const fetchFundraisers = useCallback(async () => {
    setLoading(true);
    try {
      const length = await client.readContract({
        address: contract.address as `0x${string}`,
        abi: contract.abi,
        functionName: 'getFundraisersLength',
      }) as number;

      const promises = [];
      for (let i = 0; i < length; i++) {
        promises.push(
          client.readContract({
            address: contract.address as `0x${string}`,
            abi: contract.abi,
            functionName: 'fundraisers',
            args: [i],
          })
        );
      }
      const results = await Promise.all(promises);
      setFundraisers(results);

      setTimeout(() => {
        contentRef.current?.scrollToTop(300);
      }, 0);
    } catch (e) {
      setFundraisers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFundraisers();
  }, [fetchFundraisers]);

  // Filter fundraisers by title or creator (case-insensitive)
  const filteredFundraisers = fundraisers.filter((f: any) => {
    const title = String(f[2] || '').toLowerCase();
    const creator = String(f[1] || '').toLowerCase();
    return (
      title.includes(search.toLowerCase()) ||
      creator.includes(search.toLowerCase())
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
        {/* Move search bar into the header */}
        <div
          style={{
            padding: '12px 16px 0 16px',
            background: '#101624',
            borderBottom: '1.5px solid #00bcd4',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 0,
            boxShadow: '0 2px 12px rgba(0,188,212,0.08)',
            maxWidth: 420,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <IonSearchbar
            value={search}
            onIonInput={e => setSearch(e.detail.value ?? '')}
            placeholder="🔍 Search by title or creator"
            style={{
              '--background': '#263043',
              '--color': '#e0f7fa',
              '--placeholder-color': '#b2ebf2',
              '--icon-color': '#00bcd4',
              borderRadius: 16,
              marginBottom: 8,
              boxShadow: '0 2px 8px rgba(0,188,212,0.10)',
              border: 'none', // Remove border
              fontWeight: 500,
              fontSize: '1.08em',
              paddingLeft: 10,
              paddingRight: 10,
              minHeight: 44,
              outline: 'none'
            }}
            inputmode="search"
            debounce={100}
            showClearButton="focus"
          />
        </div>
      </IonHeader>
      <IonContent ref={contentRef}>
        {/* Remove search bar from here */}
        {loading && <p style={{ textAlign: 'center' }}>Loading fundraisers...</p>}
        {!loading && filteredFundraisers.length === 0 && <p style={{ textAlign: 'center' }}>No fundraisers found.</p>}
        {!loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 0'
          }}>
            {filteredFundraisers.map((f, idx) => {
              // Skip deleted fundraisers (address zero)
              if (!f[0] || f[0] === "0x0000000000000000000000000000000000000000") return null;
              const isComplete = f[5] === true || f[5] === 1 || f[5] === "1";
              return (
                <div key={idx} style={{ marginBottom: '24px', position: 'relative' }}>
                  {isComplete && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 18,
                        background: '#00e676',
                        color: '#1a2233',
                        borderRadius: 8,
                        padding: '2px 10px',
                        fontWeight: 700,
                        fontSize: 14,
                        boxShadow: '0 2px 8px rgba(0,230,118,0.18)'
                      }}
                    >
                      fulfilled
                    </span>
                  )}
                  <Fundraiser
                    index={idx}
                    title={f[2]}
                    creator={f[1]}
                    goal={Number(f[4])}
                    totalDonated={Number(f[6])}
                    onDonationSuccess={fetchFundraisers}
                    creatorAddress={f[0] as `0x${string}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;