// import React from "react";
// import Card from "./Card";

// const CardList = () => {
//   const cardData = [
//     // Developer
//     {
//       fullname: "Ar****a Mi***a",
//       city: "Bangalore",
//       state: "Karnataka",
//       primary: "Full Stack Developer",
//       secondary: "React Developer",
//       yearsOfExperience: 5,
//       education: "B.Tech in Computer Science, IIIT Bangalore",
//       workexp: "Developed web applications for e-commerce platforms.",
//       assignments: "Built an inventory management tool; optimized APIs.",
//     },
//     {
//       fullname: "Vi****l Sh***a",
//       city: "Delhi",
//       state: "Delhi",
//       primary: "Backend Developer",
//       secondary: "Database Administrator",
//       yearsOfExperience: 6,
//       education: "MCA, Delhi University",
//       workexp: "Designed and maintained backend services for fintech systems.",
//       assignments: "Developed REST APIs; handled database migrations.",
//     },
//     // Add the remaining developer entries here...

//     // Designer
//     {
//       fullname: "Ar****a Ba***a",
//       city: "Mumbai",
//       state: "Maharashtra",
//       primary: "UI/UX Designer",
//       secondary: "Interaction Designer",
//       yearsOfExperience: 6,
//       education: "B.Des in Visual Communication, NID Ahmedabad",
//       workexp: "Designed user interfaces for fintech apps and SaaS platforms.",
//       assignments:
//         "Created wireframes for a travel app; improved app accessibility.",
//     },
//     // Add the remaining designer entries here...

//     // Cloud DevOps
//     {
//       fullname: "Ra***h Si***h",
//       city: "Bengaluru",
//       state: "Karnataka",
//       primary: "DevOps Engineer",
//       secondary: "Cloud Solutions Architect",
//       yearsOfExperience: 8,
//       education: "B.Tech in Information Technology, PES University",
//       workexp:
//         "Implemented CI/CD pipelines and managed multi-cloud environments.",
//       assignments:
//         "Deployed scalable microservices; migrated apps to AWS cloud.",
//     },
//     // Add the remaining Cloud DevOps entries here...

//     // Content Creator
//     {
//       fullname: "Pr***a Ka***r",
//       city: "Mumbai",
//       state: "Maharashtra",
//       primary: "Video Content Creator",
//       secondary: "Social Media Influencer",
//       yearsOfExperience: 5,
//       education: "B.A. in Mass Communication, St. Xavier's College",
//       workexp:
//         "Created engaging video content for lifestyle brands and startups.",
//       assignments:
//         "Produced vlogs for a travel agency; collaborated with fashion labels.",
//     },
//     // Add the remaining Content Creator entries here...

//     // Digital Marketing
//     {
//       fullname: "Ar***a Ba***h",
//       city: "Pune",
//       state: "Maharashtra",
//       primary: "SEO Specialist",
//       secondary: "Content Marketer",
//       yearsOfExperience: 6,
//       education: "BBA in Marketing, Symbiosis International University",
//       workexp:
//         "Optimized websites for search engines and developed content plans.",
//       assignments:
//         "Ranked a startup in top Google results; designed keyword strategies.",
//     },
//     // Add the remaining Digital Marketing entries here...

//     // Lawyer
//     {
//       fullname: "Sa***h Me***a",
//       city: "Delhi",
//       state: "Delhi",
//       primary: "Criminal Lawyer",
//       secondary: "Civil Litigator",
//       yearsOfExperience: 10,
//       education: "LLB, Delhi University",
//       workexp: "Handled high-profile criminal cases and civil disputes.",
//       assignments:
//         "Defended a criminal trial; resolved a corporate civil suit.",
//     },
//     // Add the remaining Lawyer entries here...

//     // HR
//     {
//       fullname: "An***a Ku***r",
//       city: "Pune",
//       state: "Maharashtra",
//       primary: "Recruitment Specialist",
//       secondary: "Employee Engagement Expert",
//       yearsOfExperience: 5,
//       education: "MBA in Human Resources, Symbiosis International University",
//       workexp: "Hired talent for IT firms and boosted employee retention.",
//       assignments:
//         "Closed hiring for tech positions; improved engagement programs.",
//     },
//     // Add the remaining HR entries here...

//     // Accountant
//     {
//       fullname: "Sa***t Mi***a",
//       city: "Ahmedabad",
//       state: "Gujarat",
//       primary: "Tax Accountant",
//       secondary: "Financial Planner",
//       yearsOfExperience: 7,
//       education: "CA, ICAI",
//       workexp: "Filed tax returns and provided financial planning for SMEs.",
//       assignments: "Prepared GST filings; designed tax-saving strategies.",
//     },
//     // Add the remaining Accountant entries here...
//   ];
//   return (
//     <div className="card-list">
//       {cardData.map((data, index) => (
//         <Card key={index} {...data} />
//       ))}
//     </div>
//   );
// };

// export default CardList;
import React from "react";
import Card from "./Card";

const CardList = ({ profession }) => {
  const cardData = [
    // Developer Profession
    {
      uid: "dev1",
      fullname: "Aarav Sharma",
      firstName: "Aarav",
      city: "Mumbai",
      state: "Maharashtra",
      primary: "Full Stack Developer",
      secondary: "Backend Engineer",
      yearsOfExperience: 5,
      education: "B.Tech in Computer Science, IIT Bombay",
      workexp: "Developed scalable e-commerce platforms.",
      assignments:
        "Built a payment gateway system; improved database performance.",
    },
    {
      uid: "dev2",
      fullname: "Riya Singh",
      firstName: "Riya",
      city: "Pune",
      state: "Maharashtra",
      primary: "Frontend Developer",
      secondary: "React Specialist",
      yearsOfExperience: 3,
      education: "B.E. in Information Technology, COEP Pune",
      workexp: "Designed and developed interactive UI components.",
      assignments:
        "Built a real-time dashboard; optimized mobile responsiveness.",
    },

    // Designer Profession
    {
      uid: "des1",
      fullname: "Maya Gupta",
      firstName: "Maya",
      city: "Bangalore",
      state: "Karnataka",
      primary: "UI/UX Designer",
      secondary: "Graphic Designer",
      yearsOfExperience: 3,
      education: "B.Des in Design, NID Ahmedabad",
      workexp: "Created designs for mobile and web applications.",
      assignments: "Designed an onboarding flow; optimized user dashboards.",
    },

    // Cloud DevOps Profession
    {
      uid: "devops1",
      fullname: "Rohan Verma",
      firstName: "Rohan",
      city: "Hyderabad",
      state: "Telangana",
      primary: "Cloud DevOps Engineer",
      secondary: "AWS Specialist",
      yearsOfExperience: 4,
      education: "M.Tech in Cloud Computing, IIIT Hyderabad",
      workexp: "Managed cloud infrastructure for startups.",
      assignments: "Automated deployment pipelines; optimized AWS costs.",
    },
    {
      uid: "devops2",
      fullname: "Sneha Kapoor",
      firstName: "Sneha",
      city: "Chennai",
      state: "Tamil Nadu",
      primary: "DevOps Engineer",
      secondary: "Kubernetes Specialist",
      yearsOfExperience: 6,
      education: "B.Tech in Software Engineering, Anna University",
      workexp: "Deployed scalable applications on Kubernetes.",
      assignments: "Set up CI/CD pipelines; automated deployment processes.",
    },

    // Content Creator Profession
    {
      uid: "cc1",
      fullname: "Ananya Roy",
      firstName: "Ananya",
      city: "Delhi",
      state: "Delhi",
      primary: "Content Writer",
      secondary: "Copywriter",
      yearsOfExperience: 6,
      education: "M.A. in English Literature, Delhi University",
      workexp: "Created engaging content for marketing campaigns.",
      assignments: "Wrote SEO blogs; developed product copy.",
    },
    {
      uid: "cc2",
      fullname: "Vikas Patel",
      firstName: "Vikas",
      city: "Ahmedabad",
      state: "Gujarat",
      primary: "Content Strategist",
      secondary: "Technical Writer",
      yearsOfExperience: 4,
      education: "B.A. in Journalism, MSU Baroda",
      workexp: "Planned and executed content strategies for tech companies.",
      assignments: "Drafted white papers; curated user manuals.",
    },
    {
      uid: "cc3",
      fullname: "Pooja Sharma",
      firstName: "Pooja",
      city: "Lucknow",
      state: "Uttar Pradesh",
      primary: "Blogger",
      secondary: "Social Media Influencer",
      yearsOfExperience: 2,
      education: "B.Sc. in Communication, AMU",
      workexp: "Created engaging blog content.",
      assignments: "Published travel blogs; managed Instagram campaigns.",
    },

    // Digital Marketing Profession
    {
      uid: "dm1",
      fullname: "Kabir Singh",
      firstName: "Kabir",
      city: "Pune",
      state: "Maharashtra",
      primary: "Digital Marketing Specialist",
      secondary: "SEO Expert",
      yearsOfExperience: 5,
      education: "MBA in Marketing, Symbiosis Pune",
      workexp: "Ran campaigns for leading brands.",
      assignments: "Managed PPC campaigns; improved organic traffic.",
    },

    // Lawyer Profession
    {
      uid: "law1",
      fullname: "Simran Kaur",
      firstName: "Simran",
      city: "Chandigarh",
      state: "Punjab",
      primary: "Corporate Lawyer",
      secondary: "Legal Advisor",
      yearsOfExperience: 7,
      education: "LLB, Punjab University",
      workexp: "Handled legal cases for corporate clients.",
      assignments: "Drafted agreements; represented clients in court.",
    },
    {
      uid: "law2",
      fullname: "Vivek Menon",
      firstName: "Vivek",
      city: "Cochin",
      state: "Kerala",
      primary: "Civil Lawyer",
      secondary: "Mediation Specialist",
      yearsOfExperience: 10,
      education: "LLM, NLSIU Bangalore",
      workexp: "Settled civil disputes through effective mediation.",
      assignments:
        "Drafted civil litigation documents; advised on legal compliance.",
    },

    // HR Profession
    {
      uid: "hr1",
      fullname: "Arjun Mehta",
      firstName: "Arjun",
      city: "Gurgaon",
      state: "Haryana",
      primary: "HR Manager",
      secondary: "Talent Acquisition Specialist",
      yearsOfExperience: 8,
      education: "MBA in Human Resources, XLRI Jamshedpur",
      workexp: "Managed recruitment and employee relations.",
      assignments: "Designed HR policies; conducted training programs.",
    },

    // Accountant Profession
    {
      uid: "acc1",
      fullname: "Pooja Das",
      firstName: "Pooja",
      city: "Kolkata",
      state: "West Bengal",
      primary: "Accountant",
      secondary: "Tax Consultant",
      yearsOfExperience: 6,
      education: "B.Com in Finance, St. Xavier's Kolkata",
      workexp: "Prepared financial reports for SMEs.",
      assignments: "Audited financial records; optimized tax filings.",
    },
    {
      uid: "acc2",
      fullname: "Rahul Nair",
      firstName: "Rahul",
      city: "Trivandrum",
      state: "Kerala",
      primary: "Financial Analyst",
      secondary: "Forensic Accountant",
      yearsOfExperience: 5,
      education: "M.Com in Accounting, Christ University",
      workexp: "Analyzed financial discrepancies for enterprises.",
      assignments: "Conducted audits; identified fraud risks.",
    },
  ];

  // Filter data based on the selected profession
  const filteredData = cardData.filter(
    (card) =>
      card.primary.toLowerCase().includes(profession?.toLowerCase()) ||
      card.secondary.toLowerCase().includes(profession?.toLowerCase())
  );

  return (
    <div className="card-list">
      {filteredData.length > 0 ? (
        filteredData.map((data, index) => <Card key={index} {...data} />)
      ) : (
        <p>No professionals match the selected profession.</p>
      )}
    </div>
  );
};

export default CardList;
