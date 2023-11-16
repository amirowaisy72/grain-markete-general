import React, { useContext, useEffect, useState } from 'react'
import CashDcBook from './CashDcBook'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const CashDcCmoponent = () => {
  // اسٹیٹ فنکشنز اور ویریابلز
  const context = useContext(contextCreator)
  const { getCashDCs, cashEntries } = context

  // لوکیشن نیویگیٹر
  const location = useLocation()

  // اسٹیٹس
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // کیش انٹریز لوڈ کریں
  useEffect(() => {
    async function fetchEntries() {
      // یہاں پر آپ انتظار کر سکتے ہیں
      setLoading('انٹریز لوڈ ہو رہی ہیں...')
      await getCashDCs(location.state.cashPoint)
      // ...
      setLoading('')
    }
    fetchEntries()
  }, []) // یا [] اگر اثر پروپس یا اسٹیٹ کی ضرورت نہ ہو

  // نمونی ڈیٹا
  const data = cashEntries

  const entriesPerPage = 5

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/cashpoints/all">
            واپس
          </Link>
        </h1>
        <center>
          <h1>{location.state.cashPoint}</h1>
          <p>{loading}</p>
        </center>
        <CashDcBook data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default CashDcCmoponent
