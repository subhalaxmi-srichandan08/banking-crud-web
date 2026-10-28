import { useState } from "react";
import { createTransaction } from "../services/api.js";

function TransactionForm({
  accountId,
  onTransactionCreated,
}) {
  const [type, setType] = useState("credit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] =
    useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accountId) {
      alert("Please select an account");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const response =
        await createTransaction({
          account_id: accountId,
          type,
          amount: Number(amount),
          description: description.trim(),
        });

      setAmount("");
      setDescription("");
      setType("credit");

      if (onTransactionCreated) {
        onTransactionCreated(response.data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="transaction-form"
      onSubmit={handleSubmit}
    >
      <h2>Add Transaction</h2>

      <div className="transaction-type-row">
        <div className="form-group">
          <label htmlFor="transaction-type">
            Transaction Type
          </label>

          <select
            id="transaction-type"
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="credit">
              Credit
            </option>

            <option value="debit">
              Debit
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-amount">
            Amount
          </label>

          <input
            id="transaction-amount"
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
      </div>

      <div className="form-group">
        <label htmlFor="transaction-description">
          Description{" "}
          <span>(Optional)</span>
        </label>

        <input
          id="transaction-description"
          type="text"
          placeholder="Enter transaction description"
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
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Add Transaction"}
      </button>
    </form>
  );
}

export default TransactionForm;