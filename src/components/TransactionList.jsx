import { useEffect, useState } from "react";
import { getTransactions } from "../services/api.js";

function TransactionList({
  accountId,
  refreshKey,
}) {
  const [transactions, setTransactions] =
    useState([]);

  const [type, setType] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] =
    useState({
      current_page: 1,
      page_size: 10,
      total_records: 0,
      total_pages: 0,
    });

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {
    if (!accountId) {
      setTransactions([]);

      setPagination({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 0,
      });

      return;
    }


    const loadTransactions = async () => {
      try {
        setLoading(true);

        const response =
          await getTransactions(
            accountId,
            {
              page,
              limit: 10,
              type,
            }
          );

        const data =
          response?.data || {};

        setTransactions(
          data.transactions || []
        );

        setPagination(
          data.pagination || {
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 0,
          }
        );
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error
        );

        setTransactions([]);

        setPagination({
          current_page: 1,
          page_size: 10,
          total_records: 0,
          total_pages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [
    accountId,
    page,
    type,
    refreshKey,
  ]);


  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };


  if (!accountId) {
    return (
      <div className="transaction-list">
        <h2>Transaction History</h2>

        <p>
          Select an account to view
          transactions.
        </p>
      </div>
    );
  }


  return (
    <div className="transaction-list">

      <div className="transaction-header">
        <h2>Transaction History</h2>

        <select
          value={type}
          onChange={handleTypeChange}
        >
          <option value="">
            All Transactions
          </option>

          <option value="credit">
            Credit
          </option>

          <option value="debit">
            Debit
          </option>
        </select>
      </div>


      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="transactions">

          {transactions.map(
            (transaction) => (
              <div
                className={`transaction-card ${transaction.type}`}
                key={transaction._id}
              >

                <div className="transaction-top">

                  <div>
                    <span
                      className={`transaction-type ${transaction.type}`}
                    >
                      {transaction.type.toUpperCase()}
                    </span>

                    <h3>
                      {transaction.description ||
                        "No description"}
                    </h3>
                  </div>


                  <strong className="transaction-amount">
                    {transaction.type ===
                    "credit"
                      ? "+"
                      : "-"}
                    ₹
                    {Number(
                      transaction.amount
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="transaction-details">

                  <div>
                    <span>
                      Reference ID
                    </span>

                    <strong>
                      {
                        transaction.reference_id
                      }
                    </strong>
                  </div>


                  <div>
                    <span>Date</span>

                    <strong>
                      {new Date(
                        transaction.created_at
                      ).toLocaleString()}
                    </strong>
                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}


      {pagination.total_pages > 0 && (
        <div className="pagination">

          <button
            disabled={page <= 1}
            onClick={() =>
              setPage(
                (current) =>
                  current - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page{" "}
            {pagination.current_page}{" "}
            of{" "}
            {pagination.total_pages}
          </span>

          <button
            disabled={
              page >=
              pagination.total_pages
            }
            onClick={() =>
              setPage(
                (current) =>
                  current + 1
              )
            }
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}

export default TransactionList;