import React, { useContext, useEffect, useState } from 'react'
import StockEntries from './StockEntries'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const Entries = () => {
  const location = useLocation()
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getStockEntries, stockEntries } = context

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    async function fetchStockEntries() {
      // یہاں آپ انتظار کرسکتے ہیں
      setLoading('اسٹاک لوڈ ہو رہا ہے')
      await getStockEntries(location.state.crop)
      // ...
      setLoading('')
    }
    fetchStockEntries()
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  // نمونہ ڈیٹا
  const data = stockEntries

  const entriesPerPage = 5

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/stockBook">
            اسٹاک
          </Link>
        </h1>
        <center>
          <h1>
            {location.state.crop === 'Select Crop'
              ? 'کوئی ایک چنیں'
              : location.state.crop === 'Gandum'
              ? 'گندم'
              : location.state.crop === 'Kapaas'
              ? 'کپاس'
              : location.state.crop === 'Sarson'
              ? 'سرسوں'
              : location.state.crop === 'Mirch'
              ? 'مرچ'
              : location.state.crop === 'Moonji'
              ? 'مونجھی'
              : location.state.crop === 'Deegar'
              ? 'دیگر'
              : location.state.crop}
          </h1>
          <p>{loading}</p>
        </center>
        <StockEntries data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default Entries
