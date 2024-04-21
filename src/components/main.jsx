import React, { useState } from 'react';
import '../css/main.css';
import Logo from "../image/logo.png"
import "../css/quotation.css"
import { useNavigate } from 'react-router-dom';


const handlePrint = () => {
  window.print();

};

const Main = () => {
  // States to store the input values
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    mobile: '',
    diameter: '',
    depth: '',
    material: ''
  });

  const [quot, setQuot] = useState(0);
  const [depthBreakdown, setDepthBreakdown] = useState([]);

  const calculateDepthBreakdown = () => {
    const depthData = [
      { depth: '0 to 100 ft', rate: 40 },
      { depth: '101 to 200 ft', rate: 50 },
      { depth: '201 to 300 ft', rate: 60 },
      { depth: '301 to 400 ft', rate: 80 },
      { depth: '401 to 500 ft', rate: 100 },
      { depth: '501 to 600 ft', rate: 130 },
      { depth: '601 to 700 ft', rate: 160 },
      { depth: '701 to 800 ft', rate: 200 },
      { depth: '801 to 900 ft', rate: 240 },
      { depth: '901 to 1000 ft', rate: 290 },
      { depth: '1001 to 1100 ft', rate: 340 },
      { depth: '1101 to 1200 ft', rate: 400 },
      { depth: '1201 to 1300 ft', rate: 450 },
      { depth: '1301 to 1400 ft', rate: 530 },
      { depth: '1401 to 1500 ft', rate: 600 },
      { depth: '1501 to 1600 ft', rate: 680 },
      { depth: '1601 to 1700 ft', rate: 780 },
      { depth: '1701 to 1800 ft', rate: 880 },
      { depth: '1801 to 1900 ft', rate: 990 },
      { depth: '1901 to 2000 ft', rate: 1080 },
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
  }, [formData.depth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   generatePDF();
  // };

  // const generatePDF = () => {
    
  //   const input = document.getElementsByClassName
  //   ("quotation-wrapper")[0];

  //   if (input){
  //     html2canvas(input)
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF({
  //         orientation: 'p',
  //         unit: 'px',
  //         format: [canvas.width, canvas.height]
  //       });
  //       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  //       pdf.save("quote.pdf");
  //     });
  //   }
  //   else{
  //     console.log("not rendered")
  //   }
  // };

  
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className='main'>
      <div className='header'>
        <h1 className='title'>Drilling Quotation</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className='main-box'>
      
        <form className="quotation-form" >
          <div className='form-block1'>
            <label htmlFor="name">Client Name</label>
              <input type="text" name="name"  required onChange={handleChange}/>
            
            <label htmlFor="address">Client's Address</label>
              <input type="text" id="address" name="address" onChange={handleChange}/>
            
          </div>
          <div className='form-block2'>
          <label htmlFor="email">Email id:
            <input type="email" id="email" name="email" required onChange={handleChange}/>
            </label>
          
          <label htmlFor="mobile">Mobile:
            <input type="number" id="mobile" name="mobile" required onChange={handleChange}/>
            </label>
          </div>
          <div className='form-block3'>
          <label htmlFor="diameter">Diameter (in inches):
            <input type="number" id="diameter" name="diameter" required onChange={handleChange}/>
          </label>

          <label htmlFor="depth">Depth (in feet):
            <input type="number" id="depth" name="depth" required onChange={handleChange}/>
          </label>
          </div>
          <div className='form-block3'>
          <label htmlFor="material">Material:
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
          <button onClick={handlePrint}>Print PDF</button>
          </div>
        </form>
        <div className='preview'>
          <div className="quotation-wrapper">
            <header className="quotation-header">
                <h1>Quotation</h1>
            </header>
            <hr/>
            <div className="company-info">
                <div className="company-info-l">
                    <div className = "company-from">
                      <span className="company-name">K.M. Reddy Borewell Motors</span>
                
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
                <div className="logo">
                    <img src={Logo} alt="Company Logo"/>
                </div>
                <div className="date-details">
                    <div className="contact">
                        <span>Contact</span>
                        <br/>+91-9959887758
                        <br/>+91-9000291118
                        <br/>+91-9542969290
                    </div>
                    <div className="date">
                        <span>Date: April 13, 2024</span>
                        <span>Quotation #: 001234</span>
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
                    {/* <tbody>
                        <tr>
                            <td>000 to 100 ft</td>
                            <td>100</td>
                            <td>₹40 </td>
                            <td>₹4000 </td>
                        </tr>
                        <tr>
                            <td>101 to 200 ft</td>
                            <td>100</td>
                            <td>₹50 </td>
                            <td>₹5000 </td>
                        </tr>
                        <tr>
                            <td>201 to 300 ft</td>
                            <td>100</td>
                            <td>₹60 </td>
                            <td>₹6000 </td>
                        </tr>
                        <tr>
                            <td>301 to 400 ft</td>
                            <td>100</td>
                            <td>₹80 </td>
                            <td>₹8000 </td>
                        </tr>
                        <tr>
                            <td>401 to 500 ft</td>
                            <td>100</td>
                            <td>₹100 </td>
                            <td>₹10000 </td>
                        </tr>
                        <tr>
                            <td>501 to 600 ft</td>
                            <td>100</td>
                            <td>₹130 </td>
                            <td>₹13000 </td>
                        </tr>
                        <tr>
                            <td>601 to 700 ft </td>
                            <td>100</td>
                            <td>₹160 </td>
                            <td>₹16000 </td>
                        </tr>
                        <tr>
                            <td>701 to 800 ft</td>
                            <td>100</td>
                            <td>₹200 </td>
                            <td>₹20000 </td>
                        </tr>
                        <tr>
                            <td>801 to 900 ft</td>
                            <td>100</td>
                            <td>₹240 </td>
                            <td>₹24000 </td>
                        </tr>
                        <tr>
                            <td>901 to 1000 ft</td>
                            <td>100</td>
                            <td>₹290 </td>
                            <td>₹29000 </td>
                        </tr>
                        <tr>
                            <td>1001 to 1100 ft</td>
                            <td>100</td>
                            <td>₹340 </td>
                            <td>₹34000 </td>
                        </tr>
                        <tr>
                            <td>1101 to 1200 ft</td>
                            <td>100</td>
                            <td>₹400 </td>
                            <td>₹40000 </td>
                        </tr>
                        <tr>
                            <td>1201 to 1300 ft</td>
                            <td>100</td>
                            <td>₹460 </td>
                            <td>₹46000 </td>
                        </tr>
                        <tr>
                            <td>1301 to 1400 ft</td>
                            <td>100</td>
                            <td>₹530 </td>
                            <td>₹53000 </td>
                        </tr>
                        <tr>
                            <td>1401 to 1500 ft</td>
                            <td>100</td>
                            <td>₹600 </td>
                            <td>₹60000 </td>
                        </tr>
                        <tr>
                            <td>1501 to 1600 ft</td>
                            <td>100</td>
                            <td>₹680 </td>
                            <td>₹68000 </td>
                        </tr>
                        <tr>
                            <td>1601 to 1700 ft </td>
                            <td>100</td>
                            <td>₹780 </td>
                            <td>₹78000 </td>
                        </tr>
                        <tr>
                            <td>1701 to 1800 ft</td>
                            <td>100</td>
                            <td>₹880 </td>
                            <td>₹88000 </td>
                        </tr>
                        <tr>
                            <td>1801 to 1900 ft</td>
                            <td>100</td>
                            <td>₹980 </td>
                            <td>₹98000 </td>
                        </tr>
                        <tr>
                            <td>1901 to 1950 ft</td>
                            <td>50</td>
                            <td>₹1080 </td>
                            <td>₹54000 </td>
                        </tr>
                        <tr>
                            <td>Mic. </td>
                            <td>-</td>
                            <td>-</td>
                            <td>₹10000 </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3">Total</td>
                            <td>₹764000 </td>
                        </tr>
                    </tfoot> */}

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
