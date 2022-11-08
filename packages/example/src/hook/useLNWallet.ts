import { useState } from 'react';
import { useAppStore } from '../mobx';
import { createWallet } from '../api/lightning/createWallet';
import { getLNPubKey } from '../lib/snap';
import { createLightningWallet } from '../services/LightningService/createLightningWallet';

export const useBalance = () => {
  const {
    lightning: { nextWalletName },
  } = useAppStore();
  const [wallet, setWallet] = useState({});
  const [loadingCreate, setLoadingCreate] = useState(false);

  const create = async () => {
    const pubkey = await getLNPubKey();
    if (!pubkey) {
      console.log('pubkey not found');
      return;
    }
    const createRes = await createWallet(pubkey);
    if (!createRes.credential) return;
    setWallet(createRes);

    createLightningWallet(createRes.userId, nextWalletName);
  };

  return { loadingCreate, create, wallet };
};
