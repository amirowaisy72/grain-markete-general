import React, { useEffect, useState } from 'react'
import context from './contextCreator'
import PropTypes from 'prop-types' // Import PropTypes

export const AllStates = (props) => {
  //Host
  // const host = 'http://localhost:5000'
  const host = 'https://drab-erin-bee-hat.cyclic.app'
  //   const host = ""
  //States
  const [accounts, setAccounts] = useState([])
  const [originalAccounts, setOriginalAccounts] = useState([])
  const [cashPoints, setCashPoints] = useState([])
  const [dc, setDc] = useState([])
  const [cashEntries, setCashEntries] = useState([])
  const [stock, setStock] = useState([])
  const [stockEntries, setStockEntries] = useState([])

  // Function to decode the token
  const getAdminDetail = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      return ''
    }
  }

  const [firmId, setFirmId] = useState()
  // Function to generate Firm ID
  const getFirmId = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      let emailParts = payload.email.split('@')
      const firmId = emailParts[0]
      setFirmId(firmId)
    } catch (error) {
      return ''
    }
  }

  useEffect(() => {
    getFirmId()
  }, [])

  //Accounts API
  //Create Account
  const createAccount = async (
    name,
    mobileNumbers,
    address,
    guarranter,
    idCardNumber,
    status,
    accountType,
  ) => {
    const adminDetail = getAdminDetail()
    //API Call
    const response = await fetch(`${host}/accounts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        mobileNumbers,
        address,
        guarranter,
        idCardNumber,
        status,
        accountType,
        adminDetail,
        firmId,
      }),
    })
    const json = await response.json()
    return json
  }

  const getAddresses = async () => {
    const response = await fetch(`${host}/accounts/getAddresses/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.addresses
  }

  //Search account
  const searchAccount = async (name) => {
    //API Call
    const response = await fetch(`${host}/accounts/search/${name}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  // Search account locally without making API calls
  const searchAccountAll = (name) => {
    if (name === '') {
      setAccounts(originalAccounts)
    } else {
      // Case-insensitive search
      const filteredAccounts = originalAccounts.filter((account) =>
        account.name.toLowerCase().includes(name.toLowerCase()),
      )

      setAccounts(filteredAccounts)
    }
  }

  const searchByAddress = (selectedAddress) => {
    if (selectedAddress === '') {
      setAccounts(originalAccounts)
    } else {
      // Case-insensitive search
      const filteredResults = originalAccounts.filter(
        (account) =>
          account.address && account.address.toLowerCase() === selectedAddress.toLowerCase(),
      )

      setAccounts(filteredResults)
    }
  }

  //Get All Accounts
  const getAccounts = async () => {
    try {
      //API Call
      const response = await fetch(`${host}/accounts/read/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      setAccounts(json)
      setOriginalAccounts(json)
    } catch (error) {
      //
    }
  }

  //Get All Stock
  const getStocks = async () => {
    try {
      //API Call
      const response = await fetch(`${host}/stock/read/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      if (json.success) {
        setStock(json.cropQuantities)
      }
    } catch (error) {
      //
    }
  }

  //Get All Stock
  const getStockEntries = async (crop) => {
    //API Call
    const response = await fetch(`${host}/stock/entries/${crop}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    setStockEntries(json)
  }

  //Update Account
  const updateAccount = async (
    id,
    name,
    mobileNumbers,
    address,
    guarranter,
    titleChange,
    idCard,
    status,
    accountType,
  ) => {
    //API Call
    const response = await fetch(`${host}/accounts/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        mobileNumbers,
        address,
        guarranter,
        titleChange,
        idCard,
        status,
        accountType,
      }),
    })
    const json = await response.json()
    return json
  }

  //Delete service
  const deleteAccount = async (id) => {
    //API Call
    const response = await fetch(`${host}/accounts/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.success
  }

  //Delete Stock Entry
  const deleteStock = async (id) => {
    //API Call
    const response = await fetch(`${host}/stock/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.success
  }

  //Accounts API END

  //Cash Points API
  //Create Cash Point
  const createCashPoint = async (name, balance) => {
    const adminDetail = getAdminDetail()
    //API Call
    const response = await fetch(`${host}/cashpoints/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, balance, adminDetail, firmId }),
    })
    const json = await response.json()
    return json
  }

  //Search Cash Point
  const searchCashPoint = async (name) => {
    //API Call
    const response = await fetch(`${host}/cashpoints/search/${name}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  //Search All Cash Points
  const searchCashPointsAll = async (name) => {
    //API Call
    const response = await fetch(`${host}/cashpoints/searchAll/${name}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    setCashPoints(json.cashpoints)
  }

  //Get All Cash Points
  const getCashPoints = async () => {
    try {
      //API Call
      const response = await fetch(`${host}/cashpoints/read/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      setCashPoints(json)
    } catch (error) {
      //
    }
  }

  //Update a Cash Point
  const updateCashPoint = async (id, name, balance) => {
    //API Call
    const response = await fetch(`${host}/cashpoints/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, balance }),
    })
    const json = await response.json()
    return json
  }

  //Delete a Cash Point
  const deleteCashPoint = async (id) => {
    //API Call
    const response = await fetch(`${host}/cashpoints/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.success
  }

  //Cash Points API END

  //Create Debit/Credit
  const createDc = async (name, detail, amount, DbCr, selectedDate) => {
    const adminDetail = getAdminDetail()
    //API Call
    const response = await fetch(`${host}/debitcredit/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, detail, amount, DbCr, selectedDate, adminDetail, firmId }),
    })
    const json = await response.json()
    return json
  }

  //Get All Entries of an account
  const getEntries = async (name) => {
    //API Call
    const response = await fetch(`${host}/debitcredit/search/${name}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    setDc(json.dc)
  }

  //Search account for Debit/Credit
  const searchDcAccount = async (name) => {
    //API Call
    const response = await fetch(`${host}/debitcredit/searchSingle/${name}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  //Update Entry
  const updateEntry = async (id, name, detail, amount, DbCr) => {
    //API Call
    const response = await fetch(`${host}/debitcredit/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, detail, amount, DbCr }),
    })
    const json = await response.json()
    return json
  }

  //Delete Debit/Credit Entry
  const deleteDc = async (id) => {
    //API Call
    const response = await fetch(`${host}/debitcredit/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.success
  }

  //Cash Debit/Credit Create endpoint
  const createCashDc = async (
    cashPoint,
    transactionType,
    amount,
    source,
    customerName,
    description,
    selectedDate,
  ) => {
    const adminDetail = getAdminDetail()
    //API Call
    const response = await fetch(`${host}/cashdebitcredit/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cashPoint,
        transactionType,
        amount,
        source,
        customerName,
        description,
        selectedDate,
        adminDetail,
        firmId,
      }),
    })
    const json = await response.json()
    return json
  }

  //Cash Debit/Credit read endpoint
  //Get All Cash Points
  const getCashDCs = async (cashPoint) => {
    //API Call
    const response = await fetch(`${host}/cashdebitcredit/read/${cashPoint}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    setCashEntries(json)
  }

  //Delete a Cash Debit/Credit Entry
  const deleteCashDC = async (id, cashPoint) => {
    //API Call
    const response = await fetch(`${host}/cashdebitcredit/delete/${id}/${cashPoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  //Stock endpoints start from here
  const getStock = async (crop) => {
    const response = await fetch(`${host}/stock/quantity/${crop}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  //Get others crops names
  const getOthers = async () => {
    try {
      const response = await fetch(`${host}/stock/getOthers/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      return json
    } catch (error) {
      //
    }
  }

  //Invoice operations start
  //createOnlySeller create operation
  const createOnlySeller = async (
    customer,
    crop,
    quantity,
    rate,
    totalAmount,
    calculatedExpenses,
    totalPayableAmount,
    weightStatement,
  ) => {
    const adminDetail = getAdminDetail()
    const response = await fetch(`${host}/invoice/createOnlySeller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer,
        crop,
        quantity,
        rate,
        totalAmount,
        calculatedExpenses,
        totalPayableAmount,
        weightStatement,
        adminDetail,
        firmId,
      }),
    })
    const json = await response.json()
    return json
  }

  //createBuyerSeller create operation
  const createBuyerSeller = async (allInvoices) => {
    const adminDetail = getAdminDetail()
    const response = await fetch(`${host}/invoice/createBuyerSeller`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        allInvoices,
        adminDetail,
        firmId,
      }),
    })
    const json = await response.json()
    return json
  }

  //Create Stock Manual
  const createStockManual = async (crop, inout, quantity, description) => {
    const adminDetail = getAdminDetail()
    //API Call
    const response = await fetch(`${host}/stock/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ crop, inout, quantity, description, adminDetail, firmId }),
    })
    const json = await response.json()
    return json
  }

  //Dashboar API's Start
  //States about Dashboard
  const [dashboardAccounts, setDashboardAccounts] = useState({})
  const [timeline, setTimeLine] = useState([])
  //Get others crops names
  const accountsBlock = async () => {
    try {
      const response = await fetch(`${host}/accounts/accountsBlock/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      setDashboardAccounts(json)
    } catch (error) {
      //
    }
  }

  //Timeline
  const getTimeline = async () => {
    const response = await fetch(`${host}/todaytimeline/read/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    setTimeLine(json)
  }

  //Update
  const [expenses, setExpenses] = useState({})
  const getExpenseFormulas = async () => {
    try {
      const response = await fetch(`${host}/expenseFormulas/read/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      setExpenses(json.expense)
      return json
    } catch (error) {
      //
    }
  }

  //Update API
  const updateExpenseFormulas = async ({ expenses }) => {
    //API Call
    const response = await fetch(`${host}/expenseFormulas/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses, firmId }),
    })
    const json = await response.json()
    return json
  }

  //Admin Roles
  //Email confirmation
  const emailConfirmation = async (email) => {
    const response = await fetch(`${host}/adminRoles/emailVarification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    const json = await response.json()
    return json
  }

  //Email confirmation for login page
  const emailConfirmationLogin = async (email) => {
    const response = await fetch(`${host}/adminRoles/emailVarificationLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, firmId }),
    })
    const json = await response.json()
    return json
  }

  //Create Admin
  const createAdmin = async (username, email, password) => {
    const response = await fetch(`${host}/adminRoles/createAdmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
    const json = await response.json()
    return json
  }

  //Login Admin
  const loginAdmin = async (email, password) => {
    const response = await fetch(`${host}/adminRoles/loginAdmin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    const json = await response.json()
    return json
  }

  //Change Password
  const changePassword = async (email, password) => {
    const response = await fetch(`${host}/adminRoles/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    const json = await response.json()
    return json
  }

  //get all accountants waiting for Admin
  const getAccountants = async () => {
    const response = await fetch(`${host}/adminRoles/getAccountants/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.accountants
  }

  //Update admin as accountant
  const updateAccountant = async (id) => {
    //API Call
    const response = await fetch(`${host}/adminRoles/updateAccountant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    const json = await response.json()
    return json
  }

  //Delete admin as accountant
  const deleteAccountant = async (id) => {
    //API Call
    const response = await fetch(`${host}/adminRoles/deleteAccountant/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    const json = await response.json()
    return json
  }

  //get all Admins
  const getAdmins = async () => {
    const response = await fetch(`${host}/adminRoles/getAdmins/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json.admins
  }

  //Update status of accountant
  const updateAccountantStatus = async (id, status) => {
    //API Call
    const response = await fetch(`${host}/adminRoles/updateAccountantStatus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    const json = await response.json()
    return json
  }

  //get all Admins
  const getStatusUpdate = async (email) => {
    const response = await fetch(`${host}/adminRoles/getStatusUpdate/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  //Get the guarrenter
  const getGuarrenty = async (customer) => {
    const response = await fetch(`${host}/accounts/guarranters/${customer}/${firmId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  const allowAccountant = async (firmId, username, password) => {
    const response = await fetch(`${host}/adminRoles/createAccountant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firmId, username, password }),
    })
    const json = await response.json()
    return json
  }

  const createExpenseSchedule = async () => {
    const response = await fetch(`${host}/expenseFormulas/createExpenseSchedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firmId }),
    })
    const json = await response.json()
    if (json.success) {
      setExpenses(json.expense)
    }
    return json
  }

  const getNewUpdate = async () => {
    const response = await fetch(`${host}/todaytimeline/getNewUpdate`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()
    return json
  }

  return (
    <>
      <context.Provider
        value={{
          accounts,
          cashPoints,
          dc,
          cashEntries,
          stock,
          stockEntries,
          dashboardAccounts,
          timeline,
          expenses,
          createAccount,
          searchAccount,
          createDc,
          searchDcAccount,
          getAccounts,
          searchAccountAll,
          updateAccount,
          deleteAccount,
          getEntries,
          updateEntry,
          deleteDc,
          createCashPoint,
          searchCashPoint,
          getCashPoints,
          searchCashPointsAll,
          updateCashPoint,
          deleteCashPoint,
          createCashDc,
          getCashDCs,
          deleteCashDC,
          getStock,
          getOthers,
          createOnlySeller,
          createBuyerSeller,
          getStocks,
          getStockEntries,
          createStockManual,
          deleteStock,
          accountsBlock,
          getTimeline,
          getExpenseFormulas,
          setExpenses,
          updateExpenseFormulas,
          emailConfirmation,
          createAdmin,
          loginAdmin,
          emailConfirmationLogin,
          changePassword,
          getAccountants,
          updateAccountant,
          deleteAccountant,
          getAdmins,
          updateAccountantStatus,
          getStatusUpdate,
          getAddresses,
          searchByAddress,
          getGuarrenty,
          allowAccountant,
          createExpenseSchedule,
          getNewUpdate,
        }}
      >
        {props.children}
      </context.Provider>
    </>
  )
}

// Define propTypes for your component
AllStates.propTypes = {
  children: PropTypes.node.isRequired, // Ensure 'children' is a required node
}

export default AllStates
