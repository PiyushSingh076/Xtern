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



export default function Payments() {
  const [expandedCards, setExpandedCards] = useState([]);

  const paymentData = [
       {
        month: 'JANUARY',
        year: '2024',
        totalAmount: 2200,
        paymentSummary: [
            {
                name: 'John Doe',
                amount: 1000,
                status: 'paid'
            },
            {
                name: 'Jane Smith',
                amount: 1200,
                status: 'pending'
            },
        ]
       },
       {
        month: 'FEBRUARY',
        year: '2024',
        paymentSummary: [
            {
                name: 'Alice Johnson',
                amount: 950,
                status: 'paid'
            },
            {
                name: 'Bob Williams',
                amount: 1100,
                status: 'paid'
            },
        ]
       },
       {
        month: 'MARCH',
        year: '2024',
        paymentSummary: [
            {
                name: 'Charlie Brown',
                amount: 1050,
                status: 'paid'
            },
            {
                name: 'Diana Clark',
                amount: 900,
                status: 'pending'
            },
        ]
       },
       {
        month: 'APRIL',
        year: '2024',
        paymentSummary: [
            {
                name: 'Eva Green',
                amount: 1150,
                status: 'paid'
            },
            {
                name: 'Frank White',
                amount: 1000,
                status: 'paid'
            },
        ]
       },
       {
        month: 'MAY',
        year: '2024',
        paymentSummary: [
            {
                name: 'Grace Lee',
                amount: 1200,
                status: 'paid'
            },
            {
                name: 'Henry Ford',
                amount: 950,
                status: 'pending'
            },
        ]
       },
       {
        month: 'JUNE',
        year: '2024',
        paymentSummary: [
            {
                name: 'Ivy Chen',
                amount: 1100,
                status: 'paid'
            },
            {
                name: 'Jack Black',
                amount: 1000,
                status: 'paid'
            },
        ]
       },
       {
        month: 'JULY',
        year: '2024',
        paymentSummary: [
            {
                name: 'Kelly Smith',
                amount: 1050,
                status: 'paid'
            },
            {
                name: 'Liam Neeson',
                amount: 1150,
                status: 'pending'
            },
        ]
       },
       {
        month: 'AUGUST',
        year: '2024',
        paymentSummary: [
            {
                name: 'Mary Johnson',
                amount: 1000,
                status: 'paid'
            },
            {
                name: 'Nick Fury',
                amount: 1200,
                status: 'paid'
            },
        ]
       },
       {
        month: 'SEPTEMBER',
        year: '2024',
        paymentSummary: [
            {
                name: 'Olivia Wilde',
                amount: 950,
                status: 'paid'
            },
            {
                name: 'Peter Parker',
                amount: 1100,
                status: 'pending'
            },
        ]
       },
       {
        month: 'OCTOBER',
        year: '2024',
        paymentSummary: [
            {
                name: 'Quinn Fabray',
                amount: 1050,
                status: 'paid'
            },
            {
                name: 'Rachel Green',
                amount: 1000,
                status: 'paid'
            },
        ]
       },
       {
        month: 'NOVEMBER',
        year: '2024',
        paymentSummary: [
            {
                name: 'Steve Rogers',
                amount: 1150,
                status: 'paid'
            },
            {
                name: 'Tony Stark',
                amount: 1200,
                status: 'pending'
            },
        ]
       },
       {
        month: 'DECEMBER',
        year: '2024',
        paymentSummary: [
            {
                name: 'Uma Thurman',
                amount: 1000,
                status: 'paid'
            },
            {
                name: 'Victor Stone',
                amount: 950,
                status: 'paid'
            },
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
      {paymentData.map((item, index) => (
        <div className='info-card-payment-container'  key={index}>
         <img  className='payment-card-month-year-img' src={item.month === 'JANUARY' ? JANUARY : item.month === 'FEBRUARY' ? FEBRUARY : item.month === 'MARCH' ? MARCH : item.month === 'APRIL' ? APRIL : item.month === 'MAY' ? MAY : item.month === 'JUNE' ? JUNE : item.month === 'JULY' ? JULY : item.month === 'AUGUST' ? AUGUST : item.month === 'SEPTEMBER' ? SEPTEMBER : item.month === 'OCTOBER' ? OCTOBER : item.month === 'NOVEMBER' ? NOVEMBER : DECEMBER}/>
         <span className='payment-card-month-year'>{item.month} {item.year}</span>
          <div className='payment-card-amount'>Pay {
            item.paymentSummary.reduce((total, payment) => total + payment.amount, 0)
            }</div>
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
               {item.paymentSummary.map((payment, index) => (
                <div className='payment-summary-item' key={index}>
                  <span>{payment.name}</span>
                  <span>₹{payment.amount}</span>
                </div>
               ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
