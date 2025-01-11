"use client";

import React, { FormEvent, useState } from 'react';
import {db} from "../firebase/config";
import { collection, addDoc } from 'firebase/firestore';
import NavBar from '@/components/ui/navbar';
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel } from '@mui/material';

const MyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    station: "",
    date_sub: "",
    date_comp: "",
    emp_name: "",
    gm_id: "",
    job: "",
    department: "",
    group: 0,
    shift_number: 0,
    team: 0,
    recurring: "",
    frequency: "",
    category: [],
    description: "",
    important: "",
    status: "In Progress",
    uid: Date.now().toString(36),
    priority: Math.floor(Math.random() * 10),
    impact: Math.floor(Math.random() * 10),
    effort: Math.floor(Math.random() * 10),
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  // const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = e.target;
  //   setFormData((prevData) => {
  //     let newCategories = [...prevData.category];
  //     if (checked) {
  //       newCategories.push(name);
  //     } else {
  //       newCategories = newCategories.filter((item) => item !== name);
  //     }
  //     return {
  //       ...prevData,
  //       category: newCategories,
  //     };
  //   });
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'pfc'), formData);
      setError('Document written with ID: ' + docRef.id);
      setFormData({
        title: "",
        station: "",
        date_sub: "",
        date_comp: "",
        emp_name: "",
        gm_id: "",
        job: "",
        department: "",
        group: 0,
        shift_number: 0,
        team: 0,
        recurring: "",
        frequency: "",
        category: [],
        description: "",
        important: "",
        status: "In Progress",
        uid: Date.now().toString(36),
        priority: Math.floor(Math.random() * 10),
        impact: Math.floor(Math.random() * 10),
        effort: Math.floor(Math.random() * 10),
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

  return (
      <div>
        <NavBar />
        <div className="container mx-auto py-5">
          <h3 className="mb-10 text-2xl font-bold">
            PFC (Plan For Change) Submission Form
          </h3>
          <form onSubmit={handleSubmit}>
            {/* First Group: Input Fields */}
            <div>
              <label className="font-medium">
                Title of PFC:
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: "900px" }}
                    className="ml-3 font-light border-solid border-2 rounded-lg"
                />
              </label>
            </div>
            <hr className="mt-5" />

            {/* Grid for other input fields */}
            <div className="grid grid-cols-2 mt-5 gap-3">
              {/* Repeating for each input */}
              {[
                { label: "Station Number", name: "station", type: "text" },
                { label: "Employee Name", name: "emp_name", type: "text" },
                { label: "Date of PFC Submission", name: "date_sub", type: "date" },
                { label: "GMID", name: "gm_id", type: "text" },
                { label: "Date PFC Completed", name: "date_comp", type: "date" },
                { label: "Job Position", name: "job", type: "text" },
                { label: "Group #", name: "group", type: "number" },
                { label: "Shift #", name: "shift_number", type: "number" },
                { label: "Department", name: "department", type: "text" },
                { label: "Team #", name: "team", type: "number" },
              ].map((input) => (
                  <div key={input.name}>
                    <label className="font-medium">
                      {input.label}:
                      <input
                          type={input.type}
                          name={input.name}
                          value={(formData as any)[input.name]}
                          onChange={handleInputChange}
                          required
                          className="ml-3 font-light border-solid border-2 rounded-lg"
                      />
                    </label>
                  </div>
              ))}
            </div>

            <hr className="mt-5" />

            {/* Recurring Issue and Frequency */}
            <div className="mt-5">
              <label className="font-medium">
                Is this a recurring issue?
                <select
                    name="recurring"
                    value={formData.recurring}
                    onChange={handleInputChange}
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
                Frequency:
                <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                    className="ml-3 font-light border-solid border-2 rounded-lg"
                >
                  <option value="">Select an option</option>
                  <option value="Once a month">Once a month</option>
                  <option value="Once a week">Once a week</option>
                  <option value="Several times a week">Several times a week</option>
                  <option value="Once a shift">Once a shift</option>
                  <option value="Several times a shift">Several times a shift</option>
                </select>
              </label>
            </div>

            {/* Category (Multi-select with Checkboxes) */}
            <div className="mt-4">
              <FormControl component="fieldset">
                <FormLabel component="legend">What is this PFC related to?</FormLabel>
                <FormGroup>
                  {["Safety", "Quality", "Throughput", "PIP/Cost"].map((cat) => (
                      <FormControlLabel
                          control={
                            <Checkbox
                                name={cat.toLowerCase()}
                                checked={formData.category.includes(cat)}
                                onChange={handleInputChangeSelect}
                            />
                          }
                          label={cat}
                          key={cat}
                      />
                  ))}
                </FormGroup>
              </FormControl>
            </div>

            <hr className="mt-5" />

            {/* Problem Description */}
            <div className="mt-5">
              <label htmlFor="description" className="block font-medium">
                Describe the problem:
              </label>
              <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="border-solid border-2 rounded-lg"
              ></textarea>
            </div>

            {/* Why it's important */}
            <div>
              <label htmlFor="important" className="block font-medium">
                Explain in 1-2 sentences why this PFC is important:
              </label>
              <textarea
                  id="important"
                  name="important"
                  rows={2}
                  value={formData.important}
                  onChange={handleInputChange}
                  required
                  className="border-solid border-2 rounded-lg"
              ></textarea>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="mt-10 bg-blue-950 text-white font-bold py-2 px-4 rounded-full"
            >
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
