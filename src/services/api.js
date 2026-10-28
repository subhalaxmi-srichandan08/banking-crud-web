
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}


// Get all accounts
export async function getAccounts() {
  return request("/accounts");
}


// Create account
export async function createAccount(name) {
  return request("/accounts", {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });
}


// Get balance
export async function getBalance(accountId) {
  return request(
    `/accounts/${accountId}/balance`
  );
}


// Create credit/debit transaction
export async function createTransaction(
  transaction
) {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
}


// Get transaction history
export async function getTransactions(
  accountId,
  {
    page = 1,
    limit = 10,
    type = "",
  } = {}
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (type) {
    params.append("type", type);
  }

  return request(
    `/accounts/${accountId}/transactions?${params.toString()}`
  );
}


// Transfer money
export async function transferMoney(
  transferData
) {
  return request("/transactions/transfer", {
    method: "POST",
    body: JSON.stringify(transferData),
  });
}
