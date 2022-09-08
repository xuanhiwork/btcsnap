import React, { useCallback, useEffect, useState } from 'react';
import {observer} from 'mobx-react-lite';

import { useKeystoneStore } from "../../mobx";
import { BitcoinNetwork } from "../../interface";
import SendModal from '../SendModal';
import ReceiveModal from '../ReceiveModal'
import AccountDetail from './Details';
import {
  AccountMain,
  LogoContainer,
  LogoLabel,
  BalanceContainer,
  BalanceLabel,
  BalacneLeftItem,
  BalacneLeftLabel,
  BalacneLeftArrow,
  BalacneRightItem,
  BalacneRightLine,
  BalacneRightLabel,
  CurrencyContainer,
  ActionContainer,
  ActionContainerItem,
  ActionLabel,
  ActionButton,
  MarketPrice
} from './styles'

import { ReactComponent as Logo } from "./image/logo.svg";
import { ReactComponent as LogoTestnet } from "./image/logo-testnet.svg";
import ReceiveIcon from "../Icons/ReceiveIcon";
import ArrowRight from "../Icons/ArrowRight";
import { btcToSatoshi } from "../../lib/helper"


export interface MainProps {
  balance: number;
  rate: number;
}

export const bitcoinUnit = {
  [BitcoinNetwork.Main] : {
    BTC: "BTC",
    Sats: "sats"
  },
  [BitcoinNetwork.Test] : {
    BTC: "tBTC",
    Sats: "tsats"
  }
}

const Main = observer(({balance, rate}: MainProps) => {
  const { settings: { network }, current } = useKeystoneStore();
  const [showReceiveModal, setShowReceiveModal] = useState<boolean>(false)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [currencyUnit, setCurrencyUnit] = useState<string>(bitcoinUnit[network].BTC);
  const [unitsRight, setUnitsRight] = useState(bitcoinUnit[network].Sats);

  const onReceive = useCallback(() => {
    setShowReceiveModal(true)
  }, [setShowReceiveModal]);

  const closeReceiveModal = useCallback(() => {
    setShowReceiveModal(false)
  }, [setShowReceiveModal]);

  const onDetail = useCallback(() => {
    setShowDetailModal(true)
  }, [setShowDetailModal])

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
  }, [setShowDetailModal])

  const getCurrentBalance = () => {
    if(currencyUnit === bitcoinUnit[BitcoinNetwork.Main].Sats
      || currencyUnit === bitcoinUnit[BitcoinNetwork.Test].Sats) {
      return btcToSatoshi(balance)
    } else {
      return balance
    }
  }

  useEffect(() => {
    setCurrencyUnit(bitcoinUnit[network].BTC)
    setUnitsRight(bitcoinUnit[network].Sats)
  },[network])

  const switchUnits = (() => {
    const btc = bitcoinUnit[network].BTC;
    const sats = bitcoinUnit[network].Sats;
    if(currencyUnit === btc) {
      setCurrencyUnit(sats);
      setUnitsRight(btc);
    } else {
      setCurrencyUnit(btc);
      setUnitsRight(sats);
    }
  })

  return (
    <AccountMain>
      <LogoContainer>
        {network === BitcoinNetwork.Main
          ? <Logo />
          : <LogoTestnet />
        }
        <LogoLabel>Alpha</LogoLabel>
      </LogoContainer>

      <BalanceContainer>
        <BalanceLabel>current balance</BalanceLabel>
        <BalacneLeftItem>
          <BalacneLeftLabel onClick={onDetail}>
            {getCurrentBalance()} {currencyUnit}
          </BalacneLeftLabel>
          <BalacneLeftArrow><ArrowRight size={25}/></BalacneLeftArrow>
        </BalacneLeftItem>
        <BalacneRightItem>
          <BalacneRightLine>/</BalacneRightLine>
          <BalacneRightLabel onClick={switchUnits}>{unitsRight}</BalacneRightLabel>
        </BalacneRightItem>
        <CurrencyContainer isTestnet={network === BitcoinNetwork.Test}>
          ≈ {(balance * rate).toFixed(2)} USD
        </CurrencyContainer>
      </BalanceContainer>

      <ActionContainer>
        <ActionContainerItem>
          <SendModal network={network} scriptType={current?.scriptType!} utxos={[]} />
          <ActionLabel>send</ActionLabel>
        </ActionContainerItem>
        <ActionContainerItem onClick={onReceive}>
          <ActionButton>
            <ReceiveIcon size={48} />
          </ActionButton>
          <ActionLabel>receive</ActionLabel>
        </ActionContainerItem>
      </ActionContainer>

      <MarketPrice isTestnet={network === BitcoinNetwork.Test}>
        Market Price: <span>{rate} USD</span>
      </MarketPrice>

      <ReceiveModal open={showReceiveModal} close={closeReceiveModal}/>
      {showDetailModal && <AccountDetail balance={getCurrentBalance()} units={currencyUnit} close={closeDetailModal} />}
    </AccountMain>
  );
});

export default Main;
