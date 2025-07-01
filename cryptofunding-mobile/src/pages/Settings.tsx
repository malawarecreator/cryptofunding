import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import './Settings.css';

const STORAGE_KEY = 'cryptofunding_account';

const Settings: React.FC = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved credentials if they exist
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setPrivateKey(parsed.privateKey || '');
        setAddress(parsed.address || '');
        setFullName(parsed.fullName || '');
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ privateKey, address, fullName })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      {/* IonContent is now the centering container */}
      <IonContent>
        {/* The settings-content div is now the item being centered */}
        <div className="settings-content">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
          >
            <IonItem>
              <IonLabel position="stacked">Private Key</IonLabel>
              <IonInput
                value={privateKey}
                onIonChange={e => setPrivateKey(e.detail.value!)}
                placeholder="Enter your private key"
                type="text"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Address</IonLabel>
              <IonInput
                value={address}
                onIonChange={e => setAddress(e.detail.value!)}
                placeholder="Enter your address"
                type="text"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Full Name</IonLabel>
              <IonInput
                value={fullName}
                onIonChange={e => setFullName(e.detail.value!)}
                placeholder="Enter your full name"
                type="text"
                required
              />
            </IonItem>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <IonButton type="submit">Save</IonButton>
              {saved && <span className="saved-message">Saved!</span>}
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;