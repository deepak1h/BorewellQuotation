import React, { useState } from 'react';
import '../css/main.css';
import Logo from "../image/logo.png"
import "../css/quotation.css"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { signOut } from 'firebase/auth'
import html2pdf from 'html2pdf.js';


function encodeDateTime(today) {
  const dateTimeParts = today.split(",")[0].split("/");
  const timeParts = today.split(",")[1].trim().split(":");

  const day = dateTimeParts[1].padStart(2, '0');
  const month = dateTimeParts[0].padStart(2, '0');
  const year = dateTimeParts[2].slice(-2);
  const hours = timeParts[0].padStart(2, '0');
  const minutes = timeParts[1].padStart(2, '0');
  const seconds = timeParts[2].padStart(2, '0');

  return `RB-${year}${hours[1]}${seconds[0]}${minutes[1]}${day[0]}${month[1]}${seconds[1]}${day[1]}${minutes[1]}`;
}

let today = 'NA';

const Main = () => {

  const [formData, setFormData] = useState({
  name: '',
  address: '',
  email: '',
  mobile: '',
  diameter: '',
  depth: '',
  material: '',
  baseamount:40,
  quotation: 'NA'
  });

  const validate = () => {
    if (!auth.currentUser) {
      alert("You must be logged in to perform this action.");
      return false;
    }
    
    if (today === 'NA' || formData.quotation === 'NA') {
      alert("No Quotation Number Assigned");
      return false;
    }

    if (formData.name === '' || formData.email === '' || formData.mobile === '' || formData.address === '' || formData.depth === '' || formData.width === '' || formData.diameter === '' || formData.material === '') {
      alert("Some Details Missing");
      return false;
    }

    return true;
  };

  const handlePrint = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
  window.print();
  };

  const handleGetQuotation = (event) => {
    event.preventDefault();
    today = new Date().toLocaleString();
    const newQuotation = encodeDateTime(today) 
    
    setFormData({
      ...formData,
      quotation: newQuotation
    });
  };


  const handleSend = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const element = document.querySelector('.quotation-wrapper');

    try {
      const pdfBlob = await html2pdf().from(element).outputPdf('blob');

      // Store the PDF in Firebase Storage
      const storageRef = ref(storage, `quotations/${formData.name}_${formData.quotation}.pdf`);
      const snapshot = await uploadBytes(storageRef, pdfBlob);
      const url = await getDownloadURL(snapshot.ref);

      // Check if the quotation already exists
      const quotationsCollection = collection(db, 'quotations');
      const q = query(quotationsCollection, where('quotationNumber', '==', formData.quotation));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Quotation Number already exists");
        return;
      }

      // Store data in Firestore
      await addDoc(quotationsCollection, {
        userEmail: auth.currentUser.email,
        clientName: formData.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        quotationNumber: formData.quotation,
        depth: formData.depth,
        amount:quot+quot*0.18,
        mobile: formData.mobile,
        clientEmail: formData.email,
        pdfUrl: url
      });

      alert("Document Uploaded Successfully!!!");
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Some Error Occurred while uploading PDF");
    }
  };

  const [quot, setQuot] = useState(0);
  const [depthBreakdown, setDepthBreakdown] = useState([]);

  const calculateDepthBreakdown = () => {
    const baseAmount = parseInt(formData.baseamount);
    const depthData = [
      { depth: '0 to 100 ft', rate: baseAmount },
      { depth: '101 to 200 ft', rate: baseAmount+10 },
      { depth: '201 to 300 ft', rate: baseAmount+20 },
      { depth: '301 to 400 ft', rate: baseAmount+40 },
      { depth: '401 to 500 ft', rate: baseAmount+60 },
      { depth: '501 to 600 ft', rate: baseAmount+90},
      { depth: '601 to 700 ft', rate: baseAmount+120 },
      { depth: '701 to 800 ft', rate: baseAmount+160},
      { depth: '801 to 900 ft', rate: baseAmount+200 },
      { depth: '901 to 1000 ft', rate: baseAmount+250},
      { depth: '1001 to 1100 ft', rate: baseAmount+300 },
      { depth: '1101 to 1200 ft', rate: baseAmount+360 },
      { depth: '1201 to 1300 ft', rate: baseAmount+420 },
      { depth: '1301 to 1400 ft', rate: baseAmount+490 },
      { depth: '1401 to 1500 ft', rate: baseAmount+560 },
      { depth: '1501 to 1600 ft', rate: baseAmount+640 },
      { depth: '1601 to 1700 ft', rate: baseAmount+740 },
      { depth: '1701 to 1800 ft', rate: baseAmount+840 },
      { depth: '1801 to 1900 ft', rate: baseAmount+940 },
      { depth: '1901 to 2000 ft', rate: baseAmount+1080 },
    ];

    let remainingDepth = formData.depth;
    const breakdown = [];

    for (const item of depthData) {
      if (remainingDepth <= 0) break;

      const depthRange = item.depth;
      const rate = item.rate;
      const quantity = Math.min(remainingDepth, 100);
      const total = rate * quantity;

      breakdown.push({ depth: depthRange, rate, quantity, total });
      remainingDepth -= quantity;
    }

    setDepthBreakdown(breakdown);
    calculateTotal(breakdown);
  };

  // Function to calculate total
  const calculateTotal = (breakdown) => {
    const total = breakdown.reduce((acc, item) => acc + item.total, 0);
    setQuot(total);
  };

  React.useEffect(() => {
  calculateDepthBreakdown();
  }, [formData.depth, formData.baseamount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  return (
    <div className='main'>
      <div className='header'>
        <span>Welcome {auth.currentUser.displayName}</span>
        <h1 className='title'>Drilling Quotation</h1>
        <button onClick={()=>signOut(auth)}>Logout</button>
      </div>

      <div className='main-box'>
      
        <form className="quotation-form" >

          <div className='form-block1'>
            <label htmlFor="name">Client Name</label>
              <input type="text" name="name" placeholder='Eg. Company Name' required onChange={handleChange}/>
            
            <label htmlFor="address">Client's Address</label>
              <input type="text" placeholder='Eg. 14 street, Hyderabad 500001'  id="address" name="address" onChange={handleChange}/>
            
          </div>

          <div className='form-block2'>
          <label htmlFor="email">Email id:
            <input type="email" placeholder='Ex. xyz@gmail.com'  id="email" name="email" required onChange={handleChange}/>
            </label>
          
          <label htmlFor="mobile">Mobile:
            <input type="number" id="mobile" name="mobile" placeholder='Ex. 911111XX80' required onChange={handleChange}/>
            </label>
          </div>

          <div className='form-block2'>
          <label htmlFor="diameter">Diameter (in inches):
            <input type="number" id="diameter" name="diameter" placeholder='4 to 24 inch'  required onChange={handleChange}/>
          </label>

          <label htmlFor="depth">Depth (in feet):
            <input type="number" placeholder='1 - 2000 ft'  id="depth" name="depth" required onChange={handleChange}/>
          </label>
          
          </div>

          <div className='form-block3'>
          
          <label htmlFor="baseamount">BaseAmount(₹):
            <input type="text" placeholder='Default - ₹40'  id="baseamount" name="baseamount" onChange={handleChange}/>
          </label>
          
          <label htmlFor="material">
          <div className="select-wrapper">
            <select  id="material" name="material" onChange={handleChange}>
              <option value="">Select Material</option>
              <option value="steel">Steel</option>
              <option value="pvc">PVC</option>
              <option value="pe">Polyethylene</option>
              {/* Add more options here */}
            </select>
            </div>
          </label>
          </div>
          <div className='form-block4'>
          <button onClick={handleGetQuotation}>Get Quotation Number</button>
          <button onClick={handlePrint}>Print PDF</button>
          <button onClick={handleSend}>Send</button>
          
          </div>
        </form>
        <div className='preview'>
          <div className="quotation-wrapper">
            <header className="quotation-header">
                <h1>QUOTATION</h1>
                <div className="logo">
                    <img src={Logo} alt="Company Logo"/>
                </div>
            </header>
            <hr/>
            <div className="company-info">
                <div className="company-info-l">
                    <div className = "company-from">
                      <span className="company-name">Radha Borewell Motors</span>
                
                    <div className="company-contact">Flat No. 102, NM Residency, Road No-29
                    </div>
                    <div className="company-contact"> Township, Nenknampur,  Manikonda, Hyderabad - 89
                    </div>
                </div>
                <div className="company-to">
                  <div>
                      <span>Bill To : </span>
                  </div>
                  <div>
                        <span className="company-name">{formData.name}</span>
                        <br/>
                        <span className="company-contact">
                          {formData?.address} 
                            <br/>
                            Email: {formData.email}| Phone: {formData.mobile} </span>
                    </div>
                </div>
            </div>

            <div className="company-info-r">

                <div className="date-details">
                    <div className="contact">
                        <span>Contact</span>
                        <br/>+91-9959887758
                        <br/>+91-9000291118
                        <br/>+91-9542969290
                    </div>
                    <div className="date">
                        <span>Date: {today}</span>
                        <span>Quotation : {formData.quotation}</span>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div className="order-desc">
            <span className="company-name">Order Description:</span>
            <span> we want to make a borewell of depth {formData.depth} ft, diameter {formData.diameter} inch.</span>

        </div>


        <div>

            <div className="quotation-details">
                <table>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                      {depthBreakdown.map((item, index) => (
                          <tr key={index}>
                              <td>{item.depth}</td>
                              <td>{item.quantity}</td>
                              <td>{item.rate}</td>
                              <td>{item.total}</td>
                          </tr>
                      ))}
                  </tbody>
                  <tfoot>
                      <tr>
                          <td colspan="3">Total</td>
                          <td>₹{quot}</td>
                      </tr>
                  </tfoot>
                </table>
            </div>

        </div>

        <div className="total-box">
            <div className="grand-totals">
                <div className="line-item">
                    <span>Total</span>
                    <span>₹{quot} </span>
                </div>
                <div className="line-item">
                    <span>GST (18%)</span>
                    <span>₹{quot*0.18} </span>
                </div>
                <div className="line-item total-line">
                    <strong><span>Grand Total</span>
                    <span>₹{quot+quot*0.18} </span> </strong>
                </div>
            </div>
            <div className="signature">signature</div>
        </div>

        
        <hr/>
        <div className="quotation-footer">
            <span>Above information is not an invoice and only an estimate of services describe above. This estimate is non-contractual. if you have any questions concernig this quote, please get back to us using the contact details above. Thank you for considering K.M. Reddy Borewell Motors for your needs. We look forward to doing business with you.</span>
        </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Main;
