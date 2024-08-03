import React from 'react';
import { Link } from 'react-router-dom';

const TablePage = () => {
  return (
    <div>
      <h1>Table Menu</h1>
      <table>
        <thead>
          <tr>
            <th>Left Column</th>
            <th>Right Column</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 13 }).map((_, index) => (
            <tr key={index}>
              <td>
                <Link to={`/form/${index + 1}`}>{index + 1}</Link>
              </td>
              <td>
                <Link to={`/form/${index + 14}`}>{index + 14}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
