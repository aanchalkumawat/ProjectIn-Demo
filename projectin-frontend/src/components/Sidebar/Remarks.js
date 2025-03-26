import React from "react";
import "./Remarks.css";

const Remarks = ({ remarks }) => {
  return (
    <div className="remarks-container">
      <h4>Remarks</h4>
      {remarks && remarks.length > 0 ? (
        <table className="remarks-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Remark</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {remarks.map((remark, index) => (
              <tr key={index}>
                <td>{remark.date}</td>
                <td>{remark.remarks}</td>
                <td>{remark.description || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-remarks">No remarks available.</p>
      )}
    </div>
  );
};

export default Remarks;