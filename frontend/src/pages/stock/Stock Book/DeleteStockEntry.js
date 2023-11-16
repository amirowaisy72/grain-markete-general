import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DeleteStockEntry = () => {
  const context = useContext(contextCreator)
  const { deleteStock } = context

  // اسٹیٹز
  const [wait, setWait] = useState('تصدیق فرمائیں')

  // موقع
  const location = useLocation()

  // حذف کرنا
  const onConfirmDelete = async () => {
    setWait('انٹری ختم ہو رہی ہے')
    await deleteStock(location.state.id)
    setWait('انٹری کامیابی سے ختم ہو گئی')
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <Link
            state={{ crop: location.state.crop }}
            className="btn btn-primary"
            to="/stockEntries"
          >
            واپس
          </Link>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">{wait}</h3>
            </div>
            <div className="card-body">
              <p>کیا آپ واقعی {location.state.crop} کی اس انٹری کو ختم کرنا چاہتے ہیں؟</p>
              <div className="text-center">
                <button className="btn btn-danger mx-5 mr-3" onClick={onConfirmDelete}>
                  ختم کریں
                </button>
                <Link
                  state={{ crop: location.state.crop }}
                  className="btn btn-secondary"
                  to="/stockEntries"
                >
                  منسوخ کریں
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteStockEntry
