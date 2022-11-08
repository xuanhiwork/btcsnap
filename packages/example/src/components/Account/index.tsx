import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader, Modal, Transition } from 'semantic-ui-react';
import Main from './Main';
import Aside from './Aside';
import { useBalance } from '../../hook/useBalance';
import { useAppStore } from '../../mobx';
import {
  AccountBackground,
  AccountContainer,
  AccountLabel,
  CookieInfo,
  PrivacyLink,
} from './styles';
import LNSetupModal from '../SetupLightning';
import { AppStatus } from '../../mobx/runtime';
import { LNWalletStepStatus } from '../../mobx/user';
import CreateWallet from '../SetupLightning/CreateWallet';
import RecoveryKey from '../SetupLightning/RecoveryKey';
import { getLNPubKey } from '../../lib/snap';
import { createLightningWallet } from '../../services/LightningService/createLightningWallet';

const Account = observer(() => {
  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [recoveryKey, setRecoveryKey] = useState({
    show: false,
    key: '',
  });
  const {
    current,
    persistDataLoaded,
    runtime: { isLoading, status },
    user: { isAgreeCookie, agreeCookie, LNWalletStep, setLNWalletStep },
    lightning: { nextWalletName },
  } = useAppStore();
  const { balance, rate, refresh, loadingBalance } = useBalance();

  useEffect(() => {
    if (
      !!current &&
      status === AppStatus.Ready &&
      !loadingBalance &&
      LNWalletStep === LNWalletStepStatus.Default
    ) {
      setLNWalletStep(LNWalletStepStatus.CreateWallet);
    }
  }, [current, status, loadingBalance]);

  const createWallet = () => {
    onShowCreateWallet();
    setLNWalletStep(LNWalletStepStatus.Done);
  };

  const onCloseCreateWallet = () => {
    setShowCreateWallet(false);
  };

  const onCreateLightning = async () => {
    setShowCreateWallet(false);

    const credential = {};

    // TODO: add use ln hoook
    // const key = `lndhub://${credential.login}:${credential.password}@https://lndhub.io`;
    // setRecoveryKey({
    //   show: true,
    //   key,
    // });

    // createLightningWallet(userId, nextWalletName);
  };

  const onShowCreateWallet = () => {
    setShowCreateWallet(true);
  };

  const onCloseRecoveryKey = () => {
    setRecoveryKey({
      show: false,
      key: '',
    });
  };

  return (
    <>
      <Modal open={isLoading}>
        <Loader inverted />
      </Modal>
      <AccountBackground>
        <AccountContainer>
          <Main balance={balance} rate={rate} />
          <Aside
            refreshBalance={refresh}
            loadingBalance={loadingBalance}
            showCreateWallet={onShowCreateWallet}
          />
          <AccountLabel>
            Powered by{' '}
            <a href="https://metamask.io/snaps/" target="_blank">
              MetaMask Snaps{' '}
            </a>
          </AccountLabel>
        </AccountContainer>

        {LNWalletStep === LNWalletStepStatus.CreateWallet && (
          <LNSetupModal createWallet={createWallet} />
        )}
        {showCreateWallet && (
          <CreateWallet
            create={onCreateLightning}
            loading={recoveryKey.show}
            close={onCloseCreateWallet}
          />
        )}
        {recoveryKey.show && (
          <RecoveryKey
            recoveryKey={recoveryKey.key}
            close={onCloseRecoveryKey}
          />
        )}

        <Transition
          visible={!isAgreeCookie && persistDataLoaded}
          animation={'fade up'}
          duration={'300'}>
          <CookieInfo>
            <div>
              <p>
                We use cookies to improve the user experience of our product. By
                continuing to use this site, you agree to our Privacy Policy.
              </p>
              <span onClick={agreeCookie}>OK</span>
            </div>
          </CookieInfo>
        </Transition>
      </AccountBackground>
    </>
  );
});

export default Account;
