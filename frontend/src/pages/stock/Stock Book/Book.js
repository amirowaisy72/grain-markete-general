import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FaBook, FaPencilAlt, FaTrash } from 'react-icons/fa' // react-icons کتابخانے سے آئیکنز کو شامل کریں
import moment, { months } from 'moment/moment'

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

  const getStatusColor = (status) => {
    let backgroundColor, textColor

    switch (status) {
      case 'Regular':
        backgroundColor = '#33B81B'
        textColor = 'white'
        break
      case 'High Risk':
        backgroundColor = '#D7D414'
        textColor = '#FFFFF1'
        break
      case 'Black List':
        backgroundColor = 'red'
        textColor = 'white'
        break
      default:
        backgroundColor = 'transparent'
        textColor = 'black'
        break
    }

    return {
      backgroundColor,
      color: textColor,
    }
  }

  const isDeleteAllowed = (date) => {
    const creationTime = moment(date)
    const currentTime = moment()
    const hoursSinceCreation = currentTime.diff(creationTime, 'hours')
    console.log('Hours Since Creation:', hoursSinceCreation)
    return hoursSinceCreation <= 3
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>فصل کا نام</th>
              <th>موجودہ اسٹاک</th>
              <th>کارروائیاں</th> {/* کارروائیوں کے لئے ایک ایکسٹرا کالم */}
            </tr>
          </thead>
          <tbody>
            {displayData().map((item) => (
              <tr key={item.crop}>
                <td>
                  {item.crop === 'Select Crop'
                    ? 'کوئی ایک چنیں'
                    : item.crop === 'Gandum'
                    ? 'گندم'
                    : item.crop === 'Kapaas'
                    ? 'کپاس'
                    : item.crop === 'Sarson'
                    ? 'سرسوں'
                    : item.crop === 'Mirch'
                    ? 'مرچ'
                    : item.crop === 'Moonji'
                    ? 'مونجھی'
                    : item.crop === 'Deegar'
                    ? 'دیگر'
                    : item.crop}
                </td>

                <td>{item.quantity}</td>
                <td>
                  <Link
                    className="btn btn-success mr-2"
                    to="/stockEntries"
                    state={{ crop: item.crop }}
                  >
                    <FaBook /> {/* کتاب کے لئے آئکن */}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="صفحہ کی نیویگیشن">
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
      crop: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
  entriesPerPage: PropTypes.number.isRequired,
}

export default Book
