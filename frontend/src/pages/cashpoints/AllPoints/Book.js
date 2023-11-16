import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment, { months } from 'moment/moment'
import { FaBook, FaPencilAlt, FaTrash } from 'react-icons/fa'

const Book = ({ data, entriesPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const displayData = () => {
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    return data.slice(startIndex, endIndex)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(data.length / entriesPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const timeEnd = Date.now()

  const dateConverter = (startDate, timeEnd, type) => {
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(timeEnd)
    let result = moment(newStartDate).diff(newEndDate, type)
    return result
  }

  const timeMaker = (startDate) => {
    const years = dateConverter(startDate, timeEnd, 'years')
    const month = dateConverter(startDate, timeEnd, 'months')
    const days = dateConverter(startDate, timeEnd, 'days')
    const hours = dateConverter(startDate, timeEnd, 'hours')
    const minutes = dateConverter(startDate, timeEnd, 'minutes')
    if (years !== 0) {
      return Math.abs(years) + ' سال پہلے'
    } else if (month !== 0) {
      return Math.abs(month) + ' مہینے پہلے'
    } else if (days !== 0) {
      return Math.abs(days) + ' دن پہلے'
    } else if (hours !== 0) {
      return Math.abs(hours) + ' گھنٹے پہلے'
    } else if (minutes !== 0) {
      return Math.abs(minutes) + ' منٹ پہلے'
    } else {
      return 'ابھی ابھی'
    }
  }

  const moneyFormatter = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Invalid Amount'
    }

    // Ensure the amount is positive
    const absoluteAmount = Math.abs(amount)

    // Format the absolute amount as Pakistani currency
    const formattedAmount = absoluteAmount.toLocaleString('en-PK', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    return formattedAmount
  }

  const isDeleteAllowed = (date) => {
    const creationTime = moment(date)
    const currentTime = moment()
    const hoursSinceCreation = currentTime.diff(creationTime, 'hours')
    return hoursSinceCreation <= 3
  }

  // Function to decode the token
  const getRole = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch (error) {
      return ''
    }
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>بیلنس</th>
              <th>تخلیق ہوئی تاریخ</th>
              <th>کارروائیاں</th>
            </tr>
          </thead>
          <tbody>
            {displayData().map((item) => (
              <tr key={item._id}>
                <td>
                  {item.name}
                  <br></br>
                  <span
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#ccc',
                      padding: '2px 5px',
                      borderRadius: '5px',
                    }}
                  >
                    Created by {item.adminDetail?.username}
                  </span>
                </td>
                <td>Rs {moneyFormatter(item.balance)}</td>
                <td>{timeMaker(item.date)}</td>
                <td>
                  <Link
                    className="btn btn-success mr-2"
                    to="/cashentries"
                    state={{ cashPoint: item.name }}
                  >
                    <FaBook /> {/* دستاویز کے لئے آئیکن */}
                  </Link>
                  {getRole() === 'Admin' && (
                    <Link
                      to="/updateCashPoint"
                      state={{
                        id: item._id,
                        name: item.name,
                        balance: item.balance,
                      }}
                      className="btn btn-warning mr-2"
                    >
                      <FaPencilAlt /> {/* ترتیب کے لئے آئیکن */}
                    </Link>
                  )}
                  {isDeleteAllowed(item.date) && getRole() === 'Admin' && (
                    <Link
                      state={{
                        id: item._id,
                        name: item.name,
                      }}
                      className="btn btn-danger"
                      to="/deleteCashPoint"
                    >
                      <FaTrash />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="صفحہ نویگیشن">
        <ul className="pagination justify-content-center">
          {pages.map((page) => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

Book.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      guarranter: PropTypes.string.isRequired,
    }),
  ).isRequired,
  entriesPerPage: PropTypes.number.isRequired,
}

export default Book
