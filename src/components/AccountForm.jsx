import { useState } from "react";
import { createAccount } from "../services/api.js";

function AccountForm({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Account name is required");
      return;
    }

    try {
      setLoading(true);

      const response = await createAccount(
        name.trim()
      );

      setName("");

      if (onCreated) {
        onCreated(response.data);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="account-form"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="account-name">
          Account Name
        </label>

        <input
          id="account-name"
          type="text"
          placeholder="Enter account name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          maxLength={100}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>
  );
}

export default AccountForm;