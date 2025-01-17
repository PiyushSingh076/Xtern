import React, { useRef } from "react";
import useFetchUserData from "../hooks/Auth/useFetchUserData";
import { Button, TextField } from "@mui/material";
import { useTransactions } from "../hooks/Wallet/useTransactions";
import useWallet from "../hooks/Wallet/useWallet";

const Wallet = () => {
  const { userData, loading } = useFetchUserData();
  const amountRef = useRef();
  const {wallet, loaded} = useWallet();

  const {initiatePayment} = useTransactions()

  async function handleInitiatePayment(){
    const amount = amountRef.current.value
    const res = await initiatePayment(userData.uid, amount);
  }

  return (
    <div className="h-[calc(100dvh-90px)] flex items-center flex-col gap-2 justify-center">
      {loaded === false ? (
        <div className="spinner-border spinner-border-sm"></div>
      ) : (
        <>
          <div className="text-2xl font-bold text-black/80">Balance: {wallet.amount}</div>
          <TextField ref={amountRef} type="number" label="Amount"></TextField>
          <Button onClick={handleInitiatePayment} variant="contained">Add Funds</Button>
        </>
      )}
    </div>
  );
};

export default Wallet;
