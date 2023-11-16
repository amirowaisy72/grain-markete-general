import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'
// Import icons for the dropdown options
import { FaCircle } from 'react-icons/fa'
import Select from 'react-select' // Import the Select component from react-select

const UpdateAccount = () => {
  // AllStates کے ساتھ تعامل کرنا
  const context = useContext(contextCreator)
  const { searchAccount, updateAccount } = context

  // موقع
  const location = useLocation()

  const mobileNumberRegex = /^03[0-9]{9}$/
  const idCardNumberRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [guarranter, setGuarranter] = useState({})
  const [error, setError] = useState()
  const [success, setSuccess] = useState('')
  const [title, setTitle] = useState({})

  // گارنٹر ٹائٹل
  // گارنٹر اکاؤنٹ تلاش کریں
  const searchGuarranter = async () => {
    setWait('گارنٹر اکاؤنٹ تلاش کر رہا ہے...')
    let response = await searchAccount(data.guarranter)
    setError('')
    setSuccess('')
    setWait('')
    if (response.success) setGuarranter(response.accounts)
  }

  // گارنٹر کا نام کاپی کرنے والا
  const copyGuarranter = () => {
    setData({ ...data, guarranter: guarranter.name })
  }

  // ڈیٹا کلیکٹر
  const [data, setData] = useState({
    name: location.state.name,
    mobile: '',
    mobileNumbers: location.state.mobile,
    address: location.state.address,
    guarranter: location.state.guarranter,
    idCard: location.state.idCard,
    status: location.state.status,
    accountType: location.state.accountType,
  })

  // اکاؤنٹ تلاش کریں
  const search = async () => {
    setWait('مشابہ اکاؤنٹ چیک کر رہا ہے...')
    let response = await searchAccount(data.name)
    setError('')
    setSuccess('')
    setWait('')
    if (response.success) setTitle(response.accounts)
  }

  // تبدیلی کے وقت ہینڈلر
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const onChangeStatus = (selectedOption) => {
    setData({ ...data, status: selectedOption.value })
  }

  const onChangeAccountType = (selectedOption) => {
    setData({ ...data, accountType: selectedOption.value })
  }

  // فارم جمع کرنے والا ہینڈلر
  const handleSubmit = async (e) => {
    e.preventDefault()
    setWait('تجزیہ کر رہا ہے...')
    let titleChange = false
    if (data.name === location.state.name) {
      titleChange = false
    } else {
      titleChange = true
    }
    if (!idCardNumberRegex.test(data.idCard) && data.idCard !== '') {
      setError('براہ کرم درست فارمیٹ کے ساتھ شناختی کارڈ نمبر لکھیں')
    } else {
      let response = await updateAccount(
        location.state.id,
        data.name,
        data.mobileNumbers,
        data.address,
        data.guarranter,
        titleChange,
        data.idCard,
        data.status,
        data.accountType,
      )
      if (!response.success) {
        setError(response.error)
        setWait('')
      } else {
        setError('')
        setSuccess('اکاؤنٹ کامیابی کے ساتھ اپ ڈیٹ کر دیا گیا ہے')
        setWait('')
      }
    }
  }

  const addMobileNumber = () => {
    if (data.mobile !== '' && mobileNumberRegex.test(data.mobile)) {
      setData({
        ...data,
        mobileNumbers: [...data.mobileNumbers, data.mobile],
        mobile: '',
        mobileFormatError: '', // Reset mobile format error if it was previously shown
      })
    } else {
      setData({
        ...data,
        mobileFormatError: 'براہ کرم درست فارمیٹ کے ساتھ موبائل نمبر لکھیں',
      })
    }
  }

  const removeMobileNumber = (index) => {
    const updatedMobileNumbers = [...data.mobileNumbers]
    updatedMobileNumbers.splice(index, 1) // Remove the mobile number at the specified index
    setData({ ...data, mobileNumbers: updatedMobileNumbers })
  }

  const options = [
    {
      value: 'Regular',
      label: (
        <div>
          <FaCircle style={{ color: 'green' }} /> Regular
        </div>
      ),
    },
    {
      value: 'High Risk',
      label: (
        <div>
          <FaCircle style={{ color: 'yellow' }} /> High Risk
        </div>
      ),
    },
    {
      value: 'Black List',
      label: (
        <div>
          <FaCircle style={{ color: 'red' }} /> Black List
        </div>
      ),
    },
  ]

  const accountTypeOptions = [
    {
      value: 'خریدار',
      label: (
        <div>
          <FaCircle style={{ color: 'green' }} /> خریدار
        </div>
      ),
    },
    {
      value: 'فروخت کنندہ',
      label: (
        <div>
          <FaCircle style={{ color: 'blue' }} /> فروخت کنندہ
        </div>
      ),
    },
  ]

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <Link className="btn btn-primary" to="/accountbook">
            واپس
          </Link>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{location.state.name} کے اکاؤنٹ کو تازہ کرنا</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                  <p>{wait}</p>
                  <p>
                    <span style={{ color: 'red' }}>{error}</span>
                  </p>
                  <p style={{ color: 'green' }}>{success}</p>
                  {title ? title.name : ''} <br />
                  <label htmlFor="name">نام</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    value={data.name}
                    onChange={onChange}
                    onKeyUp={search}
                  />
                </div>
                <div className="col-md-12">
                  <div className="position-relative form-group mt-2">
                    <input
                      name="mobile"
                      id="mobile"
                      placeholder="موبائل نمبر لکھیں مثال کے طور پر (03XXXXXXXXX)"
                      type="text"
                      className="form-control"
                      value={data.mobile}
                      onChange={onChange}
                      autoComplete="off"
                    />
                    {data.mobileFormatError && (
                      <span style={{ color: 'red' }}>{data.mobileFormatError}</span>
                    )}
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {data.mobileNumbers &&
                        data.mobileNumbers.map((number, index) => (
                          <div key={index} className="d-flex align-items-center">
                            <div style={{ flex: 1 }}>{number}</div>
                            <button
                              className="mt-2 btn btn-sm btn-danger"
                              onClick={() => removeMobileNumber(index)}
                            >
                              ختم کریں
                            </button>
                          </div>
                        ))}
                    </div>
                    <button onClick={addMobileNumber} className="btn btn-primary mt-2">
                      موبائل نمبر شامل کریں
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">پتہ</label>
                  <textarea
                    className="form-control"
                    name="address"
                    id="address"
                    rows="3"
                    value={data.address}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guarantor">ضامن</label>
                  {guarranter ? (
                    <div onClick={copyGuarranter} className="btn btn-primary mt-2">
                      {guarranter.name}
                    </div>
                  ) : (
                    ''
                  )}
                  <input
                    type="text"
                    name="guarranter"
                    className="form-control"
                    id="guarantor"
                    value={data.guarranter}
                    onChange={onChange}
                    onKeyUp={searchGuarranter}
                  />
                </div>
                <div className="col-md-12">
                  <div className="position-relative form-group mt-2">
                    <input
                      name="idCard"
                      id="idCardNumber"
                      placeholder="شناختی کارڈ نمبر مثلا(31301-5714932-7)  ..."
                      type="text"
                      className="form-control"
                      value={data.idCard}
                      onChange={onChange}
                      autoComplete="off"
                      disabled={location.state.idCard === '' ? false : true}
                    />
                    {error && error.idCardNumber && (
                      <span style={{ color: 'red' }}>{error.idCardNumber}</span>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="position-relative form-group">
                    اکاؤنٹ کی حالت
                    <Select
                      name="status"
                      id="status"
                      value={options.find((option) => option.value === data.status)}
                      onChange={onChangeStatus}
                      options={options}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="position-relative form-group">
                    اکاؤنٹ کی قسم
                    <Select
                      name="status"
                      id="status"
                      value={accountTypeOptions.find((option) => option.value === data.accountType)}
                      onChange={onChangeAccountType}
                      options={accountTypeOptions}
                    />
                  </div>
                </div>

                <button type="submit" className="mt-2 btn btn-primary">
                  تازہ کریں
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateAccount
