import React, { useContext, useState } from 'react'
import contextCreator from '../context/contextCreator'
import { Link, useLocation } from 'react-router-dom'
// Import icons for the dropdown options
import { FaCircle } from 'react-icons/fa'
import Select from 'react-select' // Import the Select component from react-select
import '../errorWait.css'
import Autosuggest from 'react-autosuggest'
import { useEffect } from 'react'

const CreateAccount = () => {
  const context = useContext(contextCreator)
  const { searchAccount, createAccount, getAddresses } = context
  const [createDone, setCreateDone] = useState(true)

  const [suggestions, setSuggestions] = useState([])
  const [addressValue, setAddressValue] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])

  useEffect(() => {
    try {
      async function fetchaddresses() {
        // setWait('فارمولا لوڈ ہو رہے ہیں')
        const response = await getAddresses()
        setAddressSuggestions(response)
        // Assuming response is a valid object
        // ...
        // setWait('')
      }
      fetchaddresses()
    } catch (error) {}
  }, [])

  const getSuggestions = (value) => {
    if ((value === '' && addressValue === 'All') || addressValue === '') {
      setSuggestions(addressSuggestions)
    } else {
      const filteredSuggestions = (addressSuggestions || []).filter(
        (suggestion) =>
          suggestion.name && suggestion.name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
    }
  }

  const onAddressChange = (event, { newValue }) => {
    setAddressValue(newValue)
    setDetail({ ...detail, address: newValue }) // Update detail.address on every change
  }

  const onAddressSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value)
  }

  const onAddressSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const onAddressSuggestionSelected = (event, { suggestion }) => {
    setDetail({ ...detail, address: suggestion.name })
  }

  const renderAddressSuggestion = (suggestion) => (
    <div style={{ border: '1px solid blue', padding: '5px', margin: '5px', borderRadius: '5px' }}>
      {suggestion.name}
    </div>
  )

  const inputProps = {
    placeholder: 'مکمل پتہ...',
    value: addressValue,
    onChange: onAddressChange,
    className: 'form-control', // Bootstrap form control class
    onFocus: () => {
      setAddressValue('All')
      getSuggestions('')
    },
  }

  const mobileNumberRegex = /^03[0-9]{9}$/
  const idCardNumberRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/

  const search = async () => {
    setError('')
    setWait('مشابہ اکاؤنٹ چیک کر رہا ہے...')
    try {
      let data = await searchAccount(detail.name)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success) setTitle(data.accounts)
    } catch (error) {
      setError('s')
      setWait('')
    }
  }

  const addMobileNumber = () => {
    if (detail.mobile !== '' && mobileNumberRegex.test(detail.mobile)) {
      setDetail({
        ...detail,
        mobileNumbers: [...detail.mobileNumbers, detail.mobile],
        mobile: '',
        mobileFormatError: '', // Reset mobile format error if it was previously shown
      })
    } else {
      setDetail({
        ...detail,
        mobileFormatError: 'براہ کرم درست فارمیٹ کے ساتھ موبائل نمبر لکھیں',
      })
    }
  }

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const location = useLocation()

  const account = location.state?.account ? location.state.account : null

  const [detail, setDetail] = useState({
    name: account ? account : '',
    mobile: '',
    address: '',
    guarranter: '',
    mobileNumbers: [], // Array to store multiple mobile numbers
    idCardNumber: '', // ID card number field
    status: 'Regular',
    accountType: 'خریدار',
  })

  const [titleRegistered, setTitleRegistered] = useState(detail.name)
  const [title, setTitle] = useState({})
  const [wait, setWait] = useState('')
  const [error, setError] = useState()
  const [success, setSuccess] = useState('')
  const [guarranter, setGuarranter] = useState({})

  const onChange = (e) => {
    if (e.target.name === 'name' || e.target.name === 'address') {
      setDetail({ ...detail, [e.target.name]: capitalizeWords(e.target.value) })
    } else {
      setDetail({ ...detail, [e.target.name]: e.target.value })
    }

    //Update title registered
    if (e.target.name === 'name') {
      setTitleRegistered(e.target.value)
    }
  }

  const onChangeStatus = (selectedOption) => {
    setDetail({ ...detail, status: selectedOption.value })
  }

  const onChangeAccountType = (selectedOption) => {
    setDetail({ ...detail, accountType: selectedOption.value })
  }

  const handleClick = async () => {
    setWait('تجزیہ کر رہا ہے...')

    try {
      if (
        detail.name === '' ||
        detail.address === '' ||
        detail.status === ''
        // Validate the ID card number format
      ) {
        setError('اکاؤنٹ ٹائٹل اور مکمل پتہ والے خانے ضروری ہیں۔')
        setWait('')
      } else if (!idCardNumberRegex.test(detail.idCardNumber) && detail.idCardNumber !== '') {
        setError('براہ کرم درست فارمیٹ کے ساتھ شناختی کارڈ نمبر لکھیں')
      } else {
        setCreateDone(false)
        let trimmedName = detail.name.trim() // Remove leading and trailing spaces
        let trimmedAddress = detail.address.trim()
        let response = await createAccount(
          trimmedName,
          detail.mobileNumbers,
          trimmedAddress,
          detail.guarranter,
          detail.idCardNumber,
          detail.status,
          detail.accountType,
        )
        setCreateDone(true)
        if (!response.success) {
          setError(response.error)
        } else {
          setTitleRegistered(detail.name)
          setWait('اکاؤنٹ کامیابی سے بنا دیا گیا')
          setError('')
          setDetail({
            name: '',
            mobile: '',
            address: '',
            guarranter: '',
            mobileNumbers: [],
            idCardNumber: '',
          })
          setAddressValue('')
        }
      }
    } catch (error) {
      setError(error)
      setWait('')
    }
  }

  const searchGuarranter = async () => {
    setWait('گارنٹر اکاؤنٹ تلاش کر رہا ہے...')
    try {
      let data = await searchAccount(detail.guarranter)
      setError('')
      setSuccess('')
      setWait('')
      if (data.success) setGuarranter(data.accounts)
    } catch (error) {
      setError('')
      setWait('')
    }
  }

  const copyGuarranter = () => {
    setDetail({ ...detail, guarranter: guarranter.name })
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
    <div className="mx-2 app-container app-theme-white body-tabs-shadow">
      <p className={`error-message ${error ? 'active' : ''}`}>{error}</p>
      <p className={`wait-message ${wait ? 'active' : ''}`}>{wait}</p>
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
                        {(location.state?.source === 'Landlord' ||
                          location.state?.source === 'Stock') &&
                          !location.state?.sourceBuyer && (
                            <Link
                              state={{
                                account: titleRegistered,
                                quantity: location.state.quantity,
                                rate: location.state?.rate,
                                source: location.state.source,
                              }}
                              className="mx-2 btn btn-primary"
                              to="/invoice"
                            >
                              زمیندار
                            </Link>
                          )}
                        {location.state?.sourceBuyer && (
                          <Link
                            state={{
                              account: titleRegistered,
                              member: location.state.member,
                              quantity: location.state.quantity,
                              rate: location.state?.rate,
                              source: location.state.source,
                              crop: location.state.crop,
                              landlordName: location.state.landlordName,
                              customCropName: location.state.customCropName,
                              calculatedExpenses: location.state.calculatedExpenses,
                              totalAmount: location.state.totalAmount,
                              totalPayableAmount: location.state.totalPayableAmount,
                              completeBags: location.state.completeBags,
                              incompleteBags: location.state.incompleteBags,
                              weightStatement: location.state.weightStatement,
                              buyerInvoices: location.state.buyerInvoices,
                            }}
                            className="mx-2 btn btn-primary"
                            to="/buyer"
                          >
                            خریدار
                          </Link>
                        )}
                      </h1>
                      <h4 className="mt-2">
                        <div>خوش آمدید،</div>
                        <span>
                          ایک نیا اکاؤنٹ بنانے میں صرف{' '}
                          <span className="text-success">چند سیکنڈ</span> کا وقت لگے گا
                        </span>
                      </h4>
                    </h5>
                    <div className="divider row"></div>
                    <div className="form-row">
                      <div className="col-md-12">
                        <div className="position-relative form-group">
                          {title ? title.name : ''}
                          <input
                            name="name"
                            id="name"
                            placeholder="اکاؤنٹ ٹائٹل..."
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
                            name="mobile"
                            id="mobile"
                            placeholder="موبائل نمبر لکھیں مثال کے طور پر (03XXXXXXXXX)"
                            type="text"
                            className="form-control"
                            value={detail.mobile}
                            onChange={onChange}
                            autoComplete="off"
                          />
                          {/* Show mobile number format error */}
                          {detail.mobileFormatError && (
                            <span style={{ color: 'red' }}>{detail.mobileFormatError}</span>
                          )}
                          {/* Allow users to input multiple mobile numbers */}
                          <button onClick={addMobileNumber} className="btn btn-primary mt-2">
                            موبائل نمبر شامل کریں
                          </button>
                          {detail.mobileNumbers &&
                            detail.mobileNumbers.map((number, index) => (
                              <div key={index}>{number}</div>
                            ))}
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="position-relative form-group mt-2">
                          <div className="position-relative form-group mt-2">
                            <Autosuggest
                              suggestions={suggestions}
                              onSuggestionsFetchRequested={onAddressSuggestionsFetchRequested}
                              onSuggestionsClearRequested={onAddressSuggestionsClearRequested}
                              getSuggestionValue={(suggestion) => suggestion.name}
                              renderSuggestion={renderAddressSuggestion}
                              onSuggestionSelected={onAddressSuggestionSelected}
                              inputProps={inputProps}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="position-relative form-group">
                          {guarranter ? (
                            <button onClick={copyGuarranter} className="btn btn-primary mt-2">
                              {guarranter.name}
                            </button>
                          ) : (
                            ''
                          )}
                          <br></br>
                          گارنٹر ٹائٹل
                          <input
                            name="guarranter"
                            id="guarranter"
                            placeholder="گارنٹر ٹائٹل..."
                            type="text"
                            className="form-control"
                            value={detail.guarranter}
                            onChange={onChange}
                            autoComplete="off"
                            onKeyUp={searchGuarranter}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="position-relative form-group mt-2">
                          <input
                            name="idCardNumber"
                            id="idCardNumber"
                            placeholder="شناختی کارڈ نمبر مثلا(31301-5714932-7)  ..."
                            type="text"
                            className="form-control"
                            value={detail.idCardNumber}
                            onChange={onChange}
                            autoComplete="off"
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
                            value={options.find((option) => option.value === detail.status)}
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
                            value={accountTypeOptions.find(
                              (option) => option.value === detail.accountType,
                            )}
                            onChange={onChangeAccountType}
                            options={accountTypeOptions}
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
                      اکاؤنٹ بنائیں
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

export default CreateAccount
