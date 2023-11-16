import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DeleteCashDc = () => {
  const context = useContext(contextCreator)
  const { deleteCashDC } = context

  // اسٹیٹس
  const [wait, setWait] = useState('تصدیقِ حذف...')

  // مقام
  const location = useLocation()

  // حذف
  const onConfirmDelete = async () => {
    setWait('حذف ہو رہا ہے...براہ کرم انتظار کریں')
    let response = await deleteCashDC(location.state.id, location.state.cashPoint)
    if (!response.success) {
      setWait(response.error)
    } else {
      setWait('براہ کرم کھاتہ بک میں بھی مطلوبہ ردو بدل کر لیں')
    }
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <Link
            className="btn btn-primary"
            to="/cashentries"
            state={{ cashPoint: location.state.cashPoint }}
          >
            واپس جائیں
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
              <p>
                کیا آپ واقعی ڈیٹیل کے ساتھ انٹری کو حذف کرنا چاہتے ہیں{' '}
                <b>{location.state.description}</b>؟
              </p>
              <div className="text-center">
                <button className="btn btn-danger mx-5 mr-3" onClick={onConfirmDelete}>
                  حذف کریں
                </button>
                <Link
                  className="btn btn-secondary"
                  to="/accountledger"
                  state={{ name: location.state.cashPoint }}
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

export default DeleteCashDc
