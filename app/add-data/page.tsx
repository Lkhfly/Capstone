"use client";

import axios from 'axios';
import {data} from '../firebase/large'

import React, { FormEvent, useState } from 'react';
import {db} from "../firebase/config";
import { collection, addDoc } from 'firebase/firestore';
import NavBar from '@/components/ui/navbar';
import { FormControl, FormGroup, FormControlLabel, Checkbox, FormLabel } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import Image from 'next/image';
import severity_image from "../../components/ui/severity.png"
import severity1_image from "../../components/ui/severity1.png"
import probability_image from "../../components/ui/probability.png"
import probability1_image from "../../components/ui/probability1.png"
import people_image from "../../components/ui/people.png"
import frequency_image from "../../components/ui/frequency.png"
import frequency1_image from "../../components/ui/frequency1.png"
interface FormData {
  title: string;
  station: string;
  date_sub: string;
  date_comp: string;
  emp_name: string;
  gm_id: string;
  job: string;
  department: string;
  group: number;
  shift_number: number;
  team: number;
  category: string[]; // Explicitly define as string[]
  description: string;
  important: string;
  uid: string;
  status: string;
  cost: number;
  headcount: number;
  downtime: number;
  stops: number;
  downtime_expected: number;
  stops_expected: number;
  level1: string;
  level2: string;
  level3: string;
  // level4: string;
  // fault: number;
  count: number;
  frequency: string;
  task_or_equipment: string;
  severity: number;
  frequency_exposure: number;
  occurrence: number;
  people_at_risk: number;
  priority_score: number;
}

const MyForm = () => {

  const [formData, setFormData] = useState<FormData>({
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
    category: [],
    description: '',
    important: '',
    uid: Date.now().toString(36),
    // to be removed
    status: 'In Progress',
    // Cost
    cost : 0,
    headcount : 0,
    // Throughput
    downtime : 0, 
    stops : 0, 
    downtime_expected : 0,
    stops_expected : 0,

    // Quality 
    level1 : "",
    level2 : "",
    level3 : "",
    // level4 : "",
    // fault : 0,
    count : 0,
    // Safety
    frequency: '',
    task_or_equipment: '',
    severity : 0, 
    frequency_exposure : 0, 
    occurrence : 0, 
    people_at_risk : 0,
    // Priority score
    priority_score : 0
  });
  const [error, setError] = useState("");

  const handleInputChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [level1Options, setLevel1Options] = useState<string[]>(Object.keys(data));
  const [level2Options, setLevel2Options] = useState<string[]>([]);
  const [level3Options, setLevel3Options] = useState<string[]>([]);

  const [selectedLevel1, setSelectedLevel1] = useState<string>("");
  const [selectedLevel2, setSelectedLevel2] = useState<string>("");
  const [selectedLevel3, setSelectedLevel3] = useState<string>("");
const handleLevel1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const stuff = e.target.value;
  setSelectedLevel1(stuff);
    setFormData((prevData) => ({
      ...prevData,
      level1: stuff,
    }));
  setLevel2Options(Object.keys(data[stuff] || {}));
  setSelectedLevel2("");
  setLevel3Options([]);
  setSelectedLevel3("");
};

const handleLevel2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const stuff = e.target.value;
  setSelectedLevel2(stuff);
    setFormData((prevData) => ({
      ...prevData,
      level2: stuff,
    }));
  setLevel3Options(data[selectedLevel1][stuff] || []);
  setSelectedLevel3("");
};
const handleLevel3Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const stuff = e.target.value;
  setSelectedLevel3(stuff);
    setFormData((prevData) => ({
      ...prevData,
      level3: stuff,
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
console.log(formData.category)
  };

  const handleInputChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChangeSelectNumber = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let updatedRankingQuality: number | undefined;
    let updatedRankingThroughput: number | undefined;
  if (formData.category.includes('quality') && formData.category.includes('throughput')) {
    updatedRankingQuality = calculateQualityRanking(formData.count);
    updatedRankingThroughput = 0
    console.log("Calculated Quality Ranking:", updatedRankingQuality);
  } 
  else {
    updatedRankingQuality = calculateQualityRanking(formData.count);
    updatedRankingThroughput = calculateThroughputRanking(formData.downtime, formData.stops);
  }
  // Log the rankings to verify
  console.log("Calculated Rankings:", updatedRankingQuality, updatedRankingThroughput);
  // Merge rankings directly into formData before submission
  const updatedFormData = {
    ...formData,
    ranking_quality: updatedRankingQuality,
    ranking_throughput: updatedRankingThroughput,
  };
  // Log the form data to ensure rankings are included
  console.log("Form Data to Submit:", updatedFormData);

    try {
    let priority_score_new = 0
    //Safety
    if (formData.category.includes("safety"))
    {
      priority_score_new = formData.severity * formData.frequency_exposure * formData.occurrence * formData.people_at_risk
    }
    else if (formData.category.includes("pipcost")){
    priority_score_new = formData.cost + formData.headcount
    }
    // else if (formData.category.includes("quality")){
    // priority_score_new = formData.fault      
    // }
    else if (formData.category.includes("throughput")){
    priority_score_new = formData.downtime + formData.stops      
    }
    const updatedFormData1 = {
      ...updatedFormData,
      priority_score: priority_score_new,

    };
      const docRef = await addDoc(collection(db, 'pfc'), updatedFormData1);
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
        category: [],
        description: '',
        important: '',
        uid: Date.now().toString(36),
        // to be removed
        status: 'In Progress',
        // Cost
        cost : 0,
        headcount : 0,
        // Throughput
        downtime : 0, 
        stops : 0, 
        downtime_expected : 0,
        stops_expected : 0, 
        // Quality 
        level1 : "",
        level2 : "",
        level3 : "",
        // level4 : "",
        // fault : 0,
        count : 0,
        // Safety
        frequency: '',
        task_or_equipment: '',
        severity : 0, 
        frequency_exposure : 0, 
        occurrence : 0, 
        people_at_risk : 0,
        // Priority score
        priority_score : 0
      });
      console.log("Form Data Submitted:", updatedFormData1); // Print all form data to the console
      setIsReconciled(false);
    } catch (e) {
      setError("Error is " + e);
    }
  };

  const [state, setState] = useState({
    safety: false,
    quality: false,
    throughput: false,
    pipcost: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setFormData((prevFormData) => {
      let updatedCategories: string[];
      if (checked) {
        // Add the category to the array if checked
        updatedCategories = [...prevFormData.category, name];
      } else {
        // Remove the category from the array if unchecked
        updatedCategories = prevFormData.category.filter((cat) => cat !== name);
      }

      return {
        ...prevFormData,
        category: updatedCategories,
      };
    });
  };

  const [pipCost1, setPipCost1] = useState(false);
  const [safety1, setSafety1] = useState(false);
  const [quality1, setQuality1] = useState(false);
  const [throughput1, setThroughput1] = useState(false);
  const { safety, quality, throughput, pipcost } = state;
  const [isClosed, setIsClosed] = useState(true);

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


const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files; // Get the files from the input
  if (files && files.length > 0) { // Check if files exist and has at least one file
    const file = files[files.length - 1]
    const formData1 = new FormData();
    formData1.append('file', file);

    // Check if 'quality' or 'throughput' is selected and append the respective field to formData
    if (formData.category.includes('quality')) {
      formData1.append('quality', quality1.toString());
    } else if (formData.category.includes('throughput')) {
      formData1.append('throughput', throughput1.toString());
    } else {
      console.warn("Neither quality nor throughput selected.");
      return; // Exit early if neither is selected
    }

    try {
      // Send the file to the back-end without handling any specific response data
      await axios.post('http://localhost:5000/process_data_excel', formData1, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("File uploaded successfully.");
      alert("File uploaded successfully.")
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file")
    }
  } else {
    console.warn("No file selected.");
    alert("No file selected.")
  }
};



const calculateQualityRanking = (count: number) => {
  count = count ?? 0;
  if (count >= 50) return 1;
  if (count >= 30) return 2;
  if (count >= 20) return 3;
  if (count >= 10) return 4;
  if (count >= 1) return 5;
  return 0; 
};

// Logic is broken if downtime > 600 and stops > 80, for example 610 downtime and 100 stops 
const calculateThroughputRanking = (downtime: number, stops: number) => {
  downtime = downtime ?? 0; // Ensure downtime is never null
  stops = stops ?? 0; // Ensure stops is never null
  if (downtime < 264 && stops > 80  && stops < 600) return 4;
  if (downtime < 264 && stops > 600) return 2;
  if (downtime > 264 && stops > 600) return 1;
  if (downtime > 264 && downtime < 600 && stops < 80) return 5;
  if (downtime > 600 && stops < 80) return 3;
  return 0;
};


// state that will keep track if what the user inputted matched with what they uploaded
const [isReconciled, setIsReconciled] = useState(false);


const handleReconcile = async () => {
  setIsReconciled(false);
  const inputData = new FormData();

  // Check if quality1 is selected and append quality-specific data
  if (formData.category.includes('quality')) {
    inputData.append("level1", formData.level1.toString());
    inputData.append("level2", formData.level2.toString());
    inputData.append("level3", formData.level3.toString());
    // inputData.append("level4", formData.level4.toString());
    // inputData.append("fault", formData.fault.toString());
    inputData.append("count", formData.count.toString());
  }

  // Check if throughput1 is selected and append throughput-specific data
  if (formData.category.includes('throughput')) {
    inputData.append("station", formData.station.toString());
    inputData.append("downtime", formData.downtime.toString());
    inputData.append("stops", formData.stops.toString());
  }

  // Validate that required fields are present if quality1 is selected
  if (formData.category.includes('quality')) {
    if (
      !inputData.has("level1") ||
      !inputData.has("level2") ||
      !inputData.has("level3") ||
      // !inputData.has("fault") ||
      !inputData.has("count")
    ) {
      console.log("Required quality fields not selected. Aborting execution.");
      alert("All quality fields are required.");
      return;
    }
  }

  // Validate that required fields are present if throughput1 is selected
  if (formData.category.includes('throughput')) {
    if (
      !inputData.has("station") ||
      !inputData.has("downtime") ||
      !inputData.has("stops")
    ) {
      console.log("Required throughput fields not selected. Aborting execution.");
      alert("Station, Downtime, or Stops not selected");
      return;
    }
  }

  try {
    // Fetch data from the server if inputData has values
    const response = await fetch("http://localhost:5000/process_data_excel", {
      method: "GET", // Fetching data from the server
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json(); // The data returned from the server
    console.log('Success in fetching data:', responseData); // Log the data or use it as needed

    // Manually extract data from FormData without using `entries()`
    const inputDataObject: { [key: string]: string } = {};
    
    // Using `FormData`'s `.forEach()` method indirectly (works with target ES5)
    inputData.forEach((value, key) => {
      inputDataObject[key.toLowerCase()] = value instanceof File ? value.name : value.toString();
    });

    // Print inputDataObject for inspection
    console.log("inputDataObject:", inputDataObject);

    // Check if there is a matching row for quality fields
    if (formData.category.includes('quality')) {
      let qualityMatchFound = false;

      // Iterate through each row in responseData to check for a match
      for (let row of responseData) {
        let rowMatches = true;

        // Compare all quality-related fields
        const qualityKeys = ["level1", "level2", "level3", "count"];
        for (let key of qualityKeys) {
          const inputVal = inputDataObject[key]?.toString().toLowerCase();
          const rowVal = row[key.toLowerCase()]?.toString().toLowerCase(); // Ensure key is in lowercase for comparison

          if (inputVal !== rowVal) {
            rowMatches = false;
            break; // No need to check further if any field doesn't match
          }
        }

        if (rowMatches) {
          qualityMatchFound = true;
          console.log("Quality match found for row:", row);
          break; // Stop once a match is found
        }
      }

      if (qualityMatchFound) {
        console.log("All quality values match a row in the backend data.");
        alert("The values inputted align with the data in the uploaded Excel file.");
        setIsReconciled(true)
      } else {
        console.log("No matching quality row found in the backend data.");
        alert("The values inputted, do not align with the data in the uploaded Excel file. Please re-enter the values.");
        setIsReconciled(false)
      }
    }

    // Compare throughput related fields
    if (formData.category.includes('throughput')) {
      const responseDataObject: { [key: string]: string | number } = {};
          for (let key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              const lowerKey = key.toLowerCase();
              responseDataObject[lowerKey] = Array.isArray(responseData[key]) ? responseData[key][0] : responseData[key];
            }
          }
      
          console.log("responseDataObject:", responseDataObject);
      
          // Compare key-value pairs
          let match = true;
          for (let key in inputDataObject) {
            // Convert both values to strings to ensure consistent comparison
            const inputVal = inputDataObject[key].toString();
            const responseVal = responseDataObject[key].toString();
            
            if (inputVal !== responseVal) {
              match = false;
              console.log(`Mismatch for key "${key}": ${inputVal} !== ${responseVal}`);
              alert(`Mismatch for key "${key}": ${inputVal} !== ${responseVal}, values do not match`)
            }
          }
      
          if (match) {
            console.log("All values match.");
            setIsReconciled(true)
          } else {
            console.log("Values do not match.");
            setIsReconciled(false)
          }
      
      }

  } catch (error) {
    console.error('Error during fetch:', error); // Handle any errors
  }
};
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };


  const [isOpen1, setIsOpen1] = useState(false);

  const handleOpen1 = () => {
    setIsOpen1(true);
  };

  const handleClose1 = () => {
    setIsOpen1(false);
  };

  const [isOpen2, setIsOpen2] = useState(false);

  const handleOpen2 = () => {
    setIsOpen2(true);
  };

  const handleClose2 = () => {
    setIsOpen2(false);
  };
  const [isOpen3, setIsOpen3] = useState(false);

  const handleOpen3 = () => {
    setIsOpen3(true);
  };

  const handleClose3 = () => {
    setIsOpen3(false);
  };

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
                  max={3}
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
          {/* <div className="mt-5">
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
          </div> */}
          <div className="mt-4">
            <label className="font-medium">
              What is this PFC related to? Select all that apply.
              <div>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Select Categories</FormLabel>
                  <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.category.includes('safety')}
                    onChange={handleChange}
                    name="safety"
                  />
                }
                label="Safety"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.category.includes('quality')}
                    onChange={handleChange}
                    name="quality"
                  />
                }
                label="Quality"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.category.includes('throughput')}
                    onChange={handleChange}
                    name="throughput"
                  />
                }
                label="Throughput"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.category.includes('pipcost')}
                    onChange={handleChange}
                    name="pipcost"
                  />
                }
                label="Cost"
              />
                    <FormControlLabel
                        control={<Checkbox name="NA" />}
                        label="N/A"
                    />
                  </FormGroup>
                </FormControl>
                </div>
              </label>
            </div>
            {/* Select end */}

          {/* NewPart starts */}
          <div>

            {/* Cost Page */}
            {formData.category.includes('pipcost') && (<div className = "Cost Page">
              <hr className="mt-5 mb-5"></hr>
              <h1 className="font-medium mt-2 mb-2">Enter an estimated cost reduction</h1>
              <div>
                <label className="font-medium">
                  Cost:
                  <input
                      type="number"
                      min = {0}
                      required
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <h1 className="font-medium mt-5 mb-2">Enter an estimated headcount reduction</h1>
              <div>
                <label className="font-medium">
                  Cost:
                  <input
                      type="number"
                      required
                      min = {0}
                      name="headcount"
                      value={formData.headcount}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>
              <hr className="mt-5 mb-5"></hr>
            </div>)}

            {/* Throughput */}
            {formData.category.includes('throughput') && (<div>
              <h1 className="font-medium mt-2 mb-2">Enter the amount of downtime in seconds from the Excel file</h1>
              <div>
                <label className="font-medium">
                  Number:
                  <input
                      type="number"
                      min = {0}
                      required
                      name="downtime"
                      value={formData.downtime}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <h1 className="font-medium mt-5 mb-2">Enter the number of stops from the Excel file</h1>
              <div>
                <label className="font-medium">
                  Number:
                  <input
                      type="number"
                      required
                      min = {0}
                      name="stops"
                      value={formData.stops}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <h1 className="font-medium mt-5 mb-2">Enter the estimated amount of downtime in seconds expected to be reduced as a result of this PFC</h1>
              <div>
                <label className="font-medium">
                  Number:
                  <input
                      type="number"
                      required
                      min = {0}
                      name="downtime_expected"
                      value={formData.downtime_expected}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <h1 className="font-medium mt-5 mb-2">Enter the estimated number of stops expected to be reduced as a result of this PFC</h1>
              <div>
                <label className="font-medium">
                  Number:
                  <input
                      type="number"
                      required
                      min = {0}
                      name="stops_expected"
                      value={formData.stops_expected}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <hr className="mt-5 mb-5"></hr>
            </div>)}

            {/* Quality */}
            {formData.category.includes('quality') && (<div>
              <div>
              {/* <h1 className="font-medium mt-5 mb-2">According to the defect entry, refer to the excel file for the following entries</h1> */}

              {/* <div className = "mb-2">
                <label className="font-medium">
                  Level 1:
                  <input
                      type="number"
                      required
                      name="level1"
                      value={formData.level1}
                      onChange={handleInputChangeNumber}
                      className="ml-4 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <div className = "mb-2">
                <label className="font-medium">
                  Level 2:
                  <input
                      type="number"
                      required
                      name="level2"
                      value={formData.level2}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <div className = "mb-2">
                <label className="font-medium">
                  Level 3:
                  <input
                      type="number"
                      required
                      name="level3"
                      value={formData.level3}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <div className = "mb-2">
                <label className="font-medium">
                  Level 4:
                  <input
                      type="number"
                      required
                      name="level4"
                      value={formData.level4}
                      onChange={handleInputChangeNumber}
                      className="ml-3 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div>

              <div>
                <label className="font-medium">
                  Fault:
                  <input
                      type="number"
                      required
                      name="fault"
                      value={formData.fault}
                      onChange={handleInputChangeNumber}
                      className="ml-7 font-light border-solid border-2 rounded-lg"
                  />
                </label>
              </div> */}
              </div>

              <div>
                <h1 className="font-medium mt-5 mb-2">
                  According to the defect entry, refer to the excel file for the following entries
                </h1>

                {/* Align fields with flexbox */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <label className="font-medium w-24">Level 1:</label>
                      <select
                        required
                        name="level1"
                        value={selectedLevel1}
                        onChange={handleLevel1Change}
                        className="w-38 font-light border-solid border-2 rounded-lg"
                      >
                        <option value="">Select Level 1</option>
                        {level1Options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="flex items-center">
                    <label className="font-medium w-24">Level 2:</label>
                      <select
                        required
                        name="level2"
                        value={selectedLevel2}
                        onChange={handleLevel2Change}
                        className="w-38 font-light border-solid border-2 rounded-lg"
                      >
                        <option value="">Select Level 2</option>
                        {level2Options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="flex items-center">
                    <label className="font-medium w-24">Level 3:</label>
                    <select
                      required
                      name="level3"
                      value={selectedLevel3}
                      onChange={handleLevel3Change}
                      className="w-38 font-light border-solid border-2 rounded-lg"
                    >
                      <option value="">Select Level 3</option>
                      {level3Options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="flex items-center">
                    <label className="font-medium w-24">Fault:</label>
                    <input
                        type="text"
                        required
                        name="fault"
                        value={formData.fault}
                        onChange={handleInputChangeString}
                        className="w-38 font-light border-solid border-2 rounded-lg"
                    />
                  </div> */}
                  <div className="flex items-center">
                    <label className="font-medium w-24">Count:</label>
                    <input
                        type="number"
                        required
                        name="count"
                        value={formData.count}
                        onChange={handleInputChangeNumber}
                        className="w-38 font-light border-solid border-2 rounded-lg"

                    />
                  </div>
                </div>

                <hr className="mt-5 mb-5"/>
              </div>
            </div>)}


            {formData.category.includes('safety') && (<div>
              <div className="flex flex-col gap-5 mt-4">
                <div className="flex items-center">
                  <label className="font-medium w-60">
                    How frequently would you say this issue occurs?
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChangeSelect}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                    <option value="">Select an option</option>
                    <option value="Once a month">Once a month</option>
                    <option value="Once a week">Once a week</option>
                    <option value="Several times a week">Several times a week</option>
                    <option value="Once a shift">Once a shift</option>
                    <option value="Several times a shift">Several times a shift</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>

                </div>
                {/* Popup Modal */}

                <div className="flex items-center">
                  <label className="font-medium w-60">
                    Is it task-based or equipment design-based?
                  </label>
                  <select
                    name="task_or_equipment"
                    value={formData.task_or_equipment}
                    onChange={handleInputChangeSelect}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                    <option value="">Select an option</option>
                    <option value="Task Based">Task Based</option>
                    <option value="Equipment Design">Equipment Design</option>
                    <option value="Chemical Agent Exposure">Chemical Agent Exposure</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="font-medium w-60">Rate the severity potential</label>
                  <select
                    name="severity"
                    value={formData.severity}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                    <option value="">Select an option</option>
                    <option value={15}>15</option>
                    <option value={10}>10</option>
                    <option value={6}>6</option>
                    <option value={4}>4</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                  <InfoIcon className="text-gray-500 cursor-pointer ml-2" onClick={handleOpen}/>
                </div>

                <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
                  <DialogTitle>Severity Potential Reference Guide</DialogTitle>
                  <DialogContent>
                  {(formData.task_or_equipment == "Task Based" || formData.task_or_equipment =="Equipment Design") && (
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={severity1_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                    </div>
                  )}
                  {(formData.task_or_equipment == "Chemical Agent Exposure" ) && (
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={severity_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                    </div>
                  )}

                  </DialogContent>
                </Dialog>

                <div className="flex items-center">
                  <label className="font-medium w-60">Rate the frequency of exposure</label>
                  {(formData.task_or_equipment == "") && (
                   <select
                    name="frequency_exposure"
                    value={formData.frequency_exposure}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                      <option value="">Select an option</option>
                    </select>
                    )}
                  {(formData.task_or_equipment == "Task Based") && (
                   <select
                    name="frequency_exposure"
                    value={formData.frequency_exposure}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                      <option value="">Select an option</option>
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={2.5}>2.5</option>           
                  </select>
                  )}
                  {(formData.task_or_equipment == "Equipment Design" || (formData.task_or_equipment == "Chemical Agent Exposure")) && (
                   <select
                    name="frequency_exposure"
                    value={formData.frequency_exposure}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                      <option value="">Select an option</option>
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={2.5}>2.5</option>           
                      <option value={1.5}>1.5</option>
                      <option value={1}>1</option>
                      <option value={0.5}>0.5</option>           
                      <option value={0.1}>0.1</option>           
                  </select>
                  )}

                  <InfoIcon className="text-gray-500 cursor-pointer ml-2" onClick={handleOpen1}/>
                </div>
                <Dialog open={isOpen1} onClose={handleClose1} maxWidth="md" fullWidth>
                  <DialogTitle>Frequency of Exposure Reference Guide</DialogTitle>
                  <DialogContent>
                    <div className="relative w-full h-[600px]">
                  {(formData.task_or_equipment == "Task Based") && (
                      <Image
                        src={frequency_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />                    
                  )}
                  {(formData.task_or_equipment == "Chemical Agent Exposure"  || formData.task_or_equipment =="Equipment Design") && (
                      <Image
                        src={frequency1_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                  )}   
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center">
                  <label className="font-medium w-60">Rate the probability of occurrence</label>
                  <select
                    name="occurrence"
                    value={formData.occurrence}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                    <option value="">Select an option</option>
                      <option value={15}>15</option>
                      <option value={8}>8</option>
                      <option value={2}>2</option>
                      <option value={0.03}>0.03</option>
                  </select>
                  <InfoIcon className="text-gray-500 cursor-pointer ml-2" onClick={handleOpen2}/>
                </div>
                <Dialog open={isOpen2} onClose={handleClose2} maxWidth="md" fullWidth>
                  <DialogTitle>Probability Occurrence Reference Guide</DialogTitle>               
                  <DialogContent>
                    <div className="relative w-full h-[600px]">
                  {(formData.task_or_equipment == "Task Based" || formData.task_or_equipment =="Equipment Design") && (
                      <Image
                        src={probability_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />                    
                  )}
                  {(formData.task_or_equipment == "Chemical Agent Exposure" ) && (
                      <Image
                        src={probability1_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                  )}   
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center">
                  <label className="font-medium w-60">How many people are at risk?</label>
                  <select
                    name="people_at_risk"
                    value={formData.people_at_risk}
                    onChange={handleInputChangeSelectNumber}
                    required
                    className="w-36 font-light border-solid border-2 rounded-lg"
                  >
                    <option value="">Select an option</option>
                    <option value={12}>12</option>
                    <option value={8}>8</option>
                    <option value={4}>4</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                  <InfoIcon className="text-gray-500 cursor-pointer ml-2" onClick={handleOpen3}/>
                </div>
            </div>
                <Dialog open={isOpen3} onClose={handleClose3} maxWidth="md" fullWidth>
                  <DialogTitle>Frequency of Exposure Reference Guide</DialogTitle>
                  <DialogContent>
                    <div className="relative w-full h-[600px]">
                      <Image
                        src={people_image} // Replace with your actual image path
                        alt="Detailed Information"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>

          
          <hr className="mt-5 mb-5"></hr>
            </div>)}
          </div>
          {/* NewPart ends */}

            {/* Description starts */}
            <div className="mt-5">
              <label htmlFor="description" className="block font-medium">
                Describe the problem:
              </label>
              <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChangeDescription}
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
                  onChange={handleInputChangeDescription}
                  required
                  className="border-solid border-2 rounded-lg"
              ></textarea>
            </div>
            {/* Description ends */}

           
            
          <div>
            {(formData.category.includes('quality') || formData.category.includes('throughput')) ? (
              <>
            <h1>Upload Excel File</h1>
            <input type="file" onChange={(e) => handleFile(e)} />
              </>) : null}
          </div>
           
          <div>
            {(formData.category.includes('quality') || formData.category.includes('throughput')) ? (
              <>
            <button type = "button" className="mt-8 bg-blue-950 text-white font-bold py-2 px-4 rounded-full" onClick = {handleReconcile}>
              Reconcile
            </button>
              </>) : null}
          </div>
          
            
          <button
            type="submit"
            className={`mt-10 font-bold py-2 px-4 rounded-full ${ 
            (formData.category.includes("quality") || formData.category.includes("throughput")) && !isReconciled 
            ? "bg-gray-400 cursor-not-allowed" 
            :"bg-blue-950 text-white"
            }`}
            disabled={(formData.category.includes("quality") || formData.category.includes("throughput")) && !isReconciled}
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