import React from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'

const Print = ({
  customer,
  crop,
  quantity,
  rate,
  weightStatement,
  totalAmount,
  calculatedExpenses,
  totalPayableAmount,
}) => {
  const location = useLocation()

  // Define default values for props
  customer = customer || (location.state && location.state.customer) || 'Default Customer'
  crop = crop || (location.state && location.state.crop) || 'Default Crop'
  quantity = quantity || (location.state && location.state.quantity) || 0
  rate = rate || (location.state && location.state.rate) || 0
  weightStatement = weightStatement || (location.state && location.state.weightStatement) || ''
  totalAmount = totalAmount || (location.state && location.state.totalAmount) || 0
  calculatedExpenses =
    calculatedExpenses || (location.state && location.state.calculatedExpenses) || {}
  totalPayableAmount =
    totalPayableAmount || (location.state && location.state.totalPayableAmount) || 0

  const handlePrint = () => {
    const invoiceContent = document.getElementById('invoice-content')
    const printWindow = window.open('', '', 'width=600,height=600')

    printWindow.document.open()
    printWindow.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style type="text/css">
                ${getPrintStyles()} /* Load the print styles */
              </style>
            </head>
            <body>
              ${invoiceContent.innerHTML}
            </body>
          </html>
        `)
    printWindow.document.close()

    printWindow.print()
    printWindow.close()
  }

  const getPrintStyles = () => {
    return `
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            margin: 0;
            padding: 0;
          }
      
          #invoice-content {
            padding: 20px;
            border: 1px solid #ccc;
            margin: 0 auto;
            width: 80%;
            background-color: #fff;
          }
      
          h3 {
            font-size: 18pt;
            margin-top: 0;
          }
      
          p {
            font-size: 12pt;
          }
      
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ccc;
          }
      
          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ccc;
          }
      
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
      
          .btn {
            display: none; /* Hide the "Print" button when printing */
          }
        `
  }

  // Function to calculate the sum of all expenseCalculated values
  const calculateTotalExpenses = (expensesObject) => {
    let total = 0
    for (const expense in expensesObject) {
      total += eval(expensesObject[expense].expenseCalculated)
    }
    return total
  }

  return (
    <>
      {location.state?.source === 'Accounts' && (
        <Link className=" mx-5 btn btn-primary" to="/accountledger" state={{ name: customer }}>
          واپس
        </Link>
      )}
      {location.state?.source === 'Stock' && (
        <Link className=" mx-5 btn btn-primary" to="/stockEntries" state={{ crop: crop }}>
          واپس
        </Link>
      )}
      <button className="btn btn-primary" onClick={handlePrint}>
        Print
      </button>
      <div className="mt-4" id="invoice-content">
        <h3>انوائس کی معلومات:</h3>
        <p>
          {' '}
          {customer}, {}
        </p>
        <p> براہ کرم مندرجہ ذیل تفصیلات دیکھیں:</p>
        {weightStatement}
        <table className="table">
          <tbody>
            <tr>
              <td>فصل:</td>
              <td>
                {crop === 'Select Crop'
                  ? 'کوئی ایک چنیں'
                  : crop === 'Gandum'
                  ? 'گندم'
                  : crop === 'Kapaas'
                  ? 'کپاس'
                  : crop === 'Sarson'
                  ? 'سرسوں'
                  : crop === 'Mirch'
                  ? 'مرچ'
                  : crop === 'Moonji'
                  ? 'مونجھی'
                  : crop === 'Deegar'
                  ? `دیگر (${crop})`
                  : crop}
              </td>
              <td>وزن :</td>
              <td>من {(quantity / 40).toFixed(2)}</td>
              <td>ریٹ:</td>
              <td>Rs {rate}</td>
            </tr>
            <tr>
              <td colSpan="6">کل رقم (Rs):</td>
              <td>Rs {Math.round(totalAmount).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <table className="table">
          <thead>
            <tr>
              <th>خرچہ</th>
              <th>رقم (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(calculatedExpenses).map((expense) => (
              <tr key={expense}>
                <td>
                  {expense === 'Apply Expenses'
                    ? 'اخراجات لگائیں'
                    : expense === 'Commission'
                    ? 'کمیشن'
                    : expense === 'Mazduri'
                    ? 'مزدوری'
                    : expense === 'Mazduri Bori'
                    ? ' مزدوری مکمل بوریاں'
                    : expense === 'Mazduri Tor'
                    ? ' مزدوری ادھوری بوریاں'
                    : expense === 'Brokery'
                    ? 'دلالی'
                    : expense === 'Accountant'
                    ? 'منشیانہ'
                    : expense === 'Markete_Fee'
                    ? 'مارکیٹ فیس'
                    : expense === 'Sootli'
                    ? 'سوتلی'
                    : expense === 'Ghisai'
                    ? 'گھسائی'
                    : expense}
                </td>
                <td>
                  Rs {Math.round(calculatedExpenses[expense].expenseCalculated).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <th>کل خرچہ:</th>
              <th>Rs {Math.round(calculateTotalExpenses(calculatedExpenses)).toLocaleString()}</th>
            </tr>
            <tr>
              <th>کل رقم:</th>
              <th>Rs {Math.round(totalAmount).toLocaleString()}</th>
            </tr>
            <tr>
              <th> کل واجب الادا رقم:</th>
              <th>
                Rs{' '}
                {totalPayableAmount !== undefined &&
                  Math.round(totalPayableAmount).toLocaleString()}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

Print.propTypes = {
  customer: PropTypes.string.isRequired,
  crop: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  rate: PropTypes.number.isRequired,
  weightStatement: PropTypes.string.isRequired,
  totalAmount: PropTypes.number.isRequired,
  calculatedExpenses: PropTypes.objectOf(
    PropTypes.shape({
      formula: PropTypes.number.isRequired,
      expenseCalculated: PropTypes.number.isRequired,
    }),
  ).isRequired,
  totalPayableAmount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
}

export default Print
