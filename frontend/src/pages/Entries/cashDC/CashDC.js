import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function CashDC() {
  // State functions and variables
  const context = useContext(contextCreator)
  const { searchCashPoint, createCashDc, searchDcAccount, searchAccount } = context

  // Other states
  const [pointTitle, setPointTitle] = useState({})
  const [wait, setWait] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [customerTitle, setCustomerTitle] = useState({})
  const [createDone, setCreateDone] = useState(true)
  const [titleBalance, setTitleBalance] = useState('')

  // Search Cash Point
  const searchPoint = async () => {
    try {
      setWait('کیش پوائنٹ تلاش کی جا رہی ہے...')
      let data = await searchCashPoint(formData.cashPoint)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success && data.cashpoints) {
        setPointTitle(data.cashpoints)
      }
    } catch (error) {
      setWait('')
      setError('Some other problem occured')
    }
  }

  // Search Account Title
  const searchAccountTitle = async () => {
    try {
      setWait('مماثل اکاؤنٹ چیک کیا جا رہا ہے...')
      let data = await searchAccount(formData.customerName)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success && data.accounts) {
        setCustomerTitle(data.accounts)
        setTitleBalance(data.balance)
      }
    } catch (error) {
      setWait('')
      setError('Some oter problem occured')
    }
  }

  // Cash Point Title name copier
  const copyCashPoint = () => {
    setFormData({ ...formData, cashPoint: pointTitle.name })
  }

  // Customer Title name copier
  const copyCustomerTitle = () => {
    setFormData({ ...formData, customerName: customerTitle.name })
  }

  const [formData, setFormData] = useState({
    cashPoint: '',
    transactionType: '',
    amount: '',
    source: '',
    customerName: '',
    description: '',
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
    try {
      if (validateForm()) {
        const response = await searchCashPoint(formData.cashPoint)
        let response2 = {}
        if (formData.customerName !== '') {
          response2 = await searchDcAccount(formData.customerName)
        } else {
          response2 = {
            success: true,
            accounts: 'Pass',
          }
        }

        if (response.success && response.success) {
          if (response.cashpoints === null) {
            setError('غلط کیش پوائنٹ یا کیش پوائنٹ نہیں ملا')
          } else if (response2.accounts === null) {
            setError('غلط کسٹمر نام')
          } else {
            setCreateDone(false)
            const response = await createCashDc(
              formData.cashPoint,
              formData.transactionType,
              formData.amount,
              formData.source,
              formData.customerName,
              formData.description,
              selectedDate,
            )
            setCreateDone(true)

            if (!response.success) {
              setError(response.error)
            } else {
              setSuccess('کوئیری کامیابی سے انجام دی گئی')
              setFormData({
                cashPoint: '',
                transactionType: '',
                amount: '',
                source: '',
                customerName: '',
                description: '',
              })
              setSelectedDate(null)
              setErrors({})
              setSubmitted(true)
              setError('')
            }
          }
        } else {
          setError('کوئیری کو انجام دیتے وقت خرابی آئی')
        }
      }
      setWait('')
    } catch (error) {
      setWait('')
      setError('Some other problem occured')
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const { cashPoint, transactionType, amount, source, customerName, description } = formData

    if (!cashPoint.trim()) {
      newErrors.cashPoint = 'کیش پوائنٹ کا عنوان ضروری ہے۔'
    }
    if (!transactionType) {
      newErrors.transactionType = 'ٹرانزیکشن کی قسم ضروری ہے۔'
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'رقم مثبت عدد ہونی چاہئے۔'
    }
    if (!source) {
      newErrors.source = 'ماخذ ضروری ہے۔'
    }
    if (source === 'By Customer') {
      if (!customerName.trim()) {
        newErrors.customerName = 'مشتری کا نام ضروری ہے۔'
      }
      if (!description.trim()) {
        newErrors.description = 'تفصیل ضروری ہے۔'
      }
    } else if (source === 'By Yourself') {
      if (!description.trim()) {
        newErrors.description = 'تفصیل ضروری ہے۔'
      }
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const [selectedDate, setSelectedDate] = useState(null) // State for date selection

  // Date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="container mt-5">
      <Link className="btn btn-primary" to="/#/dashboard">
        ہوم
      </Link>
      <h1 className="text-center">کیش انٹری پوائنٹ میں خوش آمدید</h1>
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
                {pointTitle.name} ({pointTitle.balance})
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
          <label>رقم</label>
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
          <label>کیش کے آنے یا جانے کا ذریعہ بتائیں</label>
          <select
            className="form-control"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
          >
            <option value="">ایک منتخب کریں</option>
            <option value="By Customer"> کسٹمر </option>
            <option value="By Yourself">آپ خود</option>
          </select>
          <span className="text-danger">{errors.source}</span>
        </div>

        {formData.source === 'By Customer' && (
          <>
            {customerTitle ? (
              <>
                <div onClick={copyCustomerTitle} className="btn btn-primary">
                  {customerTitle.name}
                </div>
                <div className="btn btn-primary mx-2">
                  {titleBalance < 0
                    ? `(نام) ${titleBalance} روپے`
                    : titleBalance > 0
                    ? `(جمع) ${titleBalance} روپے`
                    : titleBalance === 0
                    ? 'صفر'
                    : ''}
                </div>
              </>
            ) : (
              ''
            )}
            <div className="form-group">
              <label>کسٹمر کا نام</label>
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
              <label>اس انٹری کی تفصیل</label>
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
            <label>اس انٹری کی تفصیل</label>
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

        <div className="col-md-16">
          <div className="position-relative form-group">
            <label htmlFor="">
              {' '}
              (نوٹ: اگر آپ وقت اور تاریخ ڈالنا ضروری نہیں سمجھتے تو اس فیلڈ کو خالی چھوڑ دیں) تاریخ
            </label>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <button
          disabled={!createDone ? true : false}
          type="submit"
          className="my-2 btn btn-primary"
        >
          انٹری کریں
        </button>
      </form>
    </div>
  )
}

export default CashDC
