import { Account } from "../../types/types";

export const fetchAccounts = async () => {
  const response = await fetch("/api/accounts");
  return response.json();
};

export const fetchAddAccount = async (account: Account) => {
  const response = await fetch("/api/accounts", {
    method: "PUT",
    body: JSON.stringify(account),
  });
  return response.json();
};

export const fetchEditAccounts = async (accounts: Account[]) => {
  const response = await fetch("/api/accounts", {
    method: "POST",
    body: JSON.stringify(accounts),
  });
  return response.json();
};
