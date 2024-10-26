import React, { useState } from 'react'
import profile from '../../assets/images/banner/mentor.png'
import medal from '../../assets/svg/medal.png'
import downArrow from '../../assets/svg/right-arrow.svg'

export default function Payments() {
  const [expandedCards, setExpandedCards] = useState([]);

  const paymentData = [
    {
      name: 'Anirudh',
      amount: 1000,
      medalType: 'Bronze',
      paymentSummary: [
        { date: '10/10/2024', amount: 1000, status: 'Pending' },
        { date: '09/09/2024', amount: 1000, status: 'Paid' }
      ]
    },
    {
      name: 'Priya',
      amount: 1500,
      medalType: 'Silver',
      paymentSummary: [
        { date: '11/11/2024', amount: 1500, status: 'Paid' },
        { date: '10/10/2024', amount: 1500, status: 'Paid' }
      ]
    },
    {
      name: 'Rahul',
      amount: 2000,
      medalType: 'Gold',
      paymentSummary: [
        { date: '12/12/2024', amount: 2000, status: 'Paid' },
        { date: '11/11/2024', amount: 2000, status: 'Paid' }
      ]
    }
  ]

  const toggleCardExpansion = (index) => {
    setExpandedCards(prevExpandedCards => {
      if (prevExpandedCards.includes(index)) {
        return prevExpandedCards.filter(item => item !== index);
      } else {
        return [...prevExpandedCards, index];
      }
    });
  };

  return (
    <div className='payments-container'>
      {
        paymentData.map((item, index) => (
         <div className='info-card-payment-container' key={index}>
             <div className='info-card-payment'>
            <div className='info-card-img-section'>
              <img src={profile} className='info-card-img' alt="profile" />
            </div>
            <div className='info-card-content'>
              <div className='info-card-name-section'>
                <h4>{item.name}</h4>
                <div className='medal-section'>
                  <img src={medal} alt="medal" width={15}/> {item.medalType}
                </div>
              </div>
              <span className='subscribed-tag'>Subscribed</span>
              <div className='info-card-action-section'>
                <button className='payment-card-btn'>Pay</button>
              </div>
              <span className='info-card-phone-number'>Pay Amount: ₹{item.amount}</span>
            
            </div>

          </div>
          <button 
                className='payment-card-view-btn' 
                data-bs-toggle="collapse" 
                data-bs-target={`#cardDetails${index}`}
                aria-expanded={expandedCards.includes(index)}
                onClick={() => toggleCardExpansion(index)}
              >
                View details
                <img src={downArrow} className='payment-card-view-btn-img' alt="down-arrow" width={15}/>
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
                   <span>Payment Summary</span>
                   {item.paymentSummary.map((payment, paymentIndex) => (
                     <div className='payment-summary-item' key={paymentIndex}>
                      <span>{payment.date}</span>
                      <div className='payment-summary-item-amount'>
                        <span>₹{payment.amount}</span>
                        <span style={{ 
                          backgroundColor: payment.status.toLowerCase() === 'pending' ? 'red' : '#3374AE',
                        }}>
                          {payment.status}
                        </span>
                      </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
        ))
      }
    </div>
  )
}
