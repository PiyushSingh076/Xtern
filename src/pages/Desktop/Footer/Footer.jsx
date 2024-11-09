import React from 'react';
import './Footer.css';

const option = [
  { "Categories": ["Engineering Manager", "Technology & Programming", "Design", "Project management", "Cloud Devops"] },
  { "About": ["About us", "Career", "Blogs", "FAQ's", "Contact us"] },
  { "Services": ["Services", "Projects", "Jobs", "Xterns", "XPerts"] },
  { "Support": ["Privacy Policy", "Terms of Use", "Help center", "Updates", "Documentation"] },
  { "Connect": ["Linkedin", "Twitter", "Facebook", "Instagram", "Youtube"] }
];

export default function Footer() {
  return (
    <div className='footer-container'>
      <div className='footer-list-options'>
        {option.map((item, index) => {
          const [key, values] = Object.entries(item)[0]; // Get the key and value array from the object
          return (
            <div key={index} className='footer-section'>
              <h4>{key}</h4>
             
                {values.map((category, catIndex) => (
                 <div className='options'>
                     <span key={catIndex}>{category}</span>
                 </div>
                ))}
             
            </div>
          );
        })}
      </div>
      
      <div className='copyright-container'>
        <span>Xpert</span>
        <span>© 2024 Xpert. All Rights Reserved.</span>
      </div>
    </div>
  );
}