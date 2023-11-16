import React, { useContext } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import contextCreator from 'src/pages/context/contextCreator'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const context = useContext(contextCreator)
  const { emailConfirmation, createAdmin } = context
  const navigate = useNavigate()

  // Step 1: Create state variables to store form data and validation errors
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [wait, setWait] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')

  // Step 2: Create a function to handle form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.username) {
      newErrors.username = 'نام ضروری ہے'
    }

    if (!formData.email) {
      newErrors.email = 'ای میل ضروری ہے'
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'غلط ای میل فارمیٹ'
      }
    }

    if (!formData.password) {
      newErrors.password = 'پاسورڈ ضروری ہے'
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'پاسورڈ مماثل نہیں ہیں'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Return true if there are no errors
  }

  // Step 3: Create an onChange handler for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Step 3: Create an onClick handler for the "Create Account" button
  const handleCreateAccount = async () => {
    if (validateForm()) {
      // All fields are valid, you can perform your API request here.
      // Comment out this section and replace it with your API call.
      setWait('ای میل چیک کی جا رہی ہے')
      try {
        const response = await emailConfirmation(formData.email)
        if (response.success) {
          setEmailSent(true)
          setGeneratedOTP(response.otp)
          setWait(
            'دئے گئے ای میل پر 6 ہندسوں پر مشتمل کوڈ بھیجا گیا ہے۔ براۓ مہربانی وہ کوڈ نیچے لکھیں',
          )
        } else {
          setWait('کچھ مسئلہ در پیش آ گیا')
        }
      } catch (error) {
        setWait('کچھ مسئلہ در پیش آ گیا')
      }
    }
  }

  //Submit OTP. Proceed to Create admin if otp matches
  const handleOtpSubmit = async () => {
    if (parseInt(otp, 10) === parseInt(generatedOTP, 10)) {
      setWait('آپ کا اکاؤنٹ بنایا جا رہا ہے۔ براہ کرم انتظار فرمائیں')
      const response = await createAdmin(formData.username, formData.email, formData.password)
      if (response.success) {
        // Store the token securely, e.g., in localStorage
        localStorage.setItem('token', response.token)
        navigate('/')
      } else {
        setWait(response.message)
      }
    } else {
      setWait('کوڈ غلط ہے')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm autoComplete="off">
                  <h1>ایڈمن </h1>
                  <p className="text-medium-emphasis">ایڈمن رجسٹریشن فارم</p>
                  <p>{wait}</p>
                  {!emailSent && (
                    <>
                      {errors.username && <div className="text-danger">{errors.username}</div>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="مکمل نام"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </CInputGroup>
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>@</CInputGroupText>
                        <CFormInput
                          placeholder="ای میل"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          autoComplete="email"
                        />
                      </CInputGroup>
                      {errors.password && <div className="text-danger">{errors.password}</div>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="پاسورڈ"
                          autoComplete="new-password"
                        />
                      </CInputGroup>
                      {errors.repeatPassword && (
                        <div className="text-danger">{errors.repeatPassword}</div>
                      )}
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          name="repeatPassword"
                          value={formData.repeatPassword}
                          onChange={handleInputChange}
                          placeholder="پاسورڈ دُہرائیں"
                          autoComplete="new-password"
                        />
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton color="success" onClick={handleCreateAccount}>
                          آگے بڑھیں
                        </CButton>
                      </div>
                      <Link to="/login">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          لاگ ان
                        </CButton>
                      </Link>
                    </>
                  )}
                  {emailSent && (
                    <>
                      <CInputGroup className="mb-4">
                        <CFormInput
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            setOtp(e.target.value)
                          }}
                          placeholder="کوڈ لکھیں"
                        />
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton color="success" onClick={handleOtpSubmit}>
                          آگے بڑھیں
                        </CButton>
                      </div>
                    </>
                  )}
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
