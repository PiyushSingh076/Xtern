import React, { useState } from "react";
import profile from "../../assets/images/banner/mentor.png";
import medal from "../../assets/svg/medal.png";
import downArrow from "../../assets/svg/right-arrow.svg";
import JANUARY from "../../assets/Seasons/January.png";
import FEBRUARY from "../../assets/Seasons/February.png";
import MARCH from "../../assets/Seasons/March.png";
import APRIL from "../../assets/Seasons/April.png";
import MAY from "../../assets/Seasons/May.png";
import JUNE from "../../assets/Seasons/June.jpeg";
import JULY from "../../assets/Seasons/July.png";
import AUGUST from "../../assets/Seasons/August.jpeg";
import SEPTEMBER from "../../assets/Seasons/September.png";
import OCTOBER from "../../assets/Seasons/October.png";
import NOVEMBER from "../../assets/Seasons/November.jpeg";
import DECEMBER from "../../assets/Seasons/December.png";
import useInvoicesWithInternData from "../../hooks/Teams/useFetchInvoice";

const monthImages = {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER,
};

export default function Payments() {
  const { invoices, loading, error } = useInvoicesWithInternData();
  const [expandedCards, setExpandedCards] = useState([]);

  console.log(invoices);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching payment data: {error}</div>;

  const toggleCardExpansion = (index) => {
    setExpandedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePayment = (paymentLink) => {
    window.location.href = paymentLink;
  };

  return (
    <div className="payments-container">
      {invoices.map((item, index) => (
        <div className="info-card-payment-container" key={index}>
          <img
            className="payment-card-month-year-img"
            src={monthImages[item.month] || DECEMBER}
            alt={`${item.month}`}
          />
          <span className="payment-card-month-year">
            {item.month}{" "}
            {new Date(item.details[0]?.from.seconds * 1000).getFullYear()}
          </span>
          <div
            className="payment-card-amount"
            onClick={() => item.payLink && handlePayment(item.payLink)}
            style={{ cursor: item.payLink ? "pointer" : "not-allowed" }}
          >
            Pay ${item.totalAmount || 0}
          </div>
          <button
            className="payment-card-view-btn"
            onClick={() => toggleCardExpansion(index)}
          >
            View details
            <img
              src={downArrow}
              className="payment-card-view-btn-img"
              alt="down-arrow"
              width={15}
            />
          </button>

          {/* Payment summary section */}
          <div
            id={`cardDetails${index}`}
            className={`collapse ${
              expandedCards.includes(index) ? "show" : "hide"
            }`}
          >
            <div className="payment-summary-section">
              {item.details.map((payment, idx) => {
                const fromDate = payment.from?.seconds
                  ? new Date(payment.from.seconds * 1000).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "2-digit" }
                    )
                  : "Invalid date";

                const toDate = payment.to?.seconds
                  ? new Date(payment.to.seconds * 1000).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "2-digit" }
                    )
                  : "Invalid date";

                return (
                  <div
                    className="row align-items-center payment-summary-item py-2"
                    key={idx}
                  >
                    {/* Name */}
                    <div className="col-5 text-start fw-bold">
                      {payment.internData
                        ? payment.internData.display_name
                        : "Intern data unavailable"}
                    </div>

                    {/* Dates */}
                    <div className="col-4 text-center text-muted">
                      {fromDate} - {toDate}
                    </div>

                    {/* Salary */}
                    <div className="col-3 text-end text-success fw-bold">
                      ${payment.salary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
