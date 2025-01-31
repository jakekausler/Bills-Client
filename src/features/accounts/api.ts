import { Account } from "../../types/types";

export const fetchAccounts = async () => {
  const response = await fetch("/api/accounts");
  return response.json();
};

export const fetchAddAccount = async (account: Account) => {
  const response = await fetch("/api/accounts", {
    method: "PUT",
    body: JSON.stringify(account),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const fetchEditAccounts = async (accounts: Account[]) => {
  const response = await fetch("/api/accounts", {
    method: "POST",
    body: JSON.stringify(accounts),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
