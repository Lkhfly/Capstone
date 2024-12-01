"use client";
import axios from 'axios';

import React, { FormEvent, useState } from 'react';
import db from "../firebase/config";
import { collection, addDoc } from 'firebase/firestore';
import NavBar from '@/components/ui/navbar';
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel } from '@mui/material';

const MyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    station: '',
    date_sub: '',
    date_comp: '',
    emp_name: '',
    gm_id: '',
    job: '',
    department: '',
    group: 0,
    shift_number: 0,
    team: 0,
    recurring: '',
    frequency: '',
    category: '',
    description: '',
    important: '',
    budget: 0,
    status: 'In Progress',
    uid: Date.now().toString(36),
    priority: Math.floor(Math.random() * 10),
    impact: Math.floor(Math.random() * 10),
    effort: Math.floor(Math.random() * 10)
  });
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'pfc'), formData);
      setError('Document written with ID: ' + docRef.id);
      setFormData({
        title: '',
        station: '',
        date_sub: '',
        date_comp: '',
        emp_name: '',
        gm_id: '',
        job: '',
        department: '',
        group: 0,
        shift_number: 0,
        team: 0,
        recurring: '',
        frequency: '',
        category: '',
        description: '',
        important: '',
        budget: 0,
        status: 'In Progress',
        uid: Date.now().toString(36),
        priority: Math.floor(Math.random() * 10),
        impact: Math.floor(Math.random() * 10),
        effort: Math.floor(Math.random() * 10)
      });
    } catch (e) {
      setError("Error is " + e);
    }
  };

  const [state, setState] = useState({
    safety: false,
    quality: false,
    throughput: false,
    pipCost: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { safety, quality, throughput, pipCost } = state;



// const handleFile = (e) => {
//   console.log(e.target.files[0])
// };


// const handleFile = async (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       // Send the file to the Python backend
//       const response = await axios.post('http://localhost:5000/flag_file', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       const { flagged } = response.data;

//       // Do something with the flag status, e.g., display it or store in Firebase
//       console.log(`File flagged status: ${flagged}`);
//       setError(`File flagged status: ${flagged ? "Flagged" : "Not Flagged"}`);
//     } catch (error) {
//       console.error("Error processing file:", error);
//       setError("Error processing file.");
//     }
//   }
// };

const handleFile = async (e) => {
  const file = e.target.files[0]
  if (file) {
    const formData = new FormData();
    formData.append('file', file)

    try {
      // Send the file to the back-end without handling any specific response data
      await axios.post('http://localhost:5000/process_data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

          console.log("File uploaded successfully.");
        } catch (error) {
          console.error("Error uploading file:", error);
        }

  }
} 




















  return (
    <div>
      <NavBar />
      <div className="container mx-auto py-5">
        <h3 className="mb-10 text-2xl font-bold">PFC (Plan For Change) Submission Form</h3>
        <form onSubmit={handleSubmit}>
          {/* First group of input starts */}
          <div>
            <label className="font-medium">
              Title of PFC:
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleInputChangeString}
                style={{ width: '900px' }}
                className="ml-3 font-light border-solid border-2 rounded-lg"
              />
            </label>
          </div>
          <hr className="mt-5"></hr>
          <div className="grid grid-cols-2 mt-5 gap-3">
            <div>
              <label className="font-medium">
                Station Number:
                <input
                  type="text"
                  required
                  name="station"
                  value={formData.station}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Employee Name:
                <input
                  type="text"
                  required
                  name="emp_name"
                  value={formData.emp_name}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Date of PFC Submission:
                <input
                  type="date"
                  required
                  name="date_sub"
                  value={formData.date_sub}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                GMID:
                <input
                  type="text"
                  required
                  name="gm_id"
                  value={formData.gm_id}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Date PFC Completed:
                <input
                  type="date"
                  required
                  name="date_comp"
                  value={formData.date_comp}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Job Position:
                <input
                  type="text"
                  required
                  name="job"
                  value={formData.job}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Group #:
                <input
                  type="number"
                  required
                  min={0}
                  name="group"
                  value={formData.group}
                  onChange={handleInputChangeNumber}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Shift #:
                <input
                  type="number"
                  required
                  min={0}
                  name="shift_number"
                  value={formData.shift_number}
                  onChange={handleInputChangeNumber}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Department:
                <input
                  type="text"
                  required
                  name="department"
                  value={formData.department}
                  onChange={handleInputChangeString}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <div>
              <label className="font-medium">
                Team #:
                <input
                  type="number"
                  required
                  min={0}
                  name="team"
                  value={formData.team}
                  onChange={handleInputChangeNumber}
                  className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
          </div>
          {/* First group of input end */}
          <hr className="mt-5"></hr>
          {/* Select start */}
          <div className="mt-5">
            <label className="font-medium">
              Is this a recurring issue?
              <select
                name="recurring"
                value={formData.recurring}
                onChange={handleInputChangeSelect}
                required
                className="ml-3 font-light border-solid border-2 rounded-lg"
              >
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
          </div>
          <div className="mt-4">
            <label className="font-medium">
              If you answered yes to the prior question, how frequently would you say this issue occur?
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChangeSelect}
                required
                className="ml-3 font-light border-solid border-2 rounded-lg"
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
          <div className="mt-4">
            <label className="font-medium">
              What is this PFC related to? Select all that apply.
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Categories</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox value={formData.category} checked={safety} onChange={handleChange} name="safety" />}
                      label="Safety"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={quality} value={formData.category} onChange={handleChange} name="quality" />}
                      label="Quality"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={throughput} value={formData.category} onChange={handleChange} name="throughput" />}
                      label="Throughput"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={pipCost} value={formData.category} onChange={handleChange} name="pipCost" />}
                      label="PIP/Cost"
                    />
                  </FormGroup>
                </FormControl>
              </div>
            </label>
          </div>
          {/* Select end */}
          <hr className="mt-5"></hr>
          {/* Description starts */}
          <div className="mt-5">
            <label htmlFor="description" className="block font-medium">
              Describe the problem you are submitting a PFC for:
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              cols={50}
              value={formData.description}
              onChange={handleInputChangeDescription}
              required
              className="border-solid border-2 rounded-lg"
            ></textarea>
          </div>
          <div>
            <label htmlFor="important" className="block font-medium">
              Explain in 1-2 sentences why this PFC is important:
            </label>
            <textarea
              id="important"
              name="important"
              rows={2}
              cols={50}
              value={formData.important}
              onChange={handleInputChangeDescription}
              required
              className="border-solid border-2 rounded-lg"
            ></textarea>
          </div>
          {/* Description ends */}


          


          <div>
            <h1>Upload Excel File</h1>
            <input type = "file" onChange = {(e) => handleFile(e)} />
          </div>




          <button type="submit" className="mt-10 bg-blue-950 text-white font-bold py-2 px-4 rounded-full">
            Submit PFC Request
          </button>
          {/* Notification */}
          <div>
            <label>{error}</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyForm;
