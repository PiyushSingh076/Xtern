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

    const { loading, paymentData, error } = useFetchInvoice();
    console.log("paymentData", paymentData);


//   const  paymentData = [
        
//       { detail: [
//         { from: 'October 29,2024 at 12:00',
//             to: 'November 29,2024 at 12:00',
//             salary: 153,
//             internRef: 'Anirudh'}
//        ],
//        month :'October',
//        OrganzationId: '2309423',
//        payLink: 'www.google.com',
//        status: 'unpaid',
//        StripeCustomerId: '39403920-90',
//        totalAmount: 387
//     }


        
//     ];

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
            {paymentData.map((item, index) => (
                <div className='info-card-payment-container' key={index}>
                    <img className='payment-card-month-year-img' src={item.month === 'JANUARY' ? JANUARY : item.month === 'FEBRUARY' ? FEBRUARY : item.month === 'MARCH' ? MARCH : item.month === 'APRIL' ? APRIL : item.month === 'MAY' ? MAY : item.month === 'JUNE' ? JUNE : item.month === 'JULY' ? JULY : item.month === 'AUGUST' ? AUGUST : item.month === 'SEPTEMBER' ? SEPTEMBER : item.month === 'OCTOBER' ? OCTOBER : item.month === 'NOVEMBER' ? NOVEMBER : DECEMBER} />
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
                      
                            {item.detail.map((payment, index) => (
                                <div className='payment-summary-item' key={index}>
                                    <span>{payment.internRef}</span>
                                    <span style={{fontSize: '12px'}}>{(((payment.from).split(',')[0]).split(' ')[1]) +' '+((((payment.from).split(',')[0]).split(' ')[0])).slice(0,3)} - {(((payment.from).split(',')[0]).split(' ')[1]) +' '+((((payment.to).split(',')[0]).split(' ')[0])).slice(0,3)}</span>
                                    <span>${payment.salary}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
