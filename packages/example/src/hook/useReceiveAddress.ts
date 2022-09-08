import { useKeystoneStore, utils } from "../mobx";
import { useCallback, useEffect, useState } from "react";
import { fetchAddresses } from "../api/v1/fetchAddress";
import { fromHdPathToObj } from "../lib/cryptoPath";
import { IAccount, IAddressIn } from "../mobx/types";

export const useReceiveAddress = () => {
  const { current, settings: { dynamicAddress }} = useKeystoneStore();
  const [address, setAddress] = useState<string>("");

  const fetchAddress = useCallback(async (current: IAccount) => {
    try {
      const {unused} = await fetchAddresses(current.mfp, current.xpub, current.coinCode);
      const receiveAddress = unused.filter(address => fromHdPathToObj(address.hdPath).change === "0")?.[0];
      const receiveAddressIndex = Number(fromHdPathToObj(receiveAddress?.hdPath).index) || 0;
      return {
        index: receiveAddressIndex,
        address: receiveAddress.address
      }
    } catch (e) {
      console.error("Failed to fetch address", e);
      return {
        index: current.receiveAddressIndex,
        address: current.getReceiveAddress()
      }
    }
  }, [])
  
  useEffect(() => {
    if(current) {
      if (dynamicAddress) {
        fetchAddress(current).then(({index, address}) => {
          const receiveAddress = {
            id: utils.generateAddressId(),
            parent: "",
            address,
            coinCode: current.coinCode,
            change: 0,
            index,
          } as IAddressIn;
          current.validateAndAddAddress(receiveAddress, dynamicAddress)
        })
      } else {
        setAddress(current.getReceiveAddress())
      }
    }
  }, [current])
  
  return {
    address
  }
}