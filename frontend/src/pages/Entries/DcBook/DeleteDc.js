import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DeleteDc = () => {
  const context = useContext(contextCreator)
  const { deleteDc } = context

  // حالات
  const [wait, setWait] = useState('مسح کی تصدیق...')

  // مقام
  const location = useLocation()

  // مسح کرنے کا طریقہ
  const onConfirmDelete = async () => {
    setWait('حذف ہو رہا ہے...براہ کرم انتظار کریں')
    await deleteDc(location.state.id)
    setWait('کامیابی کے ساتھ حذف ہوگیا!')
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <Link
            className="btn btn-primary"
            to="/accountledger"
            state={{ name: location.state.name }}
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
              <p>
                کیا آپ واقعی چاہتے ہیں کہ آپ ڈیٹا کی تفصیل کے ساتھ انٹری کو حذف کریں؟{' '}
                <b>{location.state.detail}</b>؟
              </p>
              <div className="text-center">
                <button className="btn btn-danger mx-5 mr-3" onClick={onConfirmDelete}>
                  حذف کریں
                </button>
                <Link
                  className="btn btn-secondary"
                  to="/accountledger"
                  state={{ name: location.state.name }}
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

export default DeleteDc
