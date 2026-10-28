import { useEffect, useState } from "react";

import AccountForm from "./components/AccountForm";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import TransferForm from "./components/TransferForm";

import {
  getAccounts,
} from "./services/api.js";

import "./App.css";

function App() {
  const [accounts, setAccounts] =
    useState([]);

  const [selectedAccountId, setSelectedAccountId] =
    useState("");

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [loadingAccounts, setLoadingAccounts] =
    useState(true);


  // Load all accounts
  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);

      const response =
        await getAccounts();

      const loadedAccounts =
        response?.data || [];

      setAccounts(loadedAccounts);

      // Select first account automatically
      if (
        loadedAccounts.length > 0 &&
        !selectedAccountId
      ) {
        setSelectedAccountId(
          loadedAccounts[0]._id
        );
      }
    } catch (error) {
      console.error(
        "Failed to load accounts:",
        error
      );
    } finally {
      setLoadingAccounts(false);
    }
  };


  useEffect(() => {
    loadAccounts();
  }, []);


  // Account created
  const handleAccountCreated = (
    createdAccount
  ) => {
    setAccounts((currentAccounts) => [
      createdAccount,
      ...currentAccounts,
    ]);

    setSelectedAccountId(
      createdAccount._id
    );
  };


  // Credit/debit completed
  const handleTransactionCreated = (
    transactionData
  ) => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account._id ===
        transactionData.transaction.account_id
          ? {
              ...account,
              balance:
                transactionData.balance,
            }
          : account
      )
    );

    setRefreshKey(
      (value) => value + 1
    );
  };


  // Transfer completed
  const handleTransferCompleted = (
    transferData
  ) => {
    setAccounts((currentAccounts) =>
      currentAccounts.map((account) => {
        if (
          account._id ===
          transferData.debit_transaction.account_id
        ) {
          return {
            ...account,
            balance:
              transferData.source_balance,
          };
        }

        if (
          account._id ===
          transferData.credit_transaction.account_id
        ) {
          return {
            ...account,
            balance:
              transferData.destination_balance,
          };
        }

        return account;
      })
    );

    setRefreshKey(
      (value) => value + 1
    );
  };


  const selectedAccount =
    accounts.find(
      (account) =>
        account._id ===
        selectedAccountId
    );


  return (
    <div className="app">

      <header>
        <h1>
          Transaction Ledger
        </h1>

        <p>
          Manage accounts,
          transactions and transfers
        </p>
      </header>


      {/* Create Account */}
      <div className="card">
        <h2>Create Account</h2>

        <AccountForm
          onCreated={
            handleAccountCreated
          }
        />
      </div>


      {/* Accounts */}
      <div className="card">
        <div className="section-header">
          <h2>Accounts</h2>

          <button
            type="button"
            onClick={loadAccounts}
          >
            Refresh
          </button>
        </div>


        {loadingAccounts ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <div className="accounts-list">

            {accounts.map((account) => (
              <button
                key={account._id}
                type="button"
                className={`account-item ${
                  selectedAccountId ===
                  account._id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedAccountId(
                    account._id
                  )
                }
              >
                <span>
                  {account.name}
                </span>

                <strong>
                  ₹
                  {Number(
                    account.balance || 0
                  ).toFixed(2)}
                </strong>
              </button>
            ))}

          </div>
        )}
      </div>


      {/* Selected account */}
      {selectedAccount && (
        <>
          <div className="account-card">

            <div>
              <strong>
                {selectedAccount.name}
              </strong>

              <p>
                Account ID:{" "}
                {selectedAccount._id}
              </p>
            </div>

            <div className="balance-display">
              <span>Balance</span>

              <strong>
                ₹
                {Number(
                  selectedAccount.balance || 0
                ).toFixed(2)}
              </strong>
            </div>

          </div>


          {/* Add transaction */}
          <div className="card">
            <TransactionForm
              accountId={
                selectedAccount._id
              }
              onTransactionCreated={
                handleTransactionCreated
              }
            />
          </div>


          {/* Transfer */}
          <div className="card">
            <TransferForm
              accounts={accounts}
              onTransferCompleted={
                handleTransferCompleted
              }
            />
          </div>


          {/* History */}
          <TransactionList
            accountId={
              selectedAccount._id
            }
            refreshKey={
              refreshKey
            }
          />
        </>
      )}

    </div>
  );
}

export default App;