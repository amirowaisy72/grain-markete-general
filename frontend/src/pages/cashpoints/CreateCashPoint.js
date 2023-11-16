import React, { useContext, useState } from 'react'
import contextCreator from '../context/contextCreator'
import { Link } from 'react-router-dom'

const CreateCashPoint = () => {
  const context = useContext(contextCreator)
  const { searchCashPoint, createCashPoint } = context
  const [createDone, setCreateDone] = useState(true)

  const search = async () => {
    try {
      setWait('مماثل کیش پوائنٹ کی جائے چیک کیا جا رہا ہے...')
      let data = await searchCashPoint(detail.name)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success) setTitle(data.cashpoints)
    } catch (error) {
      setError('Some other problem occured')
      setWait('')
    }
  }

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const [detail, setDetail] = useState({
    name: '',
    balance: '',
  })

  const [title, setTitle] = useState({})
  const [wait, setWait] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onChange = (e) => {
    if (e.target.name === 'name') {
      setDetail({ ...detail, [e.target.name]: capitalizeWords(e.target.value) })
    } else if (e.target.name === 'balance') {
      const inputValue = parseFloat(e.target.value)
      if (isNaN(inputValue) || inputValue < 0) {
        setError('بیلنس مثبت عدد ہونا ضروری ہے')
        setDetail({ ...detail, [e.target.name]: e.target.value })
      } else {
        setError('')
        setDetail({ ...detail, [e.target.name]: e.target.value })
      }
    } else {
      setDetail({ ...detail, [e.target.name]: e.target.value })
    }
  }

  const handleClick = async () => {
    setWait('تجزیہ ہو رہا ہے...')

    try {
      if (detail.name === '' || detail.balance === '') {
        setError('تمام خانوں کو پُر کریں')
      } else {
        setCreateDone(false)
        let response = await createCashPoint(detail.name, detail.balance)
        setCreateDone(true)
        if (!response.success) {
          setError('اس عنوان کے ساتھ ایک اور کیش پوائنٹ پہلے سے موجود ہے')
        } else {
          setSuccess(
            '(توجہ فرمائیں۔ اگر آپ اس کیش پوائنٹ کو ڈیلیٹ کرنا چاہتے ہیں تو تین گھنٹے کےوقت کے اندر ڈیلیٹ کر سکتے ہیں)کیش پوائنٹ کامیابی سے بنایا گیا',
          )
          setDetail({
            name: '',
            balance: '',
          })
        }
      }
      setWait('')
    } catch (error) {
      setWait('')
      setError('Some other problem occured')
    }
  }

  return (
    <div className="mx-2 app-container app-theme-white body-tabs-shadow">
      <div className="app-container">
        <div className="h-100 bg-premium-dark">
          <div className="d-flex h-100 justify-content-center align-items-center">
            <div className="mx-auto app-login-box col-md-8">
              <div className="app-logo-inverse mx-auto mb-3"></div>
              <div className="modal-dialog w-100">
                <div className="modal-content">
                  <div className="modal-body">
                    <h5 className="modal-title">
                      <h1>
                        <Link className="btn btn-primary" to="/#/dashboard">
                          ہوم
                        </Link>
                      </h1>
                      <h4 className="mt-2">
                        <div>خوش آمدید,</div>
                        <span>
                          نئی کیش پوائنٹ بنانے میں صرف
                          <span className="text-success"> چند سیکنڈز </span> درکار ہیں
                        </span>
                      </h4>
                    </h5>
                    <div className="divider row"></div>
                    <div className="form-row">
                      <div className="col-md-12">
                        <div className="position-relative form-group">
                          <p>{wait}</p>
                          <p>
                            <span style={{ color: 'red' }}>{error}</span>
                          </p>
                          <p style={{ color: 'green' }}>{success}</p>
                          {title ? title.name : ''}
                          <input
                            name="name"
                            id="name"
                            placeholder="کیش پوائنٹ کا عنوان..."
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
                        <div className="position-relative form-group mt-2">
                          <input
                            name="balance"
                            id="mobile"
                            placeholder="ابتدائی / موجودہ رقم داخل کریں"
                            type="number"
                            className="form-control"
                            value={detail.balance}
                            onChange={onChange}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="divider row"></div>
                  </div>
                  <div className="modal-footer d-block text-center">
                    <button
                      disabled={!createDone ? true : false}
                      onClick={handleClick}
                      className="mt-2 btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-lg"
                    >
                      کیش پوائنٹ بنائیں
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCashPoint
