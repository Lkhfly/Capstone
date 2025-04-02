"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, BarChart, PieChart, Pie, Bar,
  Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Cell 
} from "recharts";
import { Filter, ChevronDown } from "lucide-react";

// Sample data
const revenueData = [
  { date: "Jan 2023", revenue: 5000, location: "New York", category: "Electronics" },
  { date: "Apr 2023", revenue: 12000, location: "California", category: "Furniture" },
  { date: "Jul 2023", revenue: 25000, location: "Texas", category: "Clothing" },
  { date: "Oct 2023", revenue: 30000, location: "Florida", category: "Electronics" },
  { date: "Jan 2024", revenue: 45000, location: "New York", category: "Food" },
  { date: "Apr 2024", revenue: 48000, location: "California", category: "Electronics" },
  { date: "Jul 2024", revenue: 46000, location: "Texas", category: "Furniture" },
  { date: "Oct 2024", revenue: 47000, location: "Florida", category: "Clothing" },
  { date: "Jan 2025", revenue: 49000, location: "New York", category: "Food" },
  { date: "Apr 2025", revenue: 45000, location: "California", category: "Electronics" },
];

const locationData = [
  { name: "New York", value: 144000 },
  { name: "California", value: 153000 },
  { name: "Texas", value: 71000 },
  { name: "Florida", value: 77000 },
];

const categoryData = [
  { name: "Electronics", value: 148000 },
  { name: "Furniture", value: 37000 },
  { name: "Clothing", value: 52000 },
  { name: "Food", value: 94000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  // Filter states (keep all your existing states)
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [timeGroupingOpen, setTimeGroupingOpen] = useState(false);
  const [numberFilterOpen, setNumberFilterOpen] = useState(false);
  const [textFilterOpen, setTextFilterOpen] = useState(false);
  const [locationFilterOpen, setLocationFilterOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  
  const [selectedTimeGroup, setSelectedTimeGroup] = useState("Month");
  const [selectedNumberFilter, setSelectedNumberFilter] = useState("Equal to");
  const [selectedTextFilter, setSelectedTextFilter] = useState("Is");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("City");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Month and Year");

  const [numberValue, setNumberValue] = useState("");
  const [numberValue2, setNumberValue2] = useState("");
  const [textValue, setTextValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Filter options (keep all your existing options)
  const timeGroupOptions = ["Minute", "Hour", "Day", "Week", "Month", "Quarter", "Year", "More..."];
  const numberFilterOptions = ["Equal to", "Not equal to", "Between", "Greater than or equal to", "Less than or equal to"];
  const textFilterOptions = ["Is", "Is not", "Contains", "Does not contain", "Starts with", "Ends with"];
  const locationFilterOptions = ["City", "State", "ZIP or Postal Code", "Country"];
  const dateFilterOptions = ["Month and Year", "Quarter and Year", "Single Date", "Date Range", "Relative Date", "All Options"];
  const sampleItems = ["Electronics", "Furniture", "Clothing", "Food"];

  // Filter functions (keep all your existing filter logic)
  const handleNumberFilterSelect = (option: string) => {
    setSelectedNumberFilter(option);
    setNumberValue("");
    setNumberValue2("");
    if (option !== "Between") {
      setNumberFilterOpen(false);
    }
  };

  const handleTextFilterSelect = (option: string) => {
    setSelectedTextFilter(option);
    setTextValue("");
    setSelectedItems([]);
    if (!["Is", "Is not"].includes(option)) {
      setTextFilterOpen(false);
    }
  };

  const toggleItemSelection = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item) 
        : [...prev, item]
    );
  };

  // Filter the data based on current selections
  const filteredRevenueData = revenueData.filter(item => {
    // Apply number filter
    if (numberValue) {
      const numValue = Number(numberValue);
      const itemValue = item.revenue;
      
      switch(selectedNumberFilter) {
        case "Equal to": if (itemValue !== numValue) return false; break;
        case "Not equal to": if (itemValue === numValue) return false; break;
        case "Greater than or equal to": if (itemValue < numValue) return false; break;
        case "Less than or equal to": if (itemValue > numValue) return false; break;
        case "Between": 
          const numValue2 = Number(numberValue2);
          if (itemValue < numValue || itemValue > numValue2) return false; 
          break;
      }
    }
    
    // Apply text/category filter
    if (selectedTextFilter === "Is" && selectedItems.length > 0 && !selectedItems.includes(item.category)) {
      return false;
    }
    if (selectedTextFilter === "Is not" && selectedItems.length > 0 && selectedItems.includes(item.category)) {
      return false;
    }
    if (textValue) {
      switch(selectedTextFilter) {
        case "Contains": if (!item.category.includes(textValue)) return false; break;
        case "Does not contain": if (item.category.includes(textValue)) return false; break;
        case "Starts with": if (!item.category.startsWith(textValue)) return false; break;
        case "Ends with": if (!item.category.endsWith(textValue)) return false; break;
      }
    }
    
    return true;
  });

  const filteredLocationData = locationData.filter(loc => {
    if (selectedItems.length > 0 && selectedTextFilter === "Is") {
      return filteredRevenueData.some(item => item.location === loc.name);
    }
    return true;
  });

  const filteredCategoryData = categoryData.filter(cat => {
    if (selectedItems.length > 0 && selectedTextFilter === "Is") {
      return selectedItems.includes(cat.name);
    }
    return true;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-blue-200 p-3 rounded-md text-sm text-gray-700">
        Active filters: 
        {numberValue && ` Revenue ${selectedNumberFilter} ${numberValue}`}
        {numberValue2 && `-${numberValue2}`}
        {selectedItems.length > 0 && ` Category ${selectedTextFilter} ${selectedItems.join(", ")}`}
      </div>
      
      {/* Keep all your original filter controls exactly as they were */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <div className="flex gap-2 flex-wrap">
          {/* Time Grouping Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setTimeGroupingOpen(!timeGroupingOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Time grouping</span>
                <span>{selectedTimeGroup}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {timeGroupingOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                <div className="py-1">
                  {timeGroupOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 text-sm ${selectedTimeGroup === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedTimeGroup(option);
                        setTimeGroupingOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Number Filter with Input */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setNumberFilterOpen(!numberFilterOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Number filter</span>
                <span>{selectedNumberFilter}{numberValue ? `: ${numberValue}` : ""}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {numberFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 p-2">
                <p className="px-2 py-1 text-xs text-gray-500">You can choose from:</p>
                {numberFilterOptions.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-sm ${selectedNumberFilter === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => handleNumberFilterSelect(option)}
                  >
                    {option}
                  </button>
                ))}
                
                {selectedNumberFilter === "Between" ? (
                  <div className="p-2 space-y-2">
                    <input
                      type="number"
                      value={numberValue}
                      onChange={(e) => setNumberValue(e.target.value)}
                      placeholder="Min value"
                      className="mt-2 p-2 border rounded-md text-sm w-full"
                    />
                    <input
                      type="number"
                      value={numberValue2}
                      onChange={(e) => setNumberValue2(e.target.value)}
                      placeholder="Max value"
                      className="mt-2 p-2 border rounded-md text-sm w-full"
                    />
                    <button
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-sm mt-2"
                      onClick={() => {
                        if (numberValue && numberValue2) {
                          setNumberFilterOpen(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ) : selectedNumberFilter && selectedNumberFilter !== "Between" && (
                  <div className="p-2">
                    <input
                      type="number"
                      value={numberValue}
                      onChange={(e) => setNumberValue(e.target.value)}
                      placeholder={`Enter value to compare`}
                      className="mt-2 p-2 border rounded-md text-sm w-full"
                    />
                    <button
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-sm mt-2"
                      onClick={() => {
                        if (numberValue) {
                          setNumberFilterOpen(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Text/Category Filter with Input */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setTextFilterOpen(!textFilterOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Text or category</span>
                <span className="truncate max-w-[120px]">
                  {selectedTextFilter}
                  {selectedItems.length > 0 && ` (${selectedItems.length})`}
                  {textValue && !["Is", "Is not"].includes(selectedTextFilter) && `: ${textValue}`}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {textFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30 p-2">
                <p className="px-2 py-1 text-xs text-gray-500">Text filter options:</p>
                {textFilterOptions.map((option) => (
                  <button
                    key={option}
                    className={`block w-full text-left px-4 py-2 text-sm ${selectedTextFilter === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => handleTextFilterSelect(option)}
                  >
                    {option}
                  </button>
                ))}
                
                {["Is", "Is not"].includes(selectedTextFilter) ? (
                  <div className="p-2 max-h-60 overflow-y-auto">
                    <div className="space-y-1">
                      {sampleItems.map((item) => (
                        <div key={item} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`item-${item}`}
                            checked={selectedItems.includes(item)}
                            onChange={() => toggleItemSelection(item)}
                            className="mr-2"
                          />
                          <label htmlFor={`item-${item}`} className="text-sm">
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                    <button
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-sm mt-2"
                      onClick={() => {
                        if (selectedItems.length > 0) {
                          setTextFilterOpen(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                ) : selectedTextFilter && !["Is", "Is not"].includes(selectedTextFilter) && (
                  <div className="p-2">
                    <input
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder={`Enter text to ${selectedTextFilter.toLowerCase()}`}
                      className="mt-2 p-2 border rounded-md text-sm w-full"
                    />
                    <button
                      className="w-full bg-blue-500 text-white py-1 px-3 rounded text-sm mt-2"
                      onClick={() => {
                        if (textValue) {
                          setTextFilterOpen(false);
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setLocationFilterOpen(!locationFilterOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Location filter</span>
                <span>{selectedLocationFilter}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {locationFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                <div className="py-1">
                  <p className="px-4 py-2 text-xs text-gray-500">Location filters:</p>
                  {locationFilterOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 text-sm ${selectedLocationFilter === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedLocationFilter(option);
                        setLocationFilterOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Picker Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex justify-between items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              onClick={() => setDateFilterOpen(!dateFilterOpen)}
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Date picker</span>
                <span>{selectedDateFilter}</span>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            {dateFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                <div className="py-1">
                  <p className="px-4 py-2 text-xs text-gray-500">Date picker options:</p>
                  {dateFilterOptions.map((option) => (
                    <button
                      key={option}
                      className={`block w-full text-left px-4 py-2 text-sm ${selectedDateFilter === option ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedDateFilter(option);
                        setDateFilterOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Filter Button */}
          <div className="relative">
            <Button 
              onClick={() => setShowMainFilter(!showMainFilter)} 
              variant="outline"
            >
              <Filter className="mr-2 h-5 w-5" /> Add a filter or parameter
            </Button>
            {showMainFilter && (
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md p-4 w-64 z-10">
                <p className="font-semibold mb-2">Add a filter or parameter</p>
                <ul className="space-y-2">
                  <li className="flex items-center"><span className="mr-2">📅</span> Date Picker</li>
                  <li className="flex items-center"><span className="mr-2">⏳</span> Time Grouping</li>
                  <li className="flex items-center"><span className="mr-2">📍</span> Location</li>
                  <li className="flex items-center"><span className="mr-2">🔤</span> Text or Category</li>
                  <li className="flex items-center"><span className="mr-2">🔢</span> Number</li>
                  <li className="flex items-center"><span className="mr-2">🆔</span> ID</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add the new charts while keeping all your original filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Original Revenue Line Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Location Bar Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue by Location</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredLocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Category Pie Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Combo Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Sales Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Trend" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}