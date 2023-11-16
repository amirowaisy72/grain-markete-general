import React, { useContext, useEffect, useState } from 'react'
import contextCreator from '../context/contextCreator'
import { Table, Alert, Button } from 'react-bootstrap' // Import Bootstrap components
import { Link } from 'react-router-dom'
import { FaBook, FaPencilAlt, FaTrash } from 'react-icons/fa'

const ExpenseFormulas = () => {
  const context = useContext(contextCreator)
  const {
    getExpenseFormulas,
    expenses,
    setExpenses,
    updateExpenseFormulas,
    createExpenseSchedule,
  } = context
  const [wait, setWait] = useState(null)
  const [editingFormula, setEditingFormula] = useState(null) // Track which formula is being edited
  const [editingKey, setEditingKey] = useState(null) // Track which formula's specific key element is being edited. This is for objects type formulas
  const [updateEnable, setUpdateEnable] = useState(true)
  const [scheduleGenerate, setScheduleGenerate] = useState(false)

  useEffect(() => {
    try {
      async function fetchExpenseFormulas() {
        setWait('فارمولا لوڈ ہو رہے ہیں')
        const response = await getExpenseFormulas()
        if (!response.success) {
          if (response.error === 'Expense not found') {
            setScheduleGenerate(true)
          }
        }
        // Assuming response is a valid object
        // ...
        setWait('')
      }
      fetchExpenseFormulas()
    } catch (error) {
      setWait('Some other problem occurred')
    }
  }, [])

  const update = async () => {
    try {
      setWait('اپ ڈیٹ کیا جا رہا ہے')
      const response = await updateExpenseFormulas({ expenses })
      if (!response.success) {
        setWait(response.error)
      } else {
        setUpdateEnable(true)
        setWait('فارمولا کامیابی سے اپڈیٹ کر دیا گیا ہے۔')
      }
    } catch (error) {
      setWait(error)
    }
  }

  const handleEditFormula = (formulaKey, key) => {
    // Set the editingFormula state to the key of the formula being edited
    setEditingFormula(formulaKey)
    setEditingKey(key)
  }

  const handleUpdateFormula = (expenseCategory, sideType, cropName, editedValue, key) => {
    //Show Update button
    setUpdateEnable(false)

    // Create a deep copy of the expenses object
    const updatedExpenses = { ...expenses }

    // Update the formula value at the specified location
    //if it is object type Formula, use key to // Traverse through the nested structure to reach the specific property you want to update
    if (key) {
      updatedExpenses[expenseCategory][sideType][cropName].Formula[key] = editedValue
    } else {
      // No need to use key because it is not object type Formula
      updatedExpenses[expenseCategory][sideType][cropName].Formula = editedValue
    }

    // Assuming you have a setExpenses function to update the state
    setExpenses(updatedExpenses) // Ensure to spread the updatedExpenses

    // Clear the editingFormula state
    setEditingFormula(null)
  }

  const generateExpenses = async () => {
    setWait('شیڈول بنایا جا رہا ہے')
    const response = await createExpenseSchedule()
    if (response.success) {
      setWait('شیڈول بن چکا ہے۔ براہ کرم، صفحہ کو ریفریش کریں۔')
    } else {
      setWait('شیڈول بناتے ہوئے کچھ مسئلہ پیش آیا۔')
    }
  }

  const renderCropTable = (sideType) => {
    if (!expenses || !expenses.Commission || !expenses.Commission[sideType]) {
      return null
    }

    const cropNames = Object.keys(expenses.Commission[sideType])

    return (
      <Table responsive striped bordered hover key={sideType}>
        <thead>
          <tr>
            <th colSpan={cropNames.length + 1}>
              {sideType === 'Seller' ? 'زمیندار کے اخراجات' : 'خریدار کے اخراجات'}
            </th>
          </tr>
          <tr>
            <th>خرچے کا نام</th>
            {cropNames.map((cropName) => (
              <th key={cropName}>
                {cropName === 'Gandum'
                  ? 'گندم'
                  : cropName === 'Kapaas'
                  ? 'کپاس'
                  : cropName === 'Sarson'
                  ? 'سرسوں'
                  : cropName === 'Mirch'
                  ? 'مرچ'
                  : cropName === 'Moonji'
                  ? 'مونجی'
                  : cropName === 'Others'
                  ? 'دیگر'
                  : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(expenses).map((expenseCategory) => {
            if (
              !expenses[expenseCategory][sideType] ||
              !cropNames.some((cropName) => expenses[expenseCategory][sideType][cropName])
            ) {
              return null // Skip the entire row if data is not available
            }
            return (
              <tr key={expenseCategory}>
                <td>
                  {expenseCategory === 'Commission'
                    ? 'کمیشن'
                    : expenseCategory === 'Mazduri'
                    ? 'مزدوری'
                    : expenseCategory === 'Brokery'
                    ? 'دلالی'
                    : expenseCategory === 'Accountant'
                    ? 'منشیانہ'
                    : expenseCategory === 'Market Fee'
                    ? 'مارکیٹ فیس'
                    : expenseCategory === 'Sootli'
                    ? 'سوتلی'
                    : expenseCategory === 'Ghisai'
                    ? 'گھسائی'
                    : expenseCategory === 'Silai'
                    ? 'سلائی'
                    : ''}
                </td>
                {cropNames.map((cropName) => {
                  const cropData = expenses[expenseCategory][sideType][cropName]
                  const formulaKey = `${expenseCategory}_${sideType}_${cropName}`
                  if (cropData) {
                    if (cropData.Formula && typeof cropData.Formula === 'object') {
                      return (
                        <td key={cropName}>
                          <div>
                            فارمولا:
                            <ul>
                              {Object.entries(cropData.Formula).map(([key, value]) => (
                                <li key={key}>
                                  {key === 'CompleteBag'
                                    ? 'بوری'
                                    : key === 'IncompleteBag'
                                    ? 'توڑا'
                                    : key === 'PerMand'
                                    ? 'فی من'
                                    : key === 'CompleteBagMember'
                                    ? 'بوری (ممبر)'
                                    : key === 'CompleteBagNonMember'
                                    ? 'بوری (غیر ممبر)'
                                    : key === 'PerKg'
                                    ? 'فی کلو'
                                    : key}
                                  :{' '}
                                  {value ? (
                                    <>
                                      {/* Conditionally render either the formula or an input field */}
                                      {editingFormula === formulaKey && editingKey === key ? (
                                        <div>
                                          <input
                                            type="text"
                                            defaultValue={value}
                                            onBlur={(e) =>
                                              handleUpdateFormula(
                                                expenseCategory,
                                                sideType,
                                                cropName,
                                                e.target.value,
                                                key,
                                              )
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          {value}
                                          <FaPencilAlt
                                            className="mx-2 mb-2"
                                            onClick={() => handleEditFormula(formulaKey, key)}
                                          />
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    'لاگو نہیں ہوتا'
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div></div>
                        </td>
                      )
                    } else {
                      return (
                        <td key={cropName}>
                          <div>
                            فارمولا:{' '}
                            {cropData.Formula ? (
                              <>
                                {/* Conditionally render either the formula or an input field */}
                                {editingFormula === formulaKey ? (
                                  <div>
                                    <input
                                      type="text"
                                      defaultValue={cropData.Formula}
                                      onBlur={(e) =>
                                        handleUpdateFormula(
                                          expenseCategory,
                                          sideType,
                                          cropName,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  <>
                                    {cropData.Formula}
                                    <FaPencilAlt
                                      onClick={() => handleEditFormula(formulaKey)}
                                      className="mx-2 mb-2"
                                    />
                                  </>
                                )}
                              </>
                            ) : (
                              'لاگو نہیں ہوتا'
                            )}
                          </div>
                          <div>
                            {cropData.Info === '% of total amount' ? 'ٹوٹل رقم کا فیصد' : ''}
                          </div>
                        </td>
                      )
                    }
                  } else {
                    return <td key={cropName}>N/A</td>
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
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

  return (
    <div style={{ margin: '10px' }}>
      <Link className="btn btn-primary" to="/dashboard">
        ڈیش بورڈ
      </Link>
      {scheduleGenerate && (
        <button className="btn btn-primary mx-2" onClick={generateExpenses}>
          شیڈول بنائیں
        </button>
      )}

      <h2>
        خرچوں کا شیڈول
        <center>
          <button hidden={updateEnable} onClick={update} className="btn btn-success">
            اپ ڈیٹ
          </button>
        </center>
      </h2>
      {wait && <Alert variant="info">{wait}</Alert>}
      {expenses !== null && getRole() === 'Admin' && (
        <>
          {renderCropTable('Seller')}
          {renderCropTable('Buyer')}
        </>
      )}
    </div>
  )
}

export default ExpenseFormulas
