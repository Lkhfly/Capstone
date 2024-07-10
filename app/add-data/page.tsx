"use client"
import React, { FormEvent, useState,useEffect } from 'react';
import db from "../firebase/config";
import { collection, addDoc } from 'firebase/firestore';

const MyForm = () => {
  const [formData, setFormData] = useState({
    impact: 0,
    priority: 0,
    effort: 0,
    pie : 0,
    budget : 0,
    department: '',
    status: '',
    type: '',
    id : '',
    description : ''
  });
  const [error, setError] = useState("")

  const handleInputChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChangeNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };
  const handleInputChangeString = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //calculate pie
  useEffect(() => {
    const { impact, priority, effort } = formData;
    setFormData((prevNumbers) => ({
      ...prevNumbers,
      pie: impact*priority*effort,
    }));
  }, [formData.impact,formData.priority, formData.effort ]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'pfc'), formData);
      setError('Document written with ID: ' + docRef.id);
      // Reset form data
      setFormData({
        impact: 0,
        priority: 0,
        effort: 0,
        pie : 0,
        budget : 0,
        department: '',
        status: '',
        type: '',
        id : '',
        description : ''
      });
    } catch (e) {
      setError("Error is "+ e)
    }
  };

  return (
  <div className="container mx-auto py-10">
    <h3 className = "mb-10 text-2xl text-blue-600">Adding a task</h3>
    <form onSubmit={handleSubmit}>
      <div>
        <label className = "font-bold">
          ID
          <input
            type="text" required
            name="id"
            value={formData.id}
            onChange={handleInputChangeString}
            className = "ml-3 font-light"
          />
        </label>
      </div>
      <div>
        <label htmlFor="description" className="block font-bold">Description</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          cols={50}
          value={formData.description}
          onChange={handleInputChangeDescription}
          required
        ></textarea>
      </div>
      <div>
        <label className = "font-bold">
          Impact
          <input
            type="number"
            min = "1" max = "10"
            name="impact"
            value={formData.impact}
            onChange={handleInputChangeNumber}
            className = "ml-3 font-light"
          />
        </label>
      </div>
      <div>
        <label className = "font-bold">
          Priority
          <input
            type="number"
            min = "1" max = "10"
            name="priority"
            value={formData.priority}
            onChange={handleInputChangeNumber}
            className = "ml-3 font-light"
          />
        </label>
      </div>
      <div>
        <label className = "font-bold">
          Effort
          <input
            type="number"
            min = "1" max = "10"
            name="effort"
            value={formData.effort}
            onChange={handleInputChangeNumber}
            className = "ml-3 font-light"
          />
        </label>
      </div>
      <div>
        <label className = "font-bold">
          PIE Score
          <input
            type="number"
            name="pie"
            value={formData.pie}
            readOnly
            className = "ml-3 font-light"
          />
        </label>
      </div>

      <div>
        <label className = "font-bold">
          Budget
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChangeNumber}
            required
            className = "ml-3 font-light"
          />
        </label>
      </div>


      <div>
        <label className = "font-bold">
          Department
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light"
          >
            <option value="">Select an option</option>
            <option value="Assembly">Assembly</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="OA">OA</option>
          </select>
        </label>
      </div>
      <div>
        <label className = "font-bold">
          Status 
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light"
          >
            <option value="">Select an option</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </label>
      </div>
      <div>
        <label className = "font-bold">
          Type of issue
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light"
          >
            <option value="">Select an option</option>
            <option value="Quality">Quality</option>
            <option value="Throughput">Throughput</option>
            <option value="Defect">Defect</option>
          </select>
        </label>
      </div>

      <button type="submit" className = "mt-5 font-bold text-blue-600">Submit</button>

{/* Notification */}
      <div>
        <label>{error}
        </label>
      </div>
    </form>
  </div>
  );
};

export default MyForm;
