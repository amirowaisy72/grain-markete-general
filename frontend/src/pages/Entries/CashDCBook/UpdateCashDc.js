import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

function UpdateCashDc() {
  // موقع
  const location = useLocation()
  // حالت کی توابع اور متغیرات
  const context = useContext(contextCreator)
  const { searchCashPoint, createCashDc, searchDcAccount, searchAccount } = context

  // دوسری حالات
  const [pointTitle, setPointTitle] = useState({})
  const [wait, setWait] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customerTitle, setCustomerTitle] = useState({})

  // نقد نقطہ تلاش کریں
  const searchPoint = async () => {
    setWait('کیش پوائنٹ تلاش کر رہا ہے...')
    let data = await searchCashPoint(formData.cashPoint)
    setError('')
    setSuccess('')
    setWait('')
    if (data.success && data.cashpoints) {
      setPointTitle(data.cashpoints)
    }
  }

  // حساب کا عنوان تلاش کریں
  const searchAccountTitle = async () => {
    setWait('مماثل حساب کو دیکھا جارہا ہے...')
    let data = await searchAccount(formData.customerName)
    setError('')
    setSuccess('')
    setWait('')
    if (data.success && data.accounts) {
      setCustomerTitle(data.accounts)
    }
  }

  // نقد نقطہ عنوان کاپی کریں
  const copyCashPoint = () => {
    setFormData({ ...formData, cashPoint: pointTitle.name })
  }

  // گاہک کا عنوان کاپی کریں
  const copyCustomerTitle = () => {
    setFormData({ ...formData, customerName: customerTitle.name })
  }

  const [formData, setFormData] = useState({
    cashPoint: location.state.cashPoint,
    transactionType: location.state.transactionType,
    amount: location.state.amount,
    source: location.state.source,
    customerName: location.state.customerName,
    description: location.state.description,
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setWait('براہ کرم انتظار کریں...')
    if (validateForm()) {
      const response = await searchCashPoint(formData.cashPoint)
      let response2 = {}
      if (formData.customerName !== '') {
        response2 = await searchDcAccount(formData.customerName)
      } else {
        response2 = {
          success: true,
          accounts: 'پاس',
        }
      }

      if (response.success && response.success) {
        if (response.cashpoints === null) {
          setError('غلط نقد نقطہ یا نقد نقطہ نہیں مل سکا')
        } else if (response2.accounts === null) {
          setError('غلط گاہک کا نام')
        } else {
          const response = await createCashDc(
            formData.cashPoint,
            formData.transactionType,
            formData.amount,
            formData.source,
            formData.customerName,
            formData.description,
          )

          if (!response.success) {
            setError(response.error)
          } else {
            setSuccess('کوئیری کامیابی سے مکمل ہوگیا')
            setFormData({
              cashPoint: '',
              transactionType: '',
              amount: '',
              source: '',
              customerName: '',
              description: '',
            })
            setErrors({})
            setSubmitted(true)
            setError('')
          }
        }
      } else {
        setError('کوئیری کو اجراء کرتے وقت فیل ہوگیا')
      }
    }
    setWait('')
  }

  const validateForm = () => {
    const newErrors = {}
    const { cashPoint, transactionType, amount, source, customerName, description } = formData

    if (!cashPoint.trim()) {
      newErrors.cashPoint = 'نقد نقطہ عنوان ضروری ہے۔'
    }
    if (!transactionType) {
      newErrors.transactionType = 'ٹرانزیکشن کی قسم ضروری ہے۔'
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'رقم مثبت عدد ہونی چاہئے۔'
    }
    if (!source) {
      newErrors.source = 'ذریعہ ضروری ہے۔'
    }
    if (source === 'گاہک کے ذریعے') {
      if (!customerName.trim()) {
        newErrors.customerName = 'گاہک کا نام ضروری ہے۔'
      }
      if (!description.trim()) {
        newErrors.description = 'وضاحت ضروری ہے۔'
      }
    } else if (source === 'خود ہی کے ذریعے') {
      if (!description.trim()) {
        newErrors.description = 'وضاحت ضروری ہے۔'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="container mt-5">
      <Link
        className="btn btn-primary"
        state={{ cashPoint: location.state.cashPoint }}
        to="/cashentries"
      >
        واپس
      </Link>
      <h1 className="text-center"> {location.state.cashPoint} میں انٹری اپ ڈیٹ کرنا</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <center>
            <p>{wait}</p>
            <p>
              <span style={{ color: 'red' }}>{error}</span>
            </p>
            <p style={{ color: 'green' }}>{success}</p>
            {pointTitle ? (
              <div onClick={copyCashPoint} className="btn btn-primary">
                {pointTitle.name}
              </div>
            ) : (
              ''
            )}
          </center>
          <label>کیش پوائنٹ</label>
          <input
            type="text"
            className="form-control"
            name="cashPoint"
            value={formData.cashPoint}
            onChange={handleInputChange}
            onKeyUp={searchPoint}
            disabled
          />
          <span className="text-danger">{errors.cashPoint}</span>
        </div>

        <div className="form-group">
          <label>ٹرانزیکشن کی قسم</label>
          <select
            className="form-control"
            name="transactionType"
            value={formData.transactionType}
            onChange={handleInputChange}
          >
            <option value="">ایک منتخب کریں</option>
            <option value="Deposit">جمع کرائیں</option>
            <option value="Take Out">نکالیں</option>
          </select>
          <span className="text-danger">{errors.transactionType}</span>
        </div>

        <div className="form-group">
          <label>کتنی رقم</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
          <span className="text-danger">{errors.amount}</span>
        </div>

        <div className="form-group">
          <label>ذریعہ منتخب کریں</label>
          <select
            className="form-control"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
          >
            <option value="">ایک منتخب کریں</option>
            <option value="By Customer">گاہک</option>
            <option value="By Yourself">آپ خود</option>
          </select>
          <span className="text-danger">{errors.source}</span>
        </div>

        {formData.source === 'By Customer' && (
          <>
            {customerTitle ? (
              <div onClick={copyCustomerTitle} className="btn btn-primary">
                {customerTitle.name}
              </div>
            ) : (
              ''
            )}
            <div className="form-group">
              <label>گاہک کا نام</label>
              <input
                type="text"
                className="form-control"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                onKeyUp={searchAccountTitle}
                style={{ textTransform: 'capitalize' }}
              />
              <span className="text-danger">{errors.customerName}</span>
            </div>

            <div className="form-group">
              <label>اس انٹری کی وضاحت</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                style={{ textTransform: 'capitalize' }}
              ></textarea>
              <span className="text-danger">{errors.description}</span>
            </div>
          </>
        )}

        {formData.source === 'By Yourself' && (
          <div className="form-group">
            <label>اس انٹری کی وضاحت</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{ textTransform: 'capitalize' }}
            ></textarea>
            <span className="text-danger">{errors.description}</span>
          </div>
        )}

        <button disabled type="submit" className="my-2 btn btn-primary">
          اپ ڈیٹ کریں
        </button>
      </form>
    </div>
  )
}

export default UpdateCashDc
