import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import { useContext } from 'react'
import { useState } from 'react'
import contextCreator from 'src/pages/context/contextCreator'

const Login = () => {
  const context = useContext(contextCreator)
  const { loginAdmin, emailConfirmationLogin, changePassword } = context
  const navigate = useNavigate()

  // Step 1: Create state variables to store form data and validation errors
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [wait, setWait] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [newPassword, setNewPassword] = useState(false)

  // Step 2: Create a function to handle form validation
  const validateForm = () => {
    const newErrors = {}

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

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setWait('آپ کو لاگ ان کیا جا رہا ہے۔  مہربانی انتظار فرمائیں')
        const response = await loginAdmin(formData.email, formData.password)

        if (response.success) {
          // Store the token securely, e.g., in localStorage
          localStorage.setItem('token', response.token)
          // Check the user's role
          if (response.user.role === 'Admin') {
            // Redirect to the admin dashboard
            // window.location.href = '/admin-dashboard' // Replace with the actual URL of the admin dashboard/
            navigate('/')
          } else if (response.user.role === 'Accountant') {
            // Check if the user is allowed by the admin
            if (response.user.allowedByAdmin && response.user.active) {
              // Redirect to the accountant dashboard
              // window.location.href = '/accountant-dashboard' // Replace with the actual URL of the accountant dashboard
              navigate('/')
            } else {
              // Display a message indicating waiting for admin approval
              setWait('عزیز ممبر، ایڈمن آپ کی درخواست کا جائزہ لے رہے ہیں۔ براہ کرم انتظار فرمائیں')
            }
          }
        } else {
          setWait(response.message)
        }
      } catch (error) {
        setWait(error)
      }
    }
  }

  const emailConfirmation = async () => {
    // All fields are valid, you can perform your API request here.
    // Comment out this section and replace it with your API call.
    setWait('ای میل چیک کی جا رہی ہے')
    try {
      const response = await emailConfirmationLogin(formData.email)
      if (response.success) {
        setEmailSent(true)
        setGeneratedOTP(response.otp)
        setWait(
          'دئے گئے ای میل پر 6 ہندسوں پر مشتمل کوڈ بھیجا گیا ہے۔ براۓ مہربانی وہ کوڈ نیچے لکھیں',
        )
        setForgotPassword(false)
      } else {
        setWait(response.message)
      }
    } catch (error) {
      setWait('کچھ مسئلہ در پیش آ گیا')
    }
  }

  //Submit OTP. Proceed to Create admin if otp matches
  const handleOtpSubmit = async () => {
    if (parseInt(otp, 10) === parseInt(generatedOTP, 10)) {
      setNewPassword(true)
      setWait('')
      setEmailSent(true)
    } else {
      setWait('کوڈ غلط ہے')
    }
  }

  const [enterNewPassword, setEnterNewPassword] = useState('')
  const [repeatNewPassword, setRepeatNewPassword] = useState('')

  const handleNewPassword = async () => {
    if (enterNewPassword === '' || repeatNewPassword === '') {
      setWait('پاسورڈ ضروری ہے')
    } else if (enterNewPassword !== repeatNewPassword) {
      setWait('پاسورڈ مماثل نہیں ہیں')
    } else {
      setWait('آپ کا پاس ورڈ تبدیل کیا جا رہا ہے')
      const response = await changePassword(formData.email, enterNewPassword)
      if (response.success) {
        setWait('پاس ورڈ تبدیل کر دیا گیا ہے')
        setEmailSent(false)
        setForgotPassword(false)
        setNewPassword(false)
      } else {
        setWait(response.message)
      }
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <p>{wait}</p>
                    {!forgotPassword && !emailSent && (
                      <>
                        <h1>لاگ ان</h1>
                        <p className="text-medium-emphasis">اپنے اکاؤنٹ میں لاگ ان کریں</p>
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="ای میل"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                          />
                        </CInputGroup>
                        {errors.password && <div className="text-danger">{errors.password}</div>}
                        <CInputGroup className="mb-4">
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
                        <CRow>
                          <CCol xs={6}>
                            <CButton onClick={handleLogin} color="primary" className="px-4">
                              لاگ ان
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <CButton
                              onClick={() => {
                                setForgotPassword(true)
                              }}
                              color="link"
                              className="px-0"
                            >
                              پاسورڈ بھول گئے؟
                            </CButton>
                          </CCol>
                        </CRow>
                      </>
                    )}
                    {forgotPassword && (
                      <>
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            placeholder="ای میل"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                          />
                        </CInputGroup>
                        <div className="d-grid">
                          <CButton color="success" onClick={emailConfirmation}>
                            آگے بڑھیں
                          </CButton>
                        </div>
                      </>
                    )}
                    {emailSent && !newPassword && (
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
                    {newPassword && (
                      <>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            value={enterNewPassword}
                            onChange={(e) => {
                              setEnterNewPassword(e.target.value)
                            }}
                            placeholder="نیا پاس ورڈ"
                            autoComplete="new-password"
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-4">
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            type="password"
                            value={repeatNewPassword}
                            onChange={(e) => {
                              setRepeatNewPassword(e.target.value)
                            }}
                            placeholder="پاسورڈ دُہرائیں"
                            autoComplete="new-password"
                          />
                        </CInputGroup>
                        <div className="d-grid">
                          <CButton color="success" onClick={handleNewPassword}>
                            تصدیق کریں
                          </CButton>
                        </div>
                      </>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>سائن اپ</h2>
                    <p>آگر آپ نیا اکاؤنٹ رجسٹر کرنا چاہتے ہیں تو نیچے دیے گئے بٹن پر کلک کریں</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        رجسٹر کریں
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
