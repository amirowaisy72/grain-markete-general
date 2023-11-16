import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useLocation } from 'react-router-dom'
import Print from './Print'
import { useContext } from 'react'
import contextCreator from '../context/contextCreator'
import WeightManager from './WeightManager'
import calculateExpenses from './expenseCalculator'

function Invoice() {
  const location = useLocation()
  const context = useContext(contextCreator)
  const { createOnlySeller, searchAccount, getExpenseFormulas, expenses, getOthers } = context

  const [accountFound, setAccountFound] = useState(false)
  const [createDone, setCreateDone] = useState(true)
  const [suggestName, setSuggestName] = useState('')
  const [wait, setWait] = useState('')
  const [postEntryUpdate, setPostEntryUpdate] = useState('')
  const [quantityError, setQuantityError] = useState('')
  const [rateError, setRateError] = useState('')

  //WeightManager section starts
  const [weightDone, setWeightDone] = useState(false)
  const [completeBags, setCompleteBags] = useState(null)
  const [incompleteBags, setIncompleteBags] = useState(null)
  const [weightStatement, setWeightStatement] = useState('')
  const [calculatedExpenses, setCalculatedExpenses] = useState({})

  const validCrops = ['Gandum', 'Kapaas', 'Sarson', 'Mirch', 'Moonji']
  const initialCrop = location.state?.crop ? location.state.crop : ''
  let defaultCrop

  if (initialCrop === '') {
    defaultCrop = 'Select Crop'
  } else if (validCrops.includes(initialCrop)) {
    defaultCrop = initialCrop
  } else {
    defaultCrop = 'Deegar'
  }

  const [landlordName, setLandlordName] = useState(
    location.state?.account ? location.state.account : '',
  )
  const [crop, setCrop] = useState(location.state ? defaultCrop : 'Select Crop')
  const [outlistedCrops, setOutlistedCrops] = useState([])
  const [customCropName, setCustomCropName] = useState(defaultCrop === 'Deegar' ? initialCrop : '')
  const [quantity, setQuantity] = useState(location.state?.quantity ? location.state.quantity : '')
  const [rate, setRate] = useState(location.state?.rate ? location.state.rate : '')

  // Custom expense input fields state
  const [customExpenseName, setCustomExpenseName] = useState('')
  const [customExpenseFormula, setCustomExpenseFormula] = useState('')
  //State variables END

  // Fetch other crops when the component mounts
  useEffect(() => {
    const fetchOtherCrops = async () => {
      try {
        const response = await getOthers()
        if (response.success) {
          setOutlistedCrops(response.otherCrops)
        } else {
          console.error('Failed to fetch other crops.')
        }
      } catch (error) {
        console.error('An error occurred while fetching other crops:', error)
      }
    }

    fetchOtherCrops()
  }, [])

  //List of Crops
  const cropOptions = ['Select Crop', 'Gandum', 'Kapaas', 'Sarson', 'Mirch', 'Moonji', 'Deegar']

  // Function to calculate the sum of all expenseCalculated values
  const calculateTotalExpenses = (expensesList) => {
    let total = 0
    for (const expense in expensesList) {
      total += calculatedExpenses[expense].expenseCalculated
    }
    return total
  }

  //Total Variables
  const totalAmount = (quantity / 40) * rate
  const totalPayableAmount = totalAmount - calculateTotalExpenses(calculatedExpenses)

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
    } catch (error) {
      setWait(error)
    }
  }, [])

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

  // Fetch recently registered account title if it has come from a state when component mounts
  useEffect(() => {
    if (location.state) {
      if (location.state.account) {
        const fetchAccount = async () => {
          let name = location.state.account
          setLandlordName(name)
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
                    quantity: quantity,
                    rate: rate,
                    source: location.state?.source || 'Landlord',
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
                  quantity: quantity,
                  rate: rate,
                  source: location.state?.source || 'Landlord',
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

  const handleLanslordName = async (e) => {
    let name = capitalizeFirstLetter(e.target.value)
    setLandlordName(name)
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
              quantity: quantity,
              rate: rate,
              source: location.state?.source || 'Landlord',
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
            quantity: quantity,
            rate: rate,
            source: location.state?.source || 'Landlord',
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

  const handleCropChange = (e) => {
    const selectedCrop = e.target.value
    setCrop(selectedCrop)

    // If the selected crop is 'Deegar', reset the custom crop name input field
    if (selectedCrop === 'Deegar') {
      setCustomCropName('')
    }
  }

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value

    //quantity Update in new account register link
    if (!accountFound) {
      setSuggestName(
        <Link
          state={{
            account: landlordName,
            quantity: newQuantity,
            rate: rate,
            source: location.state?.source || 'Landlord',
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
    }

    setQuantity(newQuantity)

    // Step 2: Add validation function
    if (!newQuantity.match(/^\d+(\.\d{1,2})?$/)) {
      setQuantityError('براے مہربانی درست وزن بتائیں۔ جیسا کہ 100 یا 500.1')
    } else {
      setQuantityError('') // Clear the error message
    }
  }

  const handleRateChange = (e) => {
    setRate(e.target.value)

    //rate Update in new account register link
    if (!accountFound) {
      setSuggestName(
        <Link
          state={{
            account: landlordName,
            quantity: quantity,
            rate: e.target.value,
            source: location.state?.source || 'Landlord',
          }}
          className="btn btn-primary"
          to="/accounts/create"
        >
          اکاؤنٹ نہیں ملا۔ کیا آپ اس نام کے ساتھ نیا اکاؤنٹ بنانا چاہیں گے؟
        </Link>,
      )
    }

    const newRate = e.target.value
    setRate(newRate)
    // Step 2: Add validation function
    if (!newRate.match(/^\d+(\.\d{1,2})?$/)) {
      setRateError('برائے مہربانی ریٹ کا درست نمبر بتائیں۔ جیسا کہ 100 یا 500')
    } else {
      setRateError('') // Clear the error message
    }
  }

  const handleCustomCropName = (e) => {
    setCustomCropName(e.target.value)
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

  // Function to capitalize the first letter of every word
  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Function to check if all required fields are filled
  const isFormComplete = () => {
    return landlordName.trim() !== '' && crop !== 'Select Crop' && quantity !== '' && rate !== ''
  }

  //Apply all expenses automatically
  const applyExpensesAuto = () => {
    const calculations = calculateExpenses(
      expenses,
      crop === 'Deegar' ? 'Others' : crop,
      (quantity / 40) * rate,
      completeBags,
      incompleteBags,
      false,
      quantity,
      'Seller',
    )
    setCalculatedExpenses(calculations)
  }

  const postEntryHandler = async () => {
    try {
      setPostEntryUpdate('انٹری کی جا رہی ہے۔ برائے مہربانی انتظار فرمائیں')
      setCreateDone(false)
      const response = await createOnlySeller(
        landlordName,
        crop === 'Deegar' ? customCropName : crop, // Conditionally set crop here
        quantity,
        rate,
        totalAmount,
        calculatedExpenses,
        totalPayableAmount,
        weightStatement,
      )
      setCreateDone(true)
      if (response.success) {
        setPostEntryUpdate(response.message)
      } else {
        setPostEntryUpdate(response.error)
      }
    } catch (error) {
      setPostEntryUpdate(error.message)
    }
  }

  return (
    <div className="container mt-4">
      {location.state?.source === 'Stock' && (
        <Link className="btn btn-primary" to="/stock/inout">
          اسٹاک والے پیج پر واپس جائیں۔
        </Link>
      )}
      {(location.state?.source === 'Landlord' || !location.state) && (
        <Link className="btn btn-primary" to="/dashboard">
          ڈیش بورڈ
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
        زمیندار کا بل بنائیں
        <center>
          {location.state?.source === 'Stock' && (
            <button
              disabled={!createDone ? true : false}
              onClick={postEntryHandler}
              className={`btn btn-success ${!isFormComplete() ? 'disabled' : ''}`}
            >
              انٹری پوسٹ کر دیں
            </button>
          )}
          {(location.state?.source === 'Landlord' || !location.state) && (
            <Link
              className={`btn btn-success ${!isFormComplete() ? 'disabled' : ''}`}
              to="/buyer"
              state={{
                source: 'Landlord',
                landlordName,
                crop: crop === 'Deegar' ? customCropName : crop,
                customCropName,
                quantity,
                rate,
                calculatedExpenses,
                totalAmount,
                totalPayableAmount,
                completeBags,
                incompleteBags,
                weightStatement,
              }}
            >
              بیچ دیں
            </Link>
          )}
          {wait}
        </center>
      </h2>
      <div className="form-group">
        <button
          onClick={() => {
            if (typeof suggestName === 'string') {
              setLandlordName(suggestName)
            }
          }}
          className="btn btn-primary"
        >
          {suggestName}
        </button>
        <br />
        <label>زمیندار کا نام لکھیں</label>
        <input
          type="text"
          className="form-control"
          placeholder=""
          value={landlordName}
          onChange={handleLanslordName}
        />
      </div>
      {landlordName && (
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>فصل کا انتخاب کریں</label>
              <select
                disabled={location.state?.crop ? true : false}
                className="form-control"
                value={crop}
                onChange={handleCropChange}
              >
                {outlistedCrops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
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
                      ? 'دیگر'
                      : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {crop === 'Deegar' && (
            <div className="col-md-4">
              <div className="form-group">
                <label>نام فصل درج کریں</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="نام فصل درج کریں"
                  value={customCropName}
                  onChange={handleCustomCropName}
                />
              </div>
            </div>
          )}
          <div className="col-md-4">
            <div className="form-group">
              <label>وزن (کلو گرام) میں بتائیں</label>
              <input
                type="text"
                className={`form-control ${quantityError ? 'is-invalid' : ''}`} // Add Bootstrap's "is-invalid" class on error
                placeholder="Enter quantity"
                value={crop === 'Kapaas' ? (quantity !== '' ? quantity : 0) : quantity}
                onChange={handleQuantityChange}
                disabled={crop === 'Kapaas' ? true : false}
              />
              {/* Step 3: Display validation message */}
              {quantityError && <div className="invalid-feedback">{quantityError}</div>}
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
      {landlordName && crop !== 'Select Crop' && rate && (
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
      {landlordName && crop !== 'Select Crop' && quantity && rate && weightDone && (
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
              {expenses ? (
                Object.keys(calculatedExpenses).map((expense, index) => (
                  <tr key={index}>
                    <td>
                      {expense === 'Apply Expenses'
                        ? 'اخراجات لگائیں'
                        : expense === 'Commission'
                        ? 'کمیشن'
                        : expense === 'Mazduri'
                        ? 'مزدوری'
                        : expense === 'Mazduri Bori'
                        ? 'مکمل بوریاں'
                        : expense === 'Mazduri Tor'
                        ? 'ادھوری بوریاں'
                        : expense === 'Brokery'
                        ? 'دلالی'
                        : expense === 'Accountant'
                        ? 'منشیانہ'
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
                          {Math.round(
                            calculatedExpenses[expense].expenseCalculated,
                          ).toLocaleString()}{' '}
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
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <Link to="/expense_schedule" className="btn btn-primary">
                      آپ نے ابھی تک خرچوں کا شیڈول نہیں سیٹ کیا۔ پہلے شیڈول سیٹ کریں
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {landlordName &&
        crop !== 'Select Crop' &&
        quantity &&
        rate &&
        weightDone &&
        calculateExpenses && (
          <>
            <Print
              type="seller"
              customer={landlordName}
              crop={crop === 'Deegar' ? customCropName : crop}
              quantity={quantity}
              rate={rate}
              weightStatement={weightStatement}
              totalAmount={totalAmount}
              calculatedExpenses={calculatedExpenses}
              totalPayableAmount={totalPayableAmount}
            />
          </>
        )}
    </div>
  )
}

export default Invoice
