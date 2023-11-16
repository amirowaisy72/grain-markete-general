import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

const UpdatePoint = () => {
  // AllStates کے ساتھ تعامل
  const context = useContext(contextCreator)
  const { updateCashPoint } = context

  // موقع
  const location = useLocation()

  // اسٹیٹس
  const [wait, setWait] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [title, setTitle] = useState({})

  // ڈیٹا کریئیٹ کرنے والا
  const [data, setData] = useState({
    name: location.state.name,
    balance: location.state.balance,
  })

  // تبدیلی کا ہینڈلر
  const onChange = (e) => {
    if (e.target.name === 'name') {
      // نام کے لئے ہر کلمے کے پہلے حرف کو بڑا کرنا
      const capitalizedValue = e.target.value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      setData({ ...data, [e.target.name]: capitalizedValue })
    } else {
      setData({ ...data, [e.target.name]: e.target.value })
    }
  }

  // جمع کریں ہینڈلر
  const handleSubmit = async (e) => {
    e.preventDefault()
    setWait('تجزیہ کیا جا رہا ہے...')
    // خالی فیلڈ چیک کریں
    if (data.name === '' || data.balance === '') {
      setError('تمام فیلڈز بھریں')
    } else {
      const response = await updateCashPoint(location.state.id, data.name, data.balance)
      if (!response.success) {
        setError(response.error)
      } else {
        setSuccess('کیش پوائنٹ کو کامیابی سے اپ ڈیٹ کیا گیا')
        setError('')
      }
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
              to="/cashpoints/all"
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
                <h3 className="mb-0">{location.state.name} کیش پوائنٹ کو اپ ڈیٹ کریں</h3>
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
                      placeholder="عنوان..."
                      type="text"
                      className="form-control"
                      value={data.name}
                      onChange={onChange}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile">بیلنس</label>
                    <input
                      name="balance"
                      value={data.balance}
                      onChange={onChange}
                      id="balance"
                      placeholder="بیلنس..."
                      type="number"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <button type="submit" className="mt-2 btn btn-primary">
                    اپ ڈیٹ کریں
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

export default UpdatePoint
