import { useState } from "react";
import { transferMoney } from "../services/api.js";

function TransferForm({
  accounts,
  onTransferCompleted,
}) {
  const [sourceAccountId, setSourceAccountId] =
    useState("");

  const [
    destinationAccountId,
    setDestinationAccountId,
  ] = useState("");

  const [amount, setAmount] = useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!sourceAccountId) {
      alert("Please select a source account");
      return;
    }

    if (!destinationAccountId) {
      alert(
        "Please select a destination account"
      );
      return;
    }

    if (
      sourceAccountId ===
      destinationAccountId
    ) {
      alert(
        "Source and destination accounts must be different"
      );
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const response =
        await transferMoney({
          source_account_id:
            sourceAccountId,

          destination_account_id:
            destinationAccountId,

          amount: Number(amount),

          description:
            description.trim(),
        });

      setAmount("");
      setDescription("");

      if (onTransferCompleted) {
        onTransferCompleted(
          response.data
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      className="transfer-form"
      onSubmit={handleSubmit}
    >
      <h2>Transfer Money</h2>

      <div className="form-group">
        <label htmlFor="source-account">
          From Account
        </label>

        <select
          id="source-account"
          value={sourceAccountId}
          onChange={(event) =>
            setSourceAccountId(
              event.target.value
            )
          }
        >
          <option value="">
            Select source account
          </option>

          {accounts.map((account) => (
            <option
              key={account._id}
              value={account._id}
            >
              {account.name} - ₹
              {Number(
                account.balance || 0
              ).toFixed(2)}
            </option>
          ))}
        </select>
      </div>


      <div className="form-group">
        <label htmlFor="destination-account">
          To Account
        </label>

        <select
          id="destination-account"
          value={destinationAccountId}
          onChange={(event) =>
            setDestinationAccountId(
              event.target.value
            )
          }
        >
          <option value="">
            Select destination account
          </option>

          {accounts.map((account) => (
            <option
              key={account._id}
              value={account._id}
            >
              {account.name} - ₹
              {Number(
                account.balance || 0
              ).toFixed(2)}
            </option>
          ))}
        </select>
      </div>


      <div className="form-group">
        <label htmlFor="transfer-amount">
          Amount
        </label>

        <input
          id="transfer-amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
        />
      </div>


      <div className="form-group">
        <label htmlFor="transfer-description">
          Description{" "}
          <span>(Optional)</span>
        </label>

        <input
          id="transfer-description"
          type="text"
          placeholder="Enter transfer description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          maxLength={500}
        />
      </div>


      <button
        className="transaction-submit"
        type="submit"
        disabled={
          loading || accounts.length < 2
        }
      >
        {loading
          ? "Transferring..."
          : "Transfer Money"}
      </button>

    </form>
  );
}

export default TransferForm;