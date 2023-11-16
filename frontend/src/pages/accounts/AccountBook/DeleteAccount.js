import React, { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DeleteAccount = () => {
  const context = useContext(contextCreator)
  const { deleteAccount } = context

  // اسٹیٹز
  const [wait, setWait] = useState('تصدیق حذف ہو رہی ہے...')

  // موقع
  const location = useLocation()

  // حذف کرنا
  const onConfirmDelete = async () => {
    setWait('حذف ہورہا ہے... براہ کرم انتظار کریں')
    await deleteAccount(location.state.id)
    setWait('کامیابی سے حذف ہوگیا!')
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <Link className="btn btn-primary" to="/accountbook">
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
              <p>کیا آپ واقعی {location.state.name} کو حذف کرنا چاہتے ہیں؟</p>
              <div className="text-center">
                <button className="btn btn-danger mx-5 mr-3" onClick={onConfirmDelete}>
                  حذف کریں
                </button>
                <Link className="btn btn-secondary" to="/accountbook">
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

export default DeleteAccount
