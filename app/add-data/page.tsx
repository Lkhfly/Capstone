"use client"
import React, { FormEvent, useState,useEffect } from 'react';
import db from "../firebase/config";
import { collection, addDoc } from 'firebase/firestore';
import NavBar from '@/components/ui/navbar';

const MyForm = () => {
  // const [formData, setFormData] = useState({
  //   impact: 0,
  //   priority: 0,
  //   effort: 0,
  //   pie : 0,
  //   budget : 0,
  //   department: '',
  //   status: '',
  //   type: '',
  //   id : '',
  //   description : ''
  // });
  const [formData, setFormData] = useState({
    title : '', 
    station : '',
    date_sub : '',
    date_comp : '',
    emp_name : '',
    gm_id : '',
    job : '',
    department : '',
    group : 0,
    shift_number : 0,
    team : 0,
    recurring : '',
    frequency : '',
    category : '',
    description : '',
    important : '',
    budget : 0, 
    status : 'In Progress',
    uid : Date.now().toString(36),
    // For chart testing only
    priority : Math.floor(Math.random() * 10),
    impact : Math.floor(Math.random() * 10), 
    effort : Math.floor(Math.random() * 10)
  });
  const [error, setError] = useState("")

  // function to change for TextArea element (description, important)
  const handleInputChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // function to change for Number element (group, shift_number,team)
  const handleInputChangeNumber = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };
  // function to change for String element (the rest)
  const handleInputChangeString = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // function to change for Select element (category, recurring, frequency)
  const handleInputChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'pfc'), formData);
      setError('Document written with ID: ' + docRef.id);
      // Reset form data
      setFormData({
        title : '', 
        station : '',
        date_sub : '',
        date_comp : '',
        emp_name : '',
        gm_id : '',
        job : '',
        department : '',
        group : 0,
        shift_number : 0,
        team : 0,
        recurring : '',
        frequency : '',
        category : '',
        description : '',
        important : '',
        budget : 0,
        status : 'In Progress',
        uid : Date.now().toString(36),
        priority : Math.floor(Math.random() * 10),
        impact : Math.floor(Math.random() * 10), 
        effort : Math.floor(Math.random() * 10)
      });
    } catch (e) {
      setError("Error is "+ e)
    }
  };

  return (
  <div>
  <NavBar />
  <div className="container mx-auto py-5">
    <h3 className = "mb-10 text-2xl font-bold">PFC (Plan For Change) Submission Form </h3>
    <form onSubmit={handleSubmit}>

{/* First group of input starts*/}
     {/* Title */}
      <div>
        <label className = "font-medium">
          Title of PFC : 
          <input
            type="text" required
            name="title"
            value={formData.title}
            onChange={handleInputChangeString}
            className = "ml-3 font-light border-solid border-2 rounded-lg"
          />
        </label>
      </div>
<hr className = "mt-5 "></hr>
<div className="grid grid-cols-2 mt-5 gap-3">
      {/* Station Number */}
        <div>
          <label className = "font-medium">
            Station Number :  
            <input
              type="text" required
              name="station"
              value={formData.station}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
        {/* Employee Name */}
        <div>
          <label className = "font-medium">
            Employee Name :  
            <input
              type="text" required
              name="emp_name"
              value={formData.emp_name}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>

      {/* Date of Submission */}
        <div>
          <label className = "font-medium">
            Date of PFC Submission :  
            <input
              type="date" required
              name="date_sub"
              value={formData.date_sub}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
        {/* GM ID */}
        <div>
          <label className = "font-medium">
            GMID :  
            <input
              type="text" required
              name="gm_id"
              value={formData.gm_id}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>

      {/* Date PFC Completed */}
        <div>
          <label className = "font-medium">
            Date PFC Completed :  
            <input
              type="date" required
              name="date_comp"
              value={formData.date_comp}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
        {/* Job Position */}
        <div>
          <label className = "font-medium">
            Job Position :  
            <input
              type="text" required
              name="job"
              value={formData.job}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>

      {/* Group # */}
        <div>
          <label className = "font-medium">
            Group # :  
            <input
              type="number" required min = {0}
              name="group"
              value={formData.group}
              onChange={handleInputChangeNumber}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
        {/* Shift # */}
        <div>
          <label className = "font-medium">
            Shift # :  
            <input
              type="number" required min = {0}
              name="shift_number"
              value={formData.shift_number}
              onChange={handleInputChangeNumber}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
      {/* Department */}
        <div>
          <label className = "font-medium">
            Department :  
            <input
              type="text" required
              name="department"
              value={formData.department}
              onChange={handleInputChangeString}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
        {/* Team # */}
        <div>
          <label className = "font-medium">
            Team # : 
            <input
              type="number" required min = {0}
              name="team"
              value={formData.team}
              onChange={handleInputChangeNumber}
              className = "ml-3 font-light border-solid border-2 rounded-lg"
            />
          </label>
        </div>
</div>
{/* First group of input end */}
<hr className = "mt-5 "></hr>
{/* Select start */}
      {/* Recurring */}
      <div className = "mt-5">
        <label className = "font-medium">
          Is this a recurring issue ?
          <select
            name="recurring"
            value={formData.recurring}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light border-solid border-2 rounded-lg"
          >
            <option value="">Select an option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
      </div>
      {/* Frequency */}
      <div className = "mt-4">
        <label className = "font-medium">
          If you answered yes to the prior question, how frequently would you say this issue occur ? 
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light border-solid border-2 rounded-lg"
          >
            <option value="">Select an option</option>
            <option value="Once a month">Once a month</option>
            <option value="Once a week">Once a week</option>
            <option value="Several times a week">Several times a week</option>
            <option value="Once a shift">Once a shift</option>
            <option value="Several times a shift">Several times a shift</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>
        </label>
      </div>

      {/* Category of PFC */}
      <div className = "mt-4">
        <label className = "font-medium">
          What is this PFC related to ? Select all that apply ?
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChangeSelect}
            required
            className = "ml-3 font-light border-solid border-2 rounded-lg"
          >
            <option value="">Select an option</option>
            <option value="Safety">Safety</option>
            <option value="PIP">PIP</option>
            <option value="Quality Defects">Quality Defects</option>
            <option value="Throughput">Throughput</option>
            <option value="N/A">N/A</option>           
          </select>
        </label>
      </div>
{/* Select end */}
<hr className = "mt-5 "></hr>
{/* Description starts */}
      <div className = "mt-5">
        <label htmlFor="description" className="block font-medium">Describe the problem you are submitting a PFC for : </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          cols={50}
          value={formData.description}
          onChange={handleInputChangeDescription}
          required
          className = "border-solid border-2 rounded-lg"
        ></textarea>
      </div>

      <div>
        <label htmlFor="important" className="block font-medium">Explain in 1-2 sentences why this PFC is important : </label>
        <textarea
          id="important"
          name="important"
          rows={2}
          cols={50}
          value={formData.important}
          onChange={handleInputChangeDescription}
          required
          className = "border-solid border-2 rounded-lg"
        ></textarea>
      </div>
{/* Description ends */}
      {/* <div>
        <label className = "font-medium">
          Budget :
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleInputChangeNumber}
            required
            className = "ml-3 font-light border-solid border-2 rounded-lg"
          />
        </label>
      </div> */}
      <div>
        <h1 className = "font-medium mt-2">
          Upload any relevant pictures or documents you may have :
        </h1>
      <button disabled className = "mt-2   font-bold border-solid border-2 py-2 px-4 rounded-full">Upload</button>
      </div>
      <button type="submit" className = "mt-10 bg-blue-950 text-white font-bold py-2 px-4 rounded-full">Submit PFC Request</button>

{/* Notification */}
      <div>
        <label>{error}
        </label>
      </div>
    </form>
  </div>
  </div>
  );
};

export default MyForm;
