// ListPrint.js

import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const ListPrint = ({ selectedEntries, data }) => {
  // Ref for the print window
  const printWindowRef = useRef(null)

  // Filter the documents based on selectedEntries
  const selectedData = data.filter((item) => selectedEntries.includes(item._id))

  // Function to handle the print functionality
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    printWindowRef.current = printWindow

    // Build the HTML content for the print window
    const printContent = `
      <h1>غلہ منڈی</h1>
      <table border="1" style="width: 100%;">
        <thead>
          <tr>
            <th>نام</th>
            <th>موبائل</th>
            <th>پتہ</th>
          </tr>
        </thead>
        <tbody>
          ${selectedData
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.mobileNumbers.map((number) => `${number}<br>`).join('')}</td>
              <td>${item.address}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `

    // Set the HTML content for the print window
    printWindow.document.write(printContent)

    // Close the print window after printing
    printWindow.onafterprint = () => {
      printWindow.close()
      printWindowRef.current = null
    }

    // Trigger the print
    printWindow.print()
  }

  // Render only the print button
  return (
    <div>
      <button className="btn btn-primary mx-5" onClick={handlePrint}>
        پرنٹ
      </button>
    </div>
  )
}

ListPrint.propTypes = {
  selectedEntries: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      mobileNumbers: PropTypes.arrayOf(PropTypes.string).isRequired,
      // Add other PropTypes for properties as needed
    }),
  ).isRequired,
}

export default ListPrint
