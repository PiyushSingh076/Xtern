import React, { useState } from 'react'
import profile from '../../assets/images/banner/mentor.png'
import medal from '../../assets/svg/medal.png'
import downArrow from '../../assets/svg/right-arrow.svg'
import JANUARY from '../../assets/Seasons/January.png'
import FEBRUARY from '../../assets/Seasons/February.png'
import MARCH from '../../assets/Seasons/March.png'
import APRIL from '../../assets/Seasons/April.png'
import MAY from '../../assets/Seasons/May.png'
import JUNE from '../../assets/Seasons/June.jpeg'
import JULY from '../../assets/Seasons/July.png'
import AUGUST from '../../assets/Seasons/August.jpeg'
import SEPTEMBER from '../../assets/Seasons/September.png'
import OCTOBER from '../../assets/Seasons/October.png'
import NOVEMBER from '../../assets/Seasons/November.jpeg'
import DECEMBER from '../../assets/Seasons/December.png'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../../firebaseConfig'
import useFetchInvoice from '../../hooks/Teams/useFetchInvoice'



export default function Payments() {
    const [expandedCards, setExpandedCards] = useState([]);

    const { loading, invoices, error } = useFetchInvoice();
    console.log("invoices", invoices);

     

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching payment data.</div>;




    const toggleCardExpansion = (index) => {
        setExpandedCards(prevExpandedCards => {
            if (prevExpandedCards.includes(index)) {
                return prevExpandedCards.filter(item => item !== index);
            } else {
                return [...prevExpandedCards, index];
            }
        });
    };

    const handlePayment = async (paymentLink) => {
        // Redirect to the Stripe checkout page
        window.location.href = paymentLink;
    };

    return (
        <div className='payments-container'>
            {invoices.map((item, index) => (
                <div className='info-card-payment-container' key={index}>
                   <img className='payment-card-month-year-img' src={item.month.toUpperCase() === 'JANUARY' ? JANUARY : item.month.toUpperCase() === 'FEBRUARY' ? FEBRUARY : item.month.toUpperCase() === 'MARCH' ? MARCH : item.month.toUpperCase() === 'APRIL' ? APRIL : item.month.toUpperCase() === 'MAY' ? MAY : item.month.toUpperCase() === 'JUNE' ? JUNE : item.month.toUpperCase() === 'JULY' ? JULY : item.month.toUpperCase() === 'AUGUST' ? AUGUST : item.month.toUpperCase() === 'SEPTEMBER' ? SEPTEMBER : item.month.toUpperCase() === 'OCTOBER' ? OCTOBER : item.month.toUpperCase() === 'NOVEMBER' ? NOVEMBER : DECEMBER} />
                    <span className='payment-card-month-year'>{item.month} {item.year}</span>
                    <div className='payment-card-amount'
                        onClick={() => handlePayment(item.payLink)} 
                        style={{ cursor: 'pointer' }}
                    >Pay ${
                            item.totalAmount
                        }</div>
                    <button
                        className='payment-card-view-btn'
                        data-bs-toggle="collapse"
                        data-bs-target={`#cardDetails${index}`}
                        aria-expanded={expandedCards.includes(index)}
                        onClick={() => toggleCardExpansion(index)}
                    >
                        View details
                        <img src={downArrow} className='payment-card-view-btn-img' alt="down-arrow" width={15} />
                    </button>

                    {/* Payment summary section */}
                    <div
                        id={`cardDetails${index}`}
                        className="collapse"
                        style={{
                            transition: 'ease-in-out 0.5s',
                            maxHeight: expandedCards.includes(index) ? '1000px' : '0',
                            opacity: expandedCards.includes(index) ? 1 : 0,
                            overflow: 'hidden'
                        }}
                    >
                       <div className="payment-summary-section">
                      
                          {item.details.map((payment, index) => (
  <div className='payment-summary-item' key={index}>
    <div style={{flex: 1}} className='payment-details-name'> <span>{payment.internData.display_name}</span> </div>
    <div style={{flex: 1}} className='payment-details'> <span style={{fontSize: '12px'}}>{new Date(payment.from.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(payment.to.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div>
    <div style={{flex: 1}} className='payment-details'>      <span>${payment.salary}</span> </div>
  </div>
))}
                        </div> 
                    </div>
                </div>
            ))}
        </div>
    )
}
