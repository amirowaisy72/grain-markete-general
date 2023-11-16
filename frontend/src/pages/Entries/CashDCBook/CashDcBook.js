import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'
import { FaBook, FaPencilAlt, FaTrash } from 'react-icons/fa' // react-icons library سے آئیکنس شامل کریں

const CashDcBook = ({ data, entriesPerPage }) => {
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

  const calculateBalance = () => {
    let balance = 0
    const balanceRows = []

    // جاری صفحے کی بنیاد پر دکھانے کی انٹریز کی رینج کا حساب کریں
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage

    data.forEach((item, index) => {
      const amount = item.transactionType === 'Deposit' ? item.amount : -item.amount
      balance += amount

      // چیک کریں کہ انڈیکس انٹریز کی رینج کے اندر ہے یا نہیں دکھانے کیلئے
      if (index >= startIndex && index < endIndex) {
        balanceRows.push(
          <tr key={item._id}>
            <td>
              {item.transactionType === 'Deposit' ? 'جمع کروایا' : 'نکلوایا'}
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
            <td>{item.detail}</td>
            <td>{item.source === 'By Customer' ? item.customer : item.source}</td>
            <td>{timeMaker(item.date)}</td>
            <td>{moneyFormatter(item.amount)}</td>
            <td>{index === data.length - 1 ? <strong>بیلنس = {balance}</strong> : balance}</td>

            {/* Only show edit and delete options for the last entry */}
            {index === data.length - 1 && getRole() === 'Admin' && (
              <td>
                <Link
                  to="/updatecashdc"
                  state={{
                    id: item._id,
                    cashPoint: item.cashPoint,
                    transactionType: item.transactionType,
                    amount: item.amount,
                    source: item.source,
                    customerName: item.customer,
                    description: item.detail,
                  }}
                  className="btn btn-warning mr-2"
                >
                  <FaPencilAlt /> {/* ترتیب کے لئے آئیکن */}
                </Link>
                <Link
                  state={{
                    id: item._id,
                    cashPoint: item.cashPoint,
                    description: item.detail,
                  }}
                  className="btn btn-danger"
                  to="/deleteCashDc"
                >
                  <FaTrash /> {/* ترتیب کے لئے آئیکن */}
                </Link>
              </td>
            )}
          </tr>,
        )
      }
    })

    return balanceRows
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil((Array.isArray(data) ? data.length : 0) / entriesPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ٹرانزیکشن کی قسم</th>
              <th>تفصیل</th>
              <th>ماخذ</th>
              <th>وقت</th>
              <th>رقم</th>
              <th>بیلنس</th>
              <th>کارروائیاں</th> {/* کالم کا نام "کارروائیاں" تبدیل کر دیا گیا ہے */}
            </tr>
          </thead>
          <tbody>{calculateBalance()}</tbody>
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

CashDcBook.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        detail: PropTypes.string.isRequired,
        DbCr: PropTypes.oneOf(['Debit', 'Credit']).isRequired,
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        guarranter: PropTypes.string.isRequired,
      }),
    ),
    PropTypes.object,
  ]).isRequired,
  entriesPerPage: PropTypes.number.isRequired,
}

export default CashDcBook
