import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Table } from 'flowbite-react';
import "../css/adminmain.css";
import dayjs from 'dayjs';

const Adminmain = () => {
  const [quotations, setQuotations] = useState([]);
  const [sortOrder, setSortOrder] = useState({ field: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotations();
  }, [sortOrder]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, quotations]);

  const fetchQuotations = async () => {
    let q = query(collection(db, 'quotations'));

    const today = dayjs().startOf('day');
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');

    if (sortOrder.field === 'today') {
      q = query(q, where('date', '>=', Timestamp.fromDate(today.toDate())), where('date', '<', Timestamp.fromDate(tomorrow.toDate())));
    } else if (sortOrder.field === 'yesterday') {
      q = query(q, where('date', '>=', Timestamp.fromDate(yesterday.toDate())), where('date', '<', Timestamp.fromDate(today.toDate())));
    } else {
      q = query(q, orderBy(sortOrder.field, sortOrder.direction));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.data());
    setQuotations(data);
  };

  const handleSortChange = (field, direction) => {
    setSortOrder({ field, direction });
  };

  const handleSearch = () => {
    const filtered = quotations.filter(quotation =>
      Object.values(quotation).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredQuotations(filtered);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin">
      <h1>Admin Portal</h1>
      <div className="sort-buttons flex justify-between pb-4">
        <Dropdown label="Sort by" inline>
          <Dropdown.Item onClick={() => handleSortChange('today', 'asc')}>Today</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('yesterday', 'asc')}>Yesterday</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('userEmail', 'asc')}>Dealer Name Ascending</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('userEmail', 'desc')}>Dealer Name Descending</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('date', 'asc')}>Date Ascending</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('date', 'desc')}>Date Descending</Dropdown.Item>
        </Dropdown>
        <button className="bg-gray-800 text-white px-3 py-1.5 rounded-lg" onClick={navigateToHome}>Home</button>
        <div className="flex items-center">
          <input
            type="text"
            id="table-search"
            className="block p-2 text-sm text-gray-900 border rounded-lg bg-gray-50"
            placeholder="Search for items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg ml-2"
          >
            Search
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell style={{ color: 'black' }}>Client Name</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Client Address</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Client Email</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Client Mobile</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Depth</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Diameter</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Quotation Number</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Dealer Name</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Date</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>Time</Table.HeadCell>
            <Table.HeadCell style={{ color: 'black' }}>PDF</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredQuotations.map((quotation, index) => (
              <Table.Row key={index} className="bg-white dark:bg-gray-800">
                <Table.Cell>{quotation.clientName}</Table.Cell>
                <Table.Cell>{quotation.clientAddress}</Table.Cell>
                <Table.Cell>{quotation.clientEmail}</Table.Cell>
                <Table.Cell>{quotation.mobile}</Table.Cell>
                <Table.Cell>{quotation.depth} ft</Table.Cell>
                <Table.Cell>{quotation.diameter} inches</Table.Cell>
                <Table.Cell>{quotation.quotationNumber}</Table.Cell>
                <Table.Cell>{quotation.userEmail}</Table.Cell>
                <Table.Cell>{quotation.date}</Table.Cell>
                <Table.Cell>{quotation.time}</Table.Cell>
                <Table.Cell>
                  <a href={quotation.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default Adminmain;
