import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const StockCreate = () => {
  const [createDone, setCreateDone] = useState(true)
  const [wait, setWait] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [otherCrop, setOtherCrop] = useState('')
  const [inOut, setInOut] = useState('Select One') // Updated default value
  const [quantity, setQuantity] = useState('')
  const [availableStock, setAvailableStock] = useState('')
  const [availableStockDescription, setAvailableStockDescription] = useState('')
  const [customCropSuggest, setCustomCropSuggest] = useState('')
  const [formErrors, setFormErrors] = useState({
    crop: false,
    otherCrop: false,
    inOut: false,
    quantity: false,
  })
  const [submitted, setSubmitted] = useState(false) // Track form submission
  const [otherCrops, setOtherCrops] = useState([])

  const context = useContext(contextCreator)
  const { getStock, getOthers, createStockManual } = context

  // Fetch other crops when the component mounts
  useEffect(() => {
    const fetchOtherCrops = async () => {
      try {
        const response = await getOthers()
        if (response.success) {
          setOtherCrops(response.otherCrops)
        } else {
          console.error('Failed to fetch other crops.')
        }
      } catch (error) {
        console.error('An error occurred while fetching other crops:', error)
      }
    }

    fetchOtherCrops()
  }, [])

  const handleCropChange = async (e) => {
    const selectedValue = e.target.value
    setSelectedCrop(selectedValue)

    if (selectedValue !== 'Deegar') {
      // Set a loading message
      setAvailableStockDescription('اس فصل کا اسٹاک دیکھا جا رہا ہے')

      try {
        console.log(selectedValue)
        const response = await getStock(selectedValue)
        if (response.success) {
          // Update available stock
          setAvailableStock(response.availableStock)
          setAvailableStockDescription(response.availableStockDescription)
        } else {
        }
      } catch (error) {
        console.error('نیٹ ورک میں مسئلہ آگیا ہے')
      }
    } else {
      // Clear the loading message
      setWait('')
    }
  }

  const handleQuantityChange = (e) => {
    const enteredQuantity = e.target.value
    if (inOut === 'Out') {
      if (enteredQuantity <= availableStock) {
        setQuantity(enteredQuantity)
      } else {
        //
      }
    } else {
      setQuantity(enteredQuantity)
    }
  }

  const handleOtherCrop = async (e) => {
    setOtherCrop(e.target.value)
  }

  const handleCreateManual = async (e) => {
    e.preventDefault()
    let cropName = ''
    try {
      if (selectedCrop === 'Deegar') {
        cropName = otherCrop
      } else {
        cropName = selectedCrop
      }
      setWait('انٹری ہو رہی ہے۔انتظار فرمائیں')
      setCreateDone(false)
      const response = await createStockManual(cropName, inOut, quantity, 'دستی اندراج')
      setCreateDone(true)
      setWait('انٹری کامیابی سے ہو چکی ہے')
      setSelectedCrop('')
      setOtherCrop('')
      setInOut('Select One')
      setQuantity('')
      setAvailableStock('')
      setAvailableStockDescription('')
      setCustomCropSuggest('')
    } catch (error) {
      setWait('Some other problem occured')
    }
  }

  return (
    <div className="container mt-5">
      <Link className="btn btn-primary" to="/dashboard">
        ڈیش بورڈ
      </Link>
      <h2>اسٹاک فارم</h2>
      <form autoComplete="off">
        <div className={`mb-3 ${formErrors.crop && submitted ? 'has-error' : ''}`}>
          <label htmlFor="cropSelect" className="form-label">
            فصل کا نام منتخب کریں:
          </label>
          <label className="mx-5">{availableStockDescription}</label>
          <select
            id="cropSelect"
            className={`form-select ${formErrors.crop && submitted ? 'is-invalid' : ''}`}
            value={selectedCrop}
            onChange={handleCropChange}
          >
            <option value="Select One">کوئی ایک چنیں</option>
            {otherCrops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
            <option value="Gandum">گندم</option>
            <option value="Kapaas">کپاس</option>
            <option value="Sarson">سرسوں</option>
            <option value="Mirch">مرچ</option>
            <option value="Moonji">مونجھی</option>
            <option value="Deegar">دیگر</option>
          </select>
          {formErrors.crop && submitted && (
            <div className="invalid-feedback">براہ کرم فصل منتخب کریں </div>
          )}
        </div>

        {selectedCrop === 'Deegar' && (
          <div className={`mb-3 ${formErrors.otherCrop && submitted ? 'has-error' : ''}`}>
            <label htmlFor="otherCropInput" className="form-label">
              فصل کا نام لکھیں:
            </label>
            <input
              type="text"
              id="otherCropInput"
              className={`form-control ${formErrors.otherCrop && submitted ? 'is-invalid' : ''}`}
              value={otherCrop}
              onChange={handleOtherCrop}
            />
            {formErrors.otherCrop && submitted && (
              <div className="invalid-feedback">براہ کرم فصل کا نام لکھیں</div>
            )}
          </div>
        )}

        <div className={`mb-3 ${formErrors.inOut && submitted ? 'has-error' : ''}`}>
          <label htmlFor="inOutSelect" className="form-label">
            ان یا آؤٹ:
          </label>
          <select
            id="inOutSelect"
            className={`form-select ${formErrors.inOut && submitted ? 'is-invalid' : ''}`}
            value={inOut}
            onChange={(e) => setInOut(e.target.value)}
          >
            <option value="Select One">کوئی ایک منتخب کریں</option>
            <option value="In">ان</option>
            <option value="Out">آؤٹ</option>
          </select>
          {formErrors.inOut && submitted && (
            <div className="invalid-feedback">Please select In or Out.</div>
          )}
        </div>

        <div className={`mb-3 ${formErrors.quantity && submitted ? 'has-error' : ''}`}>
          <label htmlFor="quantityInput" className="form-label">
            وزن (کلوگرام میں) بتائیں:
          </label>
          <input
            type="number"
            id="quantityInput"
            className={`form-control ${formErrors.quantity && submitted ? 'is-invalid' : ''}`}
            value={quantity}
            onChange={handleQuantityChange}
          />
          {formErrors.quantity && submitted && (
            <div className="invalid-feedback">Please enter a valid positive quantity.</div>
          )}
        </div>

        <div>{wait}</div>
        {inOut === 'In' && (
          <Link
            className="btn btn-primary"
            to="/invoice"
            state={{
              crop: otherCrop ? otherCrop : selectedCrop,
              quantity: quantity,
              source: 'Stock',
            }}
          >
            خریدیں
          </Link>
        )}
        {inOut === 'Out' && quantity && (
          <Link
            className="btn btn-primary"
            to="/buyer"
            state={{
              crop: otherCrop ? otherCrop : selectedCrop,
              quantity: quantity,
              source: 'Stock',
            }}
          >
            بیچیں
          </Link>
        )}
        {inOut !== 'Select One' && selectedCrop !== 'Select One' && quantity && (
          <button
            disabled={!createDone ? true : false}
            onClick={handleCreateManual}
            className=" mx-2 btn btn-success"
          >
            دستی اسٹاک ان یا آؤٹ کریں
          </button>
        )}
      </form>
    </div>
  )
}

export default StockCreate
