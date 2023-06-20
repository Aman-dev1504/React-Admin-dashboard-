import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import './Graph.css'
const Graph = ({ ratings }) => {
  const chartRef = useRef(null);
  const [selectedSliceData, setSelectedSliceData] = useState(null);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  useEffect(() => {
    if (!ratings || ratings.length === 0) {
      return;
    }
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    const instructorRatings = {};
    ratings.forEach((rating) => {
      ratingCounts[rating.rating]++;
      if (!instructorRatings[rating.rating]) {
        instructorRatings[rating.rating] = [];
      }
      instructorRatings[rating.rating].push({
        instructor: rating.instructorName,
        rating: rating.rating,
      });
    });
    const counts = Object.values(ratingCounts);
    const colors = ["#FFBB28", "#96e072", "#c2c2c2", "#f4e285", "#16A085"];
    const data = {
      labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
      datasets: [
        {
          data: counts,
          backgroundColor: colors,
        },
      ],
    };
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    Chart.register(...registerables);
    chartInstance.current = new Chart(chartRef.current, {
      type: "pie",
      data: data,
      options: {
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const rating = index + 1; // Adjust index to retrieve correct rating value
            const instructors = instructorRatings[rating];
            setSelectedSliceData(instructors);
            setSelectedSliceIndex(index);
          } else {
            setSelectedSliceData(null);
            setSelectedSliceIndex(null);
          }
        },
      },
    });
  }, [ratings]);
  return (
    <div className="graph-wrap">
      <div style={{ display: "inline-block" }}>
        <canvas ref={chartRef} />
      </div>
      <div style={{ display: "inline-block", marginLeft: "20px" }}>
        {selectedSliceData ? (
          <div>
            <h3>Instructors having {selectedSliceIndex + 1} Star Rating</h3>
            <ul>
              {selectedSliceData.map((instructor, index) => (
                <li key={index} style={{color:"#393939"}}>
                  {instructor.instructor}: {instructor.rating}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No slice selected</p>
        )}
      </div>
    </div>
  );
};
export default Graph;
