import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useLocation } from 'react-router-dom'
import Print from './Print'
import { useContext } from 'react'
import contextCreator from '../context/contextCreator'
import WeightManager from './WeightManager'
import calculateExpenses from './expenseCalculator'
import data from '../expense_schedule/expenseData'

function Buyer() {
  //Updated States
  const location = useLocation()
  //WeightManager section starts
  const [weightDone, setWeightDone] = useState(
    location.state && location.state.source === 'Landlord' ? true : false,
  )

  const [member, setMember] = useState(location.state?.member ? location.state.member : false)

  const [completeBags, setCompleteBags] = useState(
    location.state?.completeBags ? location.state.completeBags : null,
  )
  const [incompleteBags, setIncompleteBags] = useState(
    location.state?.incompleteBags ? location.state.incompleteBags : null,
  )
  const [weightStatement, setWeightStatement] = useState('')
  const [calculatedExpenses, setCalculatedExpenses] = useState({})
  //Updated States End

  const [createDone, setCreateDone] = useState(true)
  const context = useContext(contextCreator)
  const { createBuyerSeller, searchAccount, createStockManual, getExpenseFormulas, expenses } =
    context
  const [accountFound, setAccountFound] = useState(false)
  const [suggestName, setSuggestName] = useState('')
  const [postEntryUpdate, setPostEntryUpdate] = useState('')
  const [invoicesButtonDisabled, setInvoicesButtonDisabled] = useState('')

  // Custom expense input fields state
  const [customExpenseName, setCustomExpenseName] = useState('')
  const [customExpenseFormula, setCustomExpenseFormula] = useState('')

  //Top Inputs
  const [buyerName, setBuyerName] = useState(location.state?.account ? location.state.account : '')
  const validCrops = ['Gandum', 'Kapaas', 'Sarson', 'Mirch', 'Moonji']
  const initialCrop = location.state?.crop
  const defaultCrop = validCrops.includes(initialCrop) ? initialCrop : 'Deegar'
  const [crop, setCrop] = useState(location.state.crop)
  const [quantity, setQuantity] = useState(location.state.quantity)
  const [rate, setRate] = useState(location.state.rate)

  const [totalAmount, setTotalAmount] = useState(0)

  const [buyerInvoices, setBuyerInvoices] = useState([])

  const [remainingQuantity, setRemainingQuantity] = useState(location.state.quantity)

  const [rateError, setRateError] = useState('') // Step 1: Add error state

  const [invoices, setInvoices] = useState([])

  //State variables END

  //Handles member or not
  const handleMemberChange = (event) => {
    if (!accountFound) {
      setSuggestName(
        <Link
          state={{
            account: buyerName,
            member: event.target.checked,
            quantity: quantity,
            rate: rate,
            sourceBuyer: 'Buyer',
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
            buyerInvoices: buyerInvoices,
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
    }

    setMember(event.target.checked)
  }

  console.log(completeBags)

  //Add custom expense
  const addCustomExpense = () => {
    if (customExpenseName.trim() === '' || customExpenseFormula.trim() === '') {
      return // Don't add if name or formula is empty
    }

    // Create a new custom expense object
    const newCustomExpense = {
      formula: null, // Convert the formula to a number
      expenseCalculated: customExpenseFormula,
    }

    // Update the calculatedExpenses object with the custom expense
    const updatedCalculatedExpenses = {
      ...calculatedExpenses,
      [customExpenseName]: newCustomExpense,
    }

    // Set the state with the updated calculatedExpenses object
    setCalculatedExpenses(updatedCalculatedExpenses)

    // Clear the custom expense input fields
    setCustomExpenseName('')
    setCustomExpenseFormula('')
  }

  // Function to calculate the sum of all expenseCalculated values
  const calculateTotalExpenses = (expensesList) => {
    let total = 0
    for (const expense in expensesList) {
      total += calculatedExpenses[expense].expenseCalculated
    }
    return total
  }

  //Some variables doing dynamic things and other things as well
  const cropOptions = ['Select Crop', 'Gandum', 'Kapaas', 'Sarson', 'Mirch', 'Moonji', crop]

  const totalPayableAmount = eval(totalAmount) + eval(calculateTotalExpenses(calculatedExpenses))

  const remainingQuantityMessage =
    remainingQuantity > 0 ? `(${remainingQuantity} کلو گرام باقی بچ گئے ہیں)` : ''

  //Some dynamic things being happened
  useEffect(() => {
    const isInvoicesButtonDisabled = remainingQuantity === 0

    setInvoicesButtonDisabled(isInvoicesButtonDisabled)

    const totalAmountInRupees = (quantity / 40) * rate
    setTotalAmount(totalAmountInRupees)
  }, [quantity, rate, location.state.quantity, remainingQuantity])

  //Adds a buyer data
  const addBuyer = () => {
    if (remainingQuantity > 0) {
      const soldQuantity = parseFloat(quantity) || 0
      setRemainingQuantity((prevQuantity) => prevQuantity - soldQuantity)

      //Add buyer object in array
      const buyerInvoice = {
        customerType: 'Buyer',
        customer: buyerName,
        crop: crop === 'Deegar' ? location.state.crop : crop,
        quantity,
        weightStatement,
        rate,
        calculatedExpenses,
        totalAmount,
        totalPayableAmount,
      }

      setBuyerInvoices([...buyerInvoices, buyerInvoice])

      setBuyerName('')
      setQuantity()
      setRate(location.state.rate)
      setCalculatedExpenses({})
      setTotalAmount(0)
    }
  }

  const handleCropChange = (e) => {
    setCrop(e.target.value)
  }

  //API to extract formulas
  useEffect(() => {
    try {
      async function fetchExpenseFormulas() {
        // setWait('فارمولا لوڈ ہو رہے ہیں')
        const response = await getExpenseFormulas()
        // Assuming response is a valid object
        // ...
        // setWait('')
      }
      fetchExpenseFormulas()
    } catch (error) {}
  }, [])

  const handleQuantityChange = (e) => {
    const enteredQuantity = parseFloat(e.target.value) || 0
    if (!accountFound) {
      setSuggestName(
        <Link
          state={{
            account: buyerName,
            member: member,
            quantity: enteredQuantity,
            rate: rate,
            sourceBuyer: 'Buyer',
            source: location.state?.source || 'Landlord',
            crop: location.state.crop,
            landlordName: location.state.landlordName,
            customCropName: location.state.customCropName,
            calculatedExpenses: location.state.calculatedExpenses,
            totalAmount: location.state.totalAmount,
            totalPayableAmount: location.state.totalPayableAmount,
            completeBags: location.state.completeBags,
            incompleteBags: location.state.incompleteBags,
            weightStatement: location.state.weightStatement,
            buyerInvoices: buyerInvoices,
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
    }
    //Next Statements
    if (enteredQuantity <= remainingQuantity) {
      setQuantity(enteredQuantity)
    }
  }

  const handleRateChange = (e) => {
    setRate(e.target.value)
    const newRate = e.target.value

    //Check if account not found
    if (!accountFound) {
      setSuggestName(
        <Link
          state={{
            account: buyerName,
            member: member,
            quantity: quantity,
            rate: newRate,
            sourceBuyer: 'Buyer',
            source: location.state?.source || 'Landlord',
            crop: location.state.crop,
            landlordName: location.state.landlordName,
            customCropName: location.state.customCropName,
            calculatedExpenses: location.state.calculatedExpenses,
            totalAmount: location.state.totalAmount,
            totalPayableAmount: location.state.totalPayableAmount,
            completeBags: location.state.completeBags,
            incompleteBags: location.state.incompleteBags,
            weightStatement: location.state.weightStatement,
            buyerInvoices: buyerInvoices,
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
    }

    //Next statements
    setRate(newRate)
    // Step 2: Add validation function
    if (!newRate.match(/^\d+(\.\d{1,2})?$/)) {
      setRateError('Please enter a valid Rate Value (e.g., 100 or 100.50)')
    } else {
      setRateError('') // Clear the error message
    }
  }

  const handleRemoveExpense = (expenseName) => {
    // Create a copy of the calculatedExpenses object to avoid mutating the original state
    const updatedCalculatedExpenses = { ...calculatedExpenses }

    // Check if the expense with the given name exists in the object
    if (updatedCalculatedExpenses.hasOwnProperty(expenseName)) {
      // Remove the expense by deleting the property from the object
      delete updatedCalculatedExpenses[expenseName]

      // You may want to update your state here if necessary
      // Update the state to reflect the change
      setCalculatedExpenses(updatedCalculatedExpenses)

      // You can also call any other cleanup or update logic you need to perform
    } else {
      // Handle the case where the expense doesn't exist
      console.warn(`Expense "${expenseName}" not found in the calculatedExpenses object.`)
    }
  }

  // Function to generate and display invoices
  const generateInvoices = () => {
    // Initialize an array for all invoices
    let allInvoices = []

    // Define landlordInvoice as an empty object initially
    let landlordInvoice = {}

    if (location.state.source === 'Landlord') {
      // Generate the landlord invoice
      landlordInvoice = {
        customerType: 'Seller',
        customer: location.state.landlordName,
        crop: location.state.crop,
        quantity: location.state.quantity,
        weightStatement: location.state.weightStatement,
        rate: location.state.rate,
        calculatedExpenses: location.state.calculatedExpenses,
        totalAmount: location.state.totalAmount,
        totalPayableAmount: location.state.totalPayableAmount,
      }
      allInvoices.push(landlordInvoice)
    }

    // Add buyerInvoices to allInvoices
    allInvoices = [...allInvoices, ...buyerInvoices]

    // Set the invoices to state to display all invoices
    setInvoices(allInvoices)
  }
  // Function to capitalize the first letter of every word
  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  //Apply all expenses automatically
  const applyExpensesAuto = () => {
    try {
      console.log(expenses)
      const calculations = calculateExpenses(
        expenses,
        crop === 'Sarson' || crop === 'Mirch' || crop === 'Moonji' ? 'Others' : crop,
        (quantity / 40) * rate,
        completeBags,
        incompleteBags,
        member,
        quantity,
        'Buyer',
      )
      setCalculatedExpenses(calculations)
    } catch (error) {
      console.log('no')
    }
  }

  // Fetch recently registered account title if it has come from a state when component mounts
  useEffect(() => {
    if (location.state) {
      if (location.state.account) {
        const fetchAccount = async () => {
          let name = location.state.account
          setBuyerName(name)
          setPostEntryUpdate('مشابہ اکاؤنٹ چیک کر رہا ہے...')
          try {
            let data = await searchAccount(name)
            setPostEntryUpdate('')
            if (data.success) {
              const excludedNames = ['Commission', 'Mazduri', 'Brokery', 'Accountant', 'Market Fee']
              const displayContent = !excludedNames.includes(data.accounts.name) ? (
                data.accounts.name
              ) : (
                <></>
              )
              setSuggestName(displayContent)
              setAccountFound(true)
            } else {
              setSuggestName(
                <Link
                  state={{
                    account: name,
                    member: member,
                    quantity: quantity,
                    rate: rate,
                    sourceBuyer: 'Buyer',
                    source: location.state?.source || 'Landlord',
                    crop: location.state.crop,
                    landlordName: location.state.landlordName,
                    customCropName: location.state.customCropName,
                    calculatedExpenses: location.state.calculatedExpenses,
                    totalAmount: location.state.totalAmount,
                    totalPayableAmount: location.state.totalPayableAmount,
                    completeBags: location.state.completeBags,
                    incompleteBags: location.state.incompleteBags,
                    weightStatement: location.state.weightStatement,
                    buyerInvoices: buyerInvoices,
                  }}
                  className="btn btn-primary"
                  to="/accounts/create"
                >
                  اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
                </Link>,
              )
            }
          } catch (error) {
            setPostEntryUpdate('')
            setSuggestName(
              <Link
                state={{
                  account: name,
                  member: member,
                  quantity: quantity,
                  rate: rate,
                  sourceBuyer: 'Buyer',
                  source: location.state?.source || 'Landlord',
                  crop: location.state.crop,
                  landlordName: location.state.landlordName,
                  customCropName: location.state.customCropName,
                  calculatedExpenses: location.state.calculatedExpenses,
                  totalAmount: location.state.totalAmount,
                  totalPayableAmount: location.state.totalPayableAmount,
                  completeBags: location.state.completeBags,
                  incompleteBags: location.state.incompleteBags,
                  weightStatement: location.state.weightStatement,
                  buyerInvoices: buyerInvoices,
                }}
                className="btn btn-primary"
                to="/accounts/create"
              >
                اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
              </Link>,
            )
            setAccountFound(false)
          }
        }

        fetchAccount()
      }
    }
  }, [])

  const handleBuyerName = async (e) => {
    let name = capitalizeFirstLetter(e.target.value)
    setBuyerName(name)
    setPostEntryUpdate('مشابہ اکاؤنٹ چیک کر رہا ہے...')
    try {
      let data = await searchAccount(e.target.value)
      setPostEntryUpdate('')
      if (data.success) {
        const excludedNames = ['Commission', 'Mazduri', 'Brokery', 'Accountant', 'Market Fee']
        const displayContent = !excludedNames.includes(data.accounts.name) ? (
          data.accounts.name
        ) : (
          <></>
        )
        setSuggestName(displayContent)
        setAccountFound(true)
      } else {
        setSuggestName(
          <Link
            state={{
              account: e.target.value,
              member: member,
              quantity: quantity,
              rate: rate,
              sourceBuyer: 'Buyer',
              source: location.state?.source || 'Landlord',
              crop: location.state.crop,
              landlordName: location.state.landlordName,
              customCropName: location.state.customCropName,
              calculatedExpenses: location.state.calculatedExpenses,
              totalAmount: location.state.totalAmount,
              totalPayableAmount: location.state.totalPayableAmount,
              completeBags: location.state.completeBags,
              incompleteBags: location.state.incompleteBags,
              weightStatement: location.state.weightStatement,
              buyerInvoices: buyerInvoices,
            }}
            className="btn btn-primary"
            to="/accounts/create"
          >
            اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
          </Link>,
        )
      }
    } catch (error) {
      setPostEntryUpdate('')
      setSuggestName(
        <Link
          state={{
            account: e.target.value,
            member: member,
            quantity: quantity,
            rate: rate,
            sourceBuyer: 'Buyer',
            source: location.state?.source || 'Landlord',
            crop: location.state.crop,
            landlordName: location.state.landlordName,
            customCropName: location.state.customCropName,
            calculatedExpenses: location.state.calculatedExpenses,
            totalAmount: location.state.totalAmount,
            totalPayableAmount: location.state.totalPayableAmount,
            completeBags: location.state.completeBags,
            incompleteBags: location.state.incompleteBags,
            weightStatement: location.state.weightStatement,
            buyerInvoices: buyerInvoices,
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
      setAccountFound(false)
    }
  }

  const postEntryHandler = async () => {
    //Summarize all data
    // Initialize an array for all invoices
    let allInvoices = []

    // Define landlordInvoice as an empty object initially
    let landlordInvoice = {}

    if (location.state.source === 'Landlord') {
      // Generate the landlord invoice
      landlordInvoice = {
        customerType: 'Seller',
        customer: location.state.landlordName,
        crop: location.state.crop,
        quantity: location.state.quantity,
        weightStatement,
        rate: location.state.rate,
        calculatedExpenses: location.state.calculatedExpenses,
        totalAmount: location.state.totalAmount,
        totalPayableAmount: location.state.totalPayableAmount,
      }
      allInvoices.push(landlordInvoice)
    }

    // Add buyerInvoices to allInvoices
    allInvoices = [...allInvoices, ...buyerInvoices]

    // Set the invoices to state to display all invoices
    setInvoices(allInvoices)

    try {
      setPostEntryUpdate('انٹری کی جا رہی ہے۔ برائے مہربانی انتظار فرمائیں')
      setCreateDone(false)
      if (location.state?.source === 'Stock') {
        const sellStock = await createStockManual(
          crop,
          'Out',
          location.state.quantity,
          'اسٹاک بیچا',
        )
      }
      const response = await createBuyerSeller(allInvoices)
      if (response.success) {
        setPostEntryUpdate(response.message)
      } else {
        setPostEntryUpdate(response.error)
      }
    } catch (error) {
      setPostEntryUpdate(error.message)
    }

    setBuyerName('')
    setCrop(location.state.crop || 'Select Crop')
    setQuantity()
    setRate(location.state.rate)
    setTotalAmount(0)
  }

  return (
    <div className="container mt-4">
      {location.state?.source === 'Stock' && (
        <Link className="btn btn-primary" to="/stock/inout">
          اسٹاک والے پیج پر واپس جائیں۔
        </Link>
      )}
      {location.state?.source === 'Landlord' && (
        <Link className="btn btn-primary" to="/invoice">
          زمیندار والے پیج پر واپس جائیں
        </Link>
      )}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
        }}
      >
        {postEntryUpdate && <div className="alert alert-info">{postEntryUpdate}</div>}
      </div>
      <h2>
        خریدار کا بل بنائیں
        {/* Button to generate invoices */}
        <center>
          <button
            className="btn btn-success"
            disabled={!invoicesButtonDisabled}
            onClick={generateInvoices}
          >
            بل بنائیں
          </button>
          <button
            className="mx-5 btn btn-success"
            disabled={!invoicesButtonDisabled || !createDone}
            onClick={postEntryHandler}
          >
            انٹری پوسٹ کر دیں
          </button>
        </center>
        <button
          disabled={
            remainingQuantity <= 0 ||
            !buyerName ||
            !quantity ||
            !rate ||
            isNaN(parseFloat(quantity)) ||
            isNaN(parseFloat(rate))
              ? true
              : false
          }
          onClick={addBuyer}
          className="btn btn-success"
        >
          مکمل کریں
        </button>
        {remainingQuantityMessage}
      </h2>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <button
              onClick={() => {
                if (typeof suggestName === 'string') {
                  setBuyerName(suggestName)
                }
              }}
              className="btn btn-primary"
            >
              {suggestName}
            </button>
            <br />
            <label>خریدار کا نام لکھیں</label>
            <input
              type="text"
              className="form-control"
              placeholder=""
              value={buyerName}
              onChange={handleBuyerName}
            />
          </div>
        </div>
        <div className="col-md-6 mt-5">
          <label>ممبر</label>
          <input
            type="checkbox"
            className="form-check-input"
            checked={member}
            onChange={handleMemberChange}
            id="memberCheckbox"
          />
        </div>
      </div>
      {buyerName && (
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>
                {location.state.customCropName !== '' ? location.state.customCropName : 'فصل'}{' '}
              </label>
              <select className="form-control" value={crop} onChange={handleCropChange} disabled>
                {cropOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'Select Crop'
                      ? 'کوئی ایک چنیں'
                      : option === 'Gandum'
                      ? 'گندم'
                      : option === 'Kapaas'
                      ? 'کپاس'
                      : option === 'Sarson'
                      ? 'سرسوں'
                      : option === 'Mirch'
                      ? 'مرچ'
                      : option === 'Moonji'
                      ? 'مونجھی'
                      : option === 'Deegar'
                      ? location.state.crop
                      : location.state.crop}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>وزن (کلو گرام) میں بتائیں</label>
              <input
                disabled={location.state?.source === 'Stock' ? true : false}
                type="text"
                className="form-control"
                placeholder="Enter quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>ریٹ (فی من)</label>
              <input
                type="text"
                className={`form-control ${rateError ? 'is-invalid' : ''}`} // Add Bootstrap's "is-invalid" class on error
                placeholder="Enter rate"
                value={rate}
                onChange={handleRateChange}
              />
              {/* Step 3: Display validation message */}
              {rateError && <div className="invalid-feedback">{rateError}</div>}
            </div>
          </div>
        </div>
      )}
      {buyerName && crop !== 'Select Crop' && rate && crop !== 'Kapaas' && (
        <WeightManager
          setWeightDone={setWeightDone}
          setCompleteBags={setCompleteBags}
          setIncompleteBags={setIncompleteBags}
          completeBags={completeBags}
          incompleteBags={incompleteBags}
          setWeightStatement={setWeightStatement}
          crop={crop}
          setQuantity={setQuantity}
        />
      )}
      {buyerName && crop !== 'Select Crop' && quantity && rate && weightDone && (
        <div className="form-group">
          <label>اخراجات</label>
          <div className="d-flex">
            <button className="btn btn-primary" onClick={applyExpensesAuto}>
              خرچے لگائیں
            </button>
            {/* Custom expense input fields */}
            <input
              type="text"
              className="form-control ml-2"
              placeholder="خرچے کا نام"
              value={customExpenseName}
              onChange={(e) => setCustomExpenseName(e.target.value)}
            />
            <input
              type="text"
              className="form-control ml-2"
              placeholder="خرچے کی رقم"
              value={customExpenseFormula}
              onChange={(e) => setCustomExpenseFormula(e.target.value)}
            />
            <button className="btn btn-success" onClick={addCustomExpense}>
              اضافہ کریں
            </button>
          </div>
          <table className="table mt-2">
            <thead>
              <tr>
                <th>خرچے کا نام</th>
                <th>فارمولا</th>
                <th>قیمت</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(calculatedExpenses).map((expense, index) => (
                <tr key={index}>
                  <td>
                    {expense === 'Apply Expenses'
                      ? 'اخراجات لگائیں'
                      : expense === 'Commission'
                      ? 'کمیشن'
                      : expense === 'Mazduri'
                      ? 'مزدوری'
                      : expense === 'Market Fee'
                      ? 'مارکیٹ فیس'
                      : expense === 'Sootli'
                      ? 'سوتلی'
                      : expense === 'Ghisai'
                      ? 'گھسائی'
                      : expense}
                  </td>
                  <td>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control mr-2"
                        value={
                          typeof calculatedExpenses[expense].formula === 'object'
                            ? JSON.stringify(calculatedExpenses[expense].formula)
                            : calculatedExpenses[expense].formula
                        }
                        disabled
                      />
                    </div>
                  </td>
                  <td>
                    {calculatedExpenses[expense].expenseCalculated !== undefined && (
                      <>
                        Rs{' '}
                        {Math.round(calculatedExpenses[expense].expenseCalculated).toLocaleString()}{' '}
                        {/* Display expense amounts in rounded-off format */}
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveExpense(expense)}
                    >
                      ختم کریں
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {buyerName &&
        crop !== 'Select Crop' &&
        quantity &&
        rate &&
        weightDone &&
        calculateExpenses && (
          <Print
            customer={buyerName}
            crop={crop}
            quantity={quantity}
            rate={rate}
            totalAmount={totalAmount}
            weightStatement={weightStatement}
            calculatedExpenses={calculatedExpenses}
            totalPayableAmount={totalPayableAmount}
          />
        )}

      {/* Display invoices */}
      {invoices.length > 0 && (
        <>
          {invoices.map((invoice, index) => (
            <Print
              key={index}
              customer={invoice.customer}
              crop={invoice.crop}
              quantity={invoice.quantity}
              rate={invoice.rate}
              totalAmount={invoice.totalAmount}
              weightStatement={invoice.weightStatement}
              calculatedExpenses={invoice.calculatedExpenses}
              totalPayableAmount={invoice.totalPayableAmount}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default Buyer
