"use client";

import React, { useState, MouseEvent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the structure of data used in the chart
interface ChartData {
  name: string;
  count: number;
}

// Define the structure for the popup position
interface PopupPosition {
  x: number;
  y: number;
}

// Chart Data
const data: ChartData[] = [
  { name: "Jan 2017", count: 4000 },
  { name: "Jan 2018", count: 3000 },
  { name: "Jan 2019", count: 2000 },
  { name: "Jan 2020", count: 5000 },
];

const ChartWithHierarchicalPopup: React.FC = () => {
  const [selectedData, setSelectedData] = useState<ChartData | null>(null);
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({ x: 0, y: 0 });
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Handle click on a bar
  const handleBarClick = (data: ChartData, index: number, event: MouseEvent<SVGRectElement>) => {
    setSelectedData(data);
    setPopupPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => setShowPopup(false);

  // Handle menu actions
  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action} for ${selectedData?.name}`);
    closePopup();
  };

  return (
    <div style={{ position: "relative", width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" onClick={handleBarClick} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>

      {showPopup && selectedData && (
        <div
          style={{
            position: "fixed",
            left: popupPosition.x,
            top: popupPosition.y,
            backgroundColor: "white",
            padding: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "220px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ×
          </button>
          <h3 style={{ marginBottom: "12px" }}>Options for {selectedData.name}</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ marginBottom: "8px" }}>
              <button style={menuButtonStyle}>Zoom in</button>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <button style={menuButtonStyle}>View records</button>
            </li>

            {/* Break out by section */}
            <li style={{ margin: "12px 0 4px 0", color: "#666" }}>Break out by</li>
            <li style={{ paddingLeft: "16px" }}>
              <button style={subMenuButtonStyle} onClick={() => handleMenuAction("category")}>
                Category
              </button>
            </li>
            <li style={{ paddingLeft: "16px", marginBottom: "8px" }}>
              <button style={subMenuButtonStyle} onClick={() => handleMenuAction("location")}>
                Location
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Define button styles separately to avoid inline TSX styling issues
const menuButtonStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "8px",
  margin: "4px 0",
  border: "none",
  background: "none",
  cursor: "pointer",
  borderRadius: "4px",
  transition: "background-color 0.2s",
};

const subMenuButtonStyle: React.CSSProperties = {
  ...menuButtonStyle,
  paddingLeft: "16px",
  position: "relative",
};

export default ChartWithHierarchicalPopup;
