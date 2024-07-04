import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import "../css/adminmain.css"; 
import { signOut } from 'firebase/auth'

const Adminmain = () => {
  const [quotations, setQuotations] = useState([]);
  const [groupedQuotations, setGroupedQuotations] = useState({});

  useEffect(() => {
    const fetchQuotations = async () => {
      const q = query(collection(db, 'quotations'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setQuotations(data);
      groupQuotationsByDate(data);
    };

    fetchQuotations();
  }, []);

  const groupQuotationsByDate = (data) => {
    const grouped = data.reduce((acc, curr) => {
      const date = curr.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});
    setGroupedQuotations(grouped);
  };

  return (
    <div className="admin">
      <h1>Admin Portal</h1>
      <button onClick={()=>signOut(auth)}>Logout</button>
      {Object.keys(groupedQuotations).map(date => (
        <div key={date} className="date-group">
          <h2>{date}</h2>
          {groupedQuotations[date].map((quotation, index) => (
            <div key={index} className="quotation-card">
              <p><strong>Client Name:</strong> {quotation.clientName}</p>
              <p><strong>Client Address:</strong> {quotation.clientAddress}</p>
              <p><strong>Client Email:</strong> {quotation.clientEmail}</p>
              <p><strong>Client Mobile:</strong> {quotation.mobile}</p>
              <p><strong>Depth:</strong> {quotation.depth} ft</p>
              <p><strong>Diameter:</strong> {quotation.diameter} inches</p>
              <p><strong>Quotation Number:</strong> {quotation.quotationNumber}</p>
              <p><strong>PDF:</strong> <a href={quotation.pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a></p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Adminmain;
