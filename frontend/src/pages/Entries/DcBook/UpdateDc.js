import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

const UpdateDc = () => {
  // تمام حالات کے ساتھ بات چیت کرنا
  const context = useContext(contextCreator)
  const { updateEntry } = context

  // مقام
  const location = useLocation()

  // حالات
  const [wait, setWait] = useState('')
  const [guarranter, setGuarranter] = useState({})
  const [error, setError] = useState()
  const [success, setSuccess] = useState('')
  const [title, setTitle] = useState({})

  // ڈیٹا جمع کرنے والا
  const [data, setData] = useState({
    name: location.state.name,
    info: location.state.detail,
    amount: location.state.amount,
    dc: location.state.DbCr,
  })

  // تبدیلی کے ہینڈلر
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  // جمع کرنے کا ہینڈلر
  const handleSubmit = async (e) => {
    e.preventDefault()
    setWait('تجزیہ ہو رہا ہے...')
    // خالی فیلڈ کی چیک کریں
    if (
      data.name === '' ||
      data.amount === '' ||
      data.dc === 'ایک منتخب کریں' || // یقینی بنائیں کہ "ایک منتخب کریں" کی اجازت نہیں ہے
      data.info === ''
    ) {
      setError('تمام فیلڈز بھریں')
    } else {
      await updateEntry(location.state.id, data.name, data.info, data.amount, data.dc)
      setSuccess('انٹری کو کامیابی سے اپ ڈیٹ کیا گیا')
      setError('')
    }
    setWait('')
  }
  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-12">
            <Link
              className="btn btn-primary"
              to="/accountledger"
              state={{ name: location.state.name }}
            >
              واپس
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{location.state.name} کی انٹری کو اپ ڈیٹ کرنا</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <p>{wait}</p>
                    <p>
                      <span style={{ color: 'red' }}>{error}</span>
                    </p>
                    <p style={{ color: 'green' }}>{success}</p>
                    {title ? title.name : ''} <br />
                    <label htmlFor="name">نام</label>
                    <input
                      name="name"
                      id="name"
                      placeholder="اکاؤنٹ کا عنوان..."
                      type="text"
                      className="form-control"
                      value={data.name}
                      onChange={onChange}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile">رقم</label>
                    <input
                      name="amount"
                      value={data.amount}
                      onChange={onChange}
                      id="amount"
                      placeholder="رقم..."
                      type="number"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">کون سی انٹری؟</label>
                    <select
                      className="form-select form-select-lg mb-3"
                      aria-label=".form-select-sm example"
                      name="dc"
                      onChange={onChange}
                      value={data.dc} // ڈراپ ڈاؤن کو کنٹرول کرنے کے لئے قدر تعین کریں
                    >
                      <option value="ایک منتخب کریں">ایک منتخب کریں</option>{' '}
                      {/* اس اختیار کو شامل کیا گیا ہے */}
                      <option value="Debit">نام</option>
                      <option value="Credit">جمع</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">انٹری تفصیل</label>

                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        aria-label="With textarea"
                        name="info"
                        value={data.info}
                        onChange={onChange}
                        id="info"
                      />
                    </InputGroup>
                  </div>
                  <button type="submit" className="mt-2 btn btn-primary">
                    اپ ڈیٹ
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateDc
