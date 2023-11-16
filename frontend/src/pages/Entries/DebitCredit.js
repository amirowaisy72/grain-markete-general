import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import contextCreator from '../context/contextCreator'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const DebitCredit = () => {
  // State functions and variables
  const context = useContext(contextCreator)
  const { searchAccount, createDc, searchDcAccount } = context

  // حساب کو تلاش کریں
  const search = async () => {
    try {
      setWait('مشابہ حساب جانچ رہے ہیں...')
      let data = await searchAccount(detail.name)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success && data.accounts) {
        setTitle(data.accounts)
        setTitleBalance(data.balance)
      }
    } catch (error) {
      setError('Some other problem occured')
      setWait('')
    }
  }

  // ڈیٹا کولیکٹر
  const [detail, setDetail] = useState({
    name: '',
    amount: '',
    dc: 'Select one',
    info: '',
  })

  // دوسرے حالات
  const [title, setTitle] = useState({})
  const [titleBalance, setTitleBalance] = useState('')
  const [wait, setWait] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // onchange ہینڈلر
  const onChange = (e) => {
    setDetail({ ...detail, [e.target.name]: e.target.value })
  }

  // درست رقبہ کی جانچ پڑتال
  const validAmountRegex = /^[1-9][0-9]*$/

  // جمع کریں ہینڈلر
  const handleClick = async () => {
    setWait('تجزیہ کر رہے ہیں...')

    try {
      // خالی فیلڈ کی جانچ پڑتال اور رقبہ کی تصدیق
      if (
        detail.name === '' ||
        detail.amount === '' ||
        detail.dc === 'Select one' || // یقینی بنائیں کہ "Select one" کی اجازت نہیں ہے
        detail.info === ''
      ) {
        setError('تمام فیلڈز بھریں')
      } else if (!validAmountRegex.test(detail.amount)) {
        setError('غلط رقم. براہ کرم درست رقم (روپوں میں) درج کریں۔')
      } else {
        const response = await searchDcAccount(detail.name)
        if (response.success) {
          if (!response.accounts) {
            setError('غلط عنوان یا عنوان نہیں ملا')
          } else {
            const create = await createDc(
              detail.name,
              detail.info,
              detail.amount,
              detail.dc,
              selectedDate,
            )
            if (create.success) {
              setSuccess('انٹری کامیابی سے کی گئی')
              setDetail({
                name: '',
                amount: '',
                dc: 'Select one', // اس مقام پر ڈراپ ڈاؤن کی قدر دیتا ہے
                info: '',
              })
              setSelectedDate(null)
              setError('')
            } else {
              setError('')
            }
          }
        } else {
          setError('آپ کے درخواست کو پروسیس کرنے میں خرابی')
        }
      }
      setWait('')
    } catch (error) {
      setWait('')
      setError(error.message)
    }
  }

  // عنوان نام کوپی کریں
  const copyTitle = () => {
    setDetail({ ...detail, name: title.name })
  }

  const [selectedDate, setSelectedDate] = useState(null) // State for date selection

  // Date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <>
      <div className="mx-2 mt-5 app-login-box col-sm-12 col-md-10 col-lg-9">
        <h1>
          <Link className="btn btn-primary" to="/#/dashboard">
            ہوم
          </Link>
        </h1>
        <h4>
          <div>خوش آمدید،</div>
          <span>
            کھاتا بک میں <span className="text-success">جمع یا نام</span> انٹری کریں
          </span>
        </h4>
        <div>
          <form>
            <center>
              <p>{wait}</p>
              <p>
                <span style={{ color: 'red' }}>{error}</span>
              </p>
              <p style={{ color: 'green' }}>{success}</p>
              {title ? (
                <>
                  <div onClick={copyTitle} className="btn btn-primary">
                    {title.name}
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
            </center>
            <div className="form-row">
              <div className="col-md-12">
                <div className="position-relative form-group">
                  <label htmlFor="exampleEmail">
                    <span className="text-danger">*</span> اکاؤنٹ کا عنوان
                  </label>
                  <input
                    name="name"
                    id="name"
                    placeholder="اکاؤنٹ کا عنوان..."
                    type="text"
                    className="form-control"
                    value={detail.name}
                    onChange={onChange}
                    onKeyUp={search}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="position-relative form-group">
                  <label htmlFor="">
                    <span className="text-danger">*</span> رقم (روپوں میں)
                  </label>
                  <input
                    name="amount"
                    value={detail.amount}
                    onChange={onChange}
                    id="amount"
                    placeholder="رقم..."
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-16">
              <div className="position-relative form-group">
                <label htmlFor="">
                  <span className="text-danger">*</span> کون سی انٹری ہے؟
                </label>
                <select
                  className="form-select form-select-lg mb-3"
                  aria-label=".form-select-sm example"
                  name="dc"
                  onChange={onChange}
                  value={detail.dc} // ڈراپ ڈاؤن کو کنٹرول کرنے کے لئے قیمت تعین کریں
                >
                  <option value="Select one">ایک منتخب کریں</option>
                  <option value="Credit">جمع</option>
                  <option value="Debit">نام</option>
                </select>
              </div>
            </div>
            <div className="col-md-16">
              <div className="position-relative form-group">
                <label htmlFor="">
                  <span className="text-danger">*</span> انٹری تفصیل
                </label>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    aria-label="With textarea"
                    name="info"
                    value={detail.info}
                    onChange={onChange}
                    id="info"
                  />
                </InputGroup>
              </div>
            </div>
            <div className="col-md-16">
              <div className="position-relative form-group">
                <label htmlFor="">
                  {' '}
                  (نوٹ: اگر آپ وقت اور تاریخ ڈالنا ضروری نہیں سمجھتے تو اس فیلڈ کو خالی چھوڑ دیں)
                  تاریخ
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
            <div className="form-row">
              <div className="col-md-6">
                <div className="position-relative form-group">
                  <div
                    onClick={handleClick}
                    className="mt-2 btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-lg"
                  >
                    انٹری کریں
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
