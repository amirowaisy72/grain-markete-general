import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'
import { FaPencilAlt, FaTrash } from 'react-icons/fa' // react-icons لائبریری سے آئیکنز شامل کریں

const StockEntries = ({ data, entriesPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1)

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

  const calculateTotalQuantity = () => {
    let quantityTillNow = 0
    const quantityRows = []

    // فعال پیج کے مطابق انٹریز کی رینج کو حساب کریں
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage

    data.forEach((item, index) => {
      const quantity = item.inout === 'In' ? item.quantity : -item.quantity
      quantityTillNow += quantity

      // چیک کریں کہ انڈیکس انٹریز کی رینج کے اندر ہے کہ نہیں
      if (index >= startIndex && index < endIndex) {
        quantityRows.push(
          <tr key={item._id}>
            <td>
              {item.inout === 'In' ? 'ان' : 'آؤٹ'}
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
            <td>{item.quantity}</td>
            <td>
              {item.description === 'انوائس' ? (
                <Link
                  className="btn btn-primary"
                  to="/printInvoice"
                  state={{
                    customer: item.customer,
                    crop: item.crop,
                    quantity: item.quantity,
                    rate: item.rate,
                    mazduriBoriItems: item.mazduriBoriItems,
                    allItems: item.allItems,
                    totalAmount: item.totalAmount,
                    expenseList: item.expenseList,
                    expenseAmounts: item.expenseAmounts,
                    totalExpenses: item.totalExpenses,
                    totalPayableAmount: item.totalPayableAmount,
                    source: 'Stock',
                  }}
                >
                  انوائس
                </Link>
              ) : (
                item.description
              )}
            </td>
            <td>
              {index === data.length - 1 ? (
                <strong>{quantityTillNow} (موجودہ اسٹاک)</strong>
              ) : (
                quantityTillNow
              )}
            </td>
            <td>{timeMaker(item.date)}</td>

            <td>
              {/* Only show edit and delete options for the last entry */}
              {index === data.length - 1 &&
                item.description !== 'انوائس' &&
                getRole() === 'Admin' && (
                  <>
                    <Link
                      state={{
                        id: item._id,
                        crop: item.crop,
                        detail: item.description,
                      }}
                      className="btn btn-danger"
                      to="/deleteStock"
                    >
                      <FaTrash /> {/* حذف کے لئے آئیکن */}
                    </Link>
                  </>
                )}
            </td>
          </tr>,
        )
      }
    })

    return quantityRows
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil((Array.isArray(data) ? data.length : 0) / entriesPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

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
              <th>ان یا آؤٹ</th>
              <th>کلوگرام</th>
              <th>تفصیل</th>
              <th>کل اسٹاک</th>
              <th>وقت</th>
              <th>کارروائیاں</th>
            </tr>
          </thead>

          <tbody>{calculateTotalQuantity()}</tbody>
        </table>
      </div>
      <nav aria-label="صفحہ نیویگیشن">
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

StockEntries.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        stock: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
        inout: PropTypes.oneOf(['In', 'Out']).isRequired,
        description: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.object,
  ]).isRequired,
  entriesPerPage: PropTypes.number.isRequired,
}

export default StockEntries
