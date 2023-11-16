import React, { useContext } from 'react'
import CIcon from '@coreui/icons-react'
import './scrollbar.css'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import contextCreator from 'src/pages/context/contextCreator'
import { useState, useEffect } from 'react'
import { FaCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const WidgetsDropdown = () => {
  const context = useContext(contextCreator)
  const { accountsBlock, dashboardAccounts, getStocks, stock, getCashPoints, cashPoints } = context
  // Define showBalance state variable and setShowBalance state updater function
  const [showBalance, setShowBalance] = useState(null)

  // Fetch Accounts detail when the component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await accountsBlock()
      } catch (error) {
        //
      }
    }

    fetchAccounts()
  }, [])

  // Fetch Stock detail when the component mounts
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getStocks()
      } catch (error) {
        //
      }
    }

    fetchStock()
  }, [])

  // Fetch Cash Points detail when the component mounts
  useEffect(() => {
    const fetchCashPoints = async () => {
      try {
        const response = await getCashPoints()
      } catch (error) {
        //
      }
    }

    fetchCashPoints()
  }, [])

  const moneyFormatter = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'Invalid Amount'
    }

    // Ensure the amount is positive
    const absoluteAmount = Math.abs(amount)

    // Format the absolute amount as Pakistani currency
    const formattedAmount = absoluteAmount.toLocaleString('en-PK', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })

    return formattedAmount
  }

  return (
    <CRow>
      <CCol sm={6} lg={3} className="d-flex flex-column">
        <Link to="/accountbook" style={{ textDecoration: 'none' }}>
          <div className="widget-container">
            <CWidgetStatsA
              className="mb-4"
              color="primary"
              style={{ height: '200px', overflow: 'auto' }}
              value={
                <>
                  اکاؤنٹس
                  <span className="fs-6 fw-normal"> ({dashboardAccounts.totalAccounts})</span>
                  <br />
                  <FaCircle style={{ color: 'green', fontSize: '80%' }} />
                  <span className="fs-6 fw-normal"> ({dashboardAccounts.regularAccounts})</span>
                  <br />
                  <FaCircle style={{ color: 'yellow', fontSize: '80%' }} />
                  <span className="fs-6 fw-normal"> ({dashboardAccounts.highRiskAccounts})</span>
                  <br />
                  <FaCircle style={{ color: 'red', fontSize: '80%' }} />
                  <span className="fs-6 fw-normal"> ({dashboardAccounts.blackListedAccounts})</span>
                </>
              }
              title=""
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon="cilOptions" className="text-high-emphasis-inverse" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
            />
          </div>
        </Link>
      </CCol>
      <CCol sm={6} lg={3} className="d-flex flex-column">
        <div className="widget-container">
          <CWidgetStatsA
            className="mb-4"
            color="info"
            style={{ height: '200px', overflow: 'auto' }}
            value={
              <>
                اسٹاک
                <span className="fs-6 fw-normal">
                  {stock.map((item, index) => (
                    <div key={index}>
                      <div className="d-flex justify-content-between">
                        <span style={{ float: 'left' }}>{item.quantity}</span>
                        <span className="mx-3" style={{ float: 'right' }}>
                          {item.crop === 'Select Crop'
                            ? 'کوئی ایک چنیں'
                            : item.crop === 'Gandum'
                            ? 'گندم'
                            : item.crop === 'Kapaas'
                            ? 'کپاس'
                            : item.crop === 'Sarson'
                            ? 'سرسوں'
                            : item.crop === 'Mirch'
                            ? 'مرچ'
                            : item.crop === 'Moonji'
                            ? 'مونجھی'
                            : item.crop === 'Deegar'
                            ? `دیگر (${item.crop})`
                            : item.crop}
                        </span>
                      </div>
                      <hr /> {/* Horizontal line */}
                    </div>
                  ))}
                </span>
              </>
            }
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon="cilOptions" className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
          />
        </div>
      </CCol>
      <CCol sm={6} lg={3} className="d-flex flex-column">
        <div className="widget-container">
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            style={{ height: '200px', overflow: 'auto' }}
            value={
              <>
                کیش پوائنٹس
                <span className="fs-6 fw-normal">
                  {cashPoints.map((cashPoint, index) => (
                    <div key={index}>
                      <div className="float-start">{cashPoint.name}</div>
                      <br />
                      <div
                        className=""
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onMouseDown={() => {
                          // Show the balance when mouse is pressed
                          setShowBalance(index)
                        }}
                        onMouseUp={() => {
                          // Hide the balance when mouse is released
                          setShowBalance(null)
                        }}
                        onMouseLeave={() => {
                          // Hide the balance when mouse leaves the element
                          setShowBalance(null)
                        }}
                      >
                        {showBalance === index ? 'Rs ' + moneyFormatter(cashPoint.balance) : '***'}
                      </div>
                      <div className="clearfix"></div>
                      {index < cashPoints.length - 1 && <hr />}
                    </div>
                  ))}
                </span>
              </>
            }
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon="cilOptions" className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
          />
        </div>
      </CCol>
      <CCol sm={6} lg={3} className="d-flex flex-column">
        <div className="widget-container">
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            style={{ height: '200px', overflow: 'auto' }}
            value={
              <>
                {/* 44K{' '}
                <span className="fs-6 fw-normal">
                  (-23.6% <CIcon icon="cilArrowBottom" />)
                </span> */}
              </>
            }
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon="cilOptions" className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
          />
        </div>
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
