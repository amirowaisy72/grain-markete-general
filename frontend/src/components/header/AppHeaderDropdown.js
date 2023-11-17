import React, { useContext, useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/10.png'
import './style.css'
import contextCreator from 'src/pages/context/contextCreator'
import moment, { months } from 'moment/moment'
import { FaPencilAlt, FaTrash } from 'react-icons/fa'
import './popup.css'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const context = useContext(contextCreator)
  const {
    getAccountants,
    updateAccountant,
    deleteAccountant,
    getAdmins,
    updateAccountantStatus,
    getStatusUpdate,
    allowAccountant,
    getNewUpdate,
  } = context
  const [wait, setWait] = useState('')

  // Function to close the pop-up
  const closePopup = () => {
    setIsPopupOpen(false)
  }

  // Function to decode the token
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      return ''
    }
  }

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token')
    const decodedToken = decodeToken(token)
    const email = decodedToken.email
    const adminRole = decodedToken.role
    if (adminRole === 'Accountant') {
      const fetchStatusUpdate = async () => {
        const response = await getStatusUpdate(email)
        if (!response.active) {
          // Remove the token from localStorage (or any other storage you use)
          localStorage.removeItem('token')

          // Redirect to the login page
          navigate('/login') // Replace '/login' with the actual login route
        }
      }
      fetchStatusUpdate()
    }
  }, [])

  const [adminAccountants, setAdminAccountants] = useState([])

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token')

    // Decode the token to get the username
    if (token) {
      const decodedToken = decodeToken(token)
      setUsername(decodedToken.username)
      const adminRole = decodedToken.role

      if (adminRole === 'Admin') {
        const fetchAccountants = async () => {
          try {
            const response = await getAccountants()
            // Assuming the data returned from getAccountants is an array
            // Update the adminAccountants state with the fetched data
            setAdminAccountants(response)

            // Check if adminAccountants array's length is not zero
            if (response.length !== 0) {
              setIsPopupOpen(true)
            }
          } catch (error) {
            console.error('An error occurred while fetching other crops:', error)
          }
        }

        fetchAccountants()
      }
    }
  }, [])

  const [adminsList, setAdminsList] = useState([])
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins()
        // Assuming the data returned from getAccountants is an array
        // Update the adminAccountants state with the fetched data
        setAdminsList(response)
      } catch (error) {
        console.error('An error occurred while fetching other crops:', error)
      }
    }

    fetchAdmins()
  }, [])

  const [newUpdate, setNewUpdate] = useState({
    status: false,
    update: [],
    downloadLink: '',
  })
  useEffect(() => {
    const fetchNewUpdate = async () => {
      try {
        const response = await getNewUpdate()

        if (response.success && response.data.status) {
          const { update, downloadLink } = response.data
          setNewUpdate({
            status: true,
            update: update,
            downloadLink: downloadLink,
          })
        } else {
          setNewUpdate({
            status: false,
            update: null,
            downloadLink: '',
          })
        }
      } catch (error) {
        // Handle errors if needed
      }
    }

    fetchNewUpdate()
  }, [])

  const handleLogout = () => {
    // Remove the token from localStorage (or any other storage you use)
    localStorage.removeItem('token')

    // Redirect to the login page
    navigate('/login') // Replace '/login' with the actual login route
  }

  const handleAllow = async (id) => {
    //First run fetch API to update
    setWait('اجازت دی جا رہی ہے')
    const response = await updateAccountant(id)
    if (response.success) {
      setWait('اجازت دے دی گئی')
      const updatedAccountants = adminAccountants.filter((accountant) => accountant._id !== id)
      setAdminAccountants(updatedAccountants)
    } else {
      // setWait('کچھ مسئلہ درپیش آگیا')
      setWait(response.error)
    }
  }

  const handleDecline = async (id) => {
    //First run fetch API to delete
    setWait('مسترد کیا جا رہا ہے')
    const response = await deleteAccountant(id)
    if (response.success) {
      console.log('success')
      setWait('کامیابی سے مسترد کر دیا گیا ہے')
      const updatedAccountants = adminAccountants.filter((accountant) => accountant._id !== id)
      setAdminAccountants(updatedAccountants)
    } else {
      console.log('problem')
      // setWait('کچھ مسئلہ درپیش آگیا')
      setWait(response.message)
    }
  }

  // Function to decode the token
  const getRole = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch (error) {
      return ''
    }
  }

  // Function to Generate firm ID
  const getFirmId = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      let email = payload.email
      let emailParts = email.split('@')
      const firmId = emailParts[0]
      return firmId
    } catch (error) {
      return ''
    }
  }

  const timeEnd = Date.now()

  const dateConverter = (startDate, timeEnd, type) => {
    const newStartDate = new Date(startDate)
    const newEndDate = new Date(timeEnd)
    let result = moment(newStartDate).diff(newEndDate, type)
    return result
  }

  const timeMaker = (startDate) => {
    const years = dateConverter(startDate, timeEnd, 'years')
    const month = dateConverter(startDate, timeEnd, 'months')
    const days = dateConverter(startDate, timeEnd, 'days')
    const hours = dateConverter(startDate, timeEnd, 'hours')
    const minutes = dateConverter(startDate, timeEnd, 'minutes')
    if (years !== 0) {
      return Math.abs(years) + ' سال پہلے'
    } else if (month !== 0) {
      return Math.abs(month) + ' مہینے پہلے'
    } else if (days !== 0) {
      return Math.abs(days) + ' دن پہلے'
    } else if (hours !== 0) {
      return Math.abs(hours) + ' گھنٹے پہلے'
    } else if (minutes !== 0) {
      return Math.abs(minutes) + ' منٹ پہلے'
    } else {
      return 'ابھی ابھی'
    }
  }

  const controlStatus = async (id, status) => {
    try {
      setWait('Changing Status...')
      const response = await updateAccountantStatus(id, status)
      if (response.success) {
        let updateStatus = !status

        // Update the adminsList to reflect the change in the active field
        const updatedAdminsList = adminsList.map((admin) => {
          if (admin._id === id) {
            return { ...admin, active: updateStatus }
          }
          return admin
        })

        // Set the updated adminsList in your state
        setAdminsList(updatedAdminsList)
        setWait('Status updated successfully')
      } else {
        setWait('Status not updated')
      }
    } catch (error) {
      setWait(error)
    }
  }

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAccountant, setNewAccountant] = useState({
    firmId: getFirmId(),
    accountantName: '',
    password: '',
  })

  const handleInputChange = (field, value) => {
    setNewAccountant((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateAccountant = async () => {
    if (
      newAccountant.firmId === '' ||
      newAccountant.accountantName === '' ||
      newAccountant.password === ''
    ) {
      setWait('تمام فیلڈز پُر کریں')
    } else {
      setWait('اکاؤنٹ بنایا جا رہا ہے')
      const response = await allowAccountant(
        newAccountant.firmId,
        newAccountant.accountantName,
        newAccountant.password,
      )
      if (!response.success) {
        setWait(response.message)
      } else {
        const message = `${response.message}<br/>ای میل : ${response.accountant.email}<br/>پاسورڈ : ${response.accountant.password}`
        setWait(message)
        // After handling the creation, you might want to reset the form and hide it
        setNewAccountant({
          firmId: '',
          accountantName: '',
          password: '',
        })
        setShowCreateForm(false)
      }
    }
  }

  return (
    <div>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">{username}</CDropdownHeader>
          <CDropdownItem to="/dashboard" onClick={() => setIsPopupOpen(true)}>
            {getRole() === 'Admin' && (
              <>
                <CIcon icon={cilBell} className="me-2" />
                اکاؤنٹنٹس
                <CBadge color="info" className="ms-2">
                  {adminsList.length}
                </CBadge>
              </>
            )}
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            ان باکس
            <CBadge color="success" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilTask} className="me-2" />
            ٹاسک
            <CBadge color="danger" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilCommentSquare} className="me-2" />
            کمنٹس
            <CBadge color="warning" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilUser} className="me-2" />
            پروفائل
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilSettings} className="me-2" />
            سیٹنگز
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilCreditCard} className="me-2" />
            پیمنٹس
            <CBadge color="secondary" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilFile} className="me-2" />
            پروجیکٹس
            <CBadge color="primary" className="ms-2">
              {/* 42 */}
            </CBadge>
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            لاگ آؤٹ
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {/* Pop-up message */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <div dangerouslySetInnerHTML={{ __html: wait }} />
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            {adminAccountants.map((accountant, index) => (
              <div key={index} className="mb-3">
                <p>{accountant.username} اس سسٹم کو استعمال کرنے کی اجازت چاہتے ہیں۔</p>
                <div className="btn-group" role="group" aria-label="Allow or Decline">
                  <button className="btn btn-success" onClick={() => handleAllow(accountant._id)}>
                    اجازت دیں
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDecline(accountant._id)}>
                    مسترد کر دیں
                  </button>
                </div>
              </div>
            ))}
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>کردار</th>
                  <th>وقت</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {adminsList.map((admin, index) => (
                  <tr key={index}>
                    <td>{admin.username}</td>
                    <td>{admin.role}</td>
                    <td>{timeMaker(admin.date)}</td>
                    <td style={{ color: admin.active ? 'green' : 'red' }}>
                      {admin.active ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          controlStatus(admin._id, admin.active)
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        {admin.active ? 'Inactive' : 'Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button className="btn btn-success" onClick={() => setShowCreateForm(true)}>
                اپنے اکاؤنٹنٹ کے لئے اکاؤنٹ بنائیں
              </button>

              {showCreateForm && (
                <form>
                  <div className="form-group">
                    <label htmlFor="firmId">فرم آئی ڈی</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firmId"
                      value={newAccountant.firmId}
                      onChange={(e) => handleInputChange('firmId', e.target.value)}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="accountantName">اکاؤنٹنٹ کا نام</label>
                    <input
                      type="text"
                      className="form-control"
                      id="accountantName"
                      value={newAccountant.accountantName}
                      onChange={(e) => handleInputChange('accountantName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">پاس ورڈ</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={newAccountant.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateAccountant}
                  >
                    اکاؤنٹ بنائیں
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {newUpdate.status && (
        <div hidden={newUpdate.status ? false : true} className="popup">
          <div className="popup-content">
            <span>&times;</span>
            <p>نئی اپ ڈیٹ</p>
            <ul>
              {newUpdate.update &&
                newUpdate.update.map((item, index) => (
                  <li key={index}>
                    <strong>{item.label}:</strong> {item.content}
                  </li>
                ))}
            </ul>
            <Link to={newUpdate.downloadLink} target="_blank" className="btn btn-success">
              ڈاؤن لوڈ
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppHeaderDropdown
