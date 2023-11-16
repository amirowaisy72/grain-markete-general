import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

const WeightManager = ({
  crop,
  setWeightDone,
  setCompleteBags,
  setIncompleteBags,
  completeBags,
  incompleteBags,
  setWeightStatement,
  setQuantity,
}) => {
  const [pallionCount, setPallionCount] = useState(0)
  const [pallionValues, setPallionValues] = useState([])
  const [totalWeight, setTotalWeight] = useState(0)

  // Function to handle changes in Pallion count
  const handlePallionCountChange = (e) => {
    const count = parseInt(e.target.value, 10)
    if (!isNaN(count) && count >= 0) {
      setPallionCount(count)
      setPallionValues(Array(count).fill(''))
    } else {
      setPallionCount(0)
      setPallionValues([])
    }
  }

  // Function to handle changes in Pallion values
  const handlePallionValueChange = (e, index) => {
    const newPallionValues = [...pallionValues]
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      newPallionValues[index] = newValue
      setPallionValues(newPallionValues)
      calculateTotalWeight(newPallionValues)
    }
  }

  // Function to calculate total weight
  const calculateTotalWeight = (pallionValues) => {
    const totalWeight = pallionValues.reduce((acc, value) => acc + value, 0)
    setTotalWeight(totalWeight)
  }

  // Check if all fields are filled based on the crop type
  if (
    crop === 'Gandum' ||
    crop === 'Sarson' ||
    (crop !== 'Kapaas' && crop !== 'Mirch' && crop !== 'Moonji')
  ) {
    if (completeBags) {
      setWeightDone(true)
      if (incompleteBags) {
        setWeightStatement('(بوری ' + completeBags + ') , (توڑا ' + incompleteBags + ')')
      } else {
        setWeightStatement(completeBags + ' بوری  ')
      }
      //statement = completeBags+ 'بوری اور '+
    }
  } else if (crop === 'Moonji') {
    if (completeBags) {
      setWeightDone(true)
      setWeightStatement(completeBags + ' بوری  ')
    }
  } else if (crop === 'Kapaas') {
    if (pallionCount > 0 && totalWeight > 0) {
      setWeightDone(true)
      setWeightStatement(pallionCount + ' پلی ')
      // Calculate the صافی وزن (remaining after پلی کاٹ and سانگلی کاٹ 25 گرام)
      const safiWazan =
        Math.round(totalWeight) -
        Math.round((300 * pallionCount) / 1000) -
        Math.round((totalWeight / 1000) * 25)
      setQuantity(safiWazan)
    }
  } else if (crop === 'Mirch') {
    setWeightDone(true)
  }

  return (
    <div>
      <table className="table table-bordered mt-2">
        <tbody>
          {crop === 'Gandum' ||
          crop === 'Sarson' ||
          (crop !== 'Kapaas' && crop !== 'Mirch' && crop !== 'Moonji') ? (
            <>
              <tr>
                <td>مکمل بوریوں کی تعداد</td>
                <td>
                  <input
                    onChange={(e) => {
                      setCompleteBags(e.target.value)
                    }}
                    value={completeBags}
                    type="number"
                    className="form-control"
                    placeholder=""
                  />
                </td>
              </tr>
              <tr>
                <td>نامکمل بوریوں کی تعداد</td>
                <td>
                  <input
                    onChange={(e) => {
                      setIncompleteBags(e.target.value)
                    }}
                    value={incompleteBags}
                    type="number"
                    className="form-control"
                    placeholder=""
                  />
                </td>
              </tr>
            </>
          ) : crop === 'Moonji' ? (
            <tr>
              <td>مکمل بوریوں کی تعداد</td>
              <td>
                <input
                  onChange={(e) => {
                    setCompleteBags(e.target.value)
                  }}
                  type="number"
                  value={completeBags}
                  className="form-control"
                  placeholder=""
                />
              </td>
            </tr>
          ) : crop === 'Kapaas' ? (
            <>
              <tr>
                <td>پلیوں کی تعداد لکھیں:</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder=""
                    onChange={handlePallionCountChange}
                  />
                </td>
              </tr>
              {pallionValues.map((value, index) => (
                <tr key={index}>
                  <td>پلی {index + 1}</td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <input
                        type="number"
                        className="form-control"
                        placeholder=""
                        onChange={(e) => handlePallionValueChange(e, index)}
                      />
                      <span style={{ marginLeft: '5px' }}>کلوگرام</span>
                    </div>
                  </td>
                </tr>
              ))}
              {crop === 'Kapaas' &&
                pallionCount > 0 &&
                pallionValues.every((value) => value !== '') && (
                  <>
                    <tr>
                      <td>
                        <hr />
                      </td>
                      <td>
                        <hr />
                      </td>
                    </tr>
                    <tr>
                      <td>مجموع وزن:</td>
                      <td>{Math.round(totalWeight)} کلوگرام</td>
                    </tr>
                    <tr>
                      <td>پلی کاٹ</td>
                      <td>{Math.round((300 * pallionCount) / 1000)} کلوگرام</td>
                    </tr>
                    <tr>
                      <td>
                        <hr />
                      </td>
                      <td>
                        <hr />
                      </td>
                    </tr>
                    <tr>
                      <td>سانگلی کاٹ 25 گرام</td>
                      <td>{Math.round((totalWeight / 1000) * 25)} کلوگرام</td>
                    </tr>
                    <tr>
                      <td>
                        <hr />
                      </td>
                      <td>
                        <hr />
                      </td>
                    </tr>
                    <tr>
                      <td>صافی وزن</td>
                      <td>
                        {Math.round(totalWeight) -
                          Math.round((300 * pallionCount) / 1000) -
                          Math.round((totalWeight / 1000) * 25)}{' '}
                        کلوگرام
                      </td>
                    </tr>
                  </>
                )}
            </>
          ) : (
            <tr>
              <td></td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

WeightManager.propTypes = {
  crop: PropTypes.string.isRequired,
  setWeightDone: PropTypes.func.isRequired,
  setCompleteBags: PropTypes.func, // Define the prop without chaining
  setIncompleteBags: PropTypes.func, // Define the prop without chaining
  setWeightStatement: PropTypes.func,
  completeBags: PropTypes.number, // Validate as a number or the appropriate type
  incompleteBags: PropTypes.number, // Validate as a number or the appropriate type
  setQuantity: PropTypes.func,
}

export default WeightManager
