import React, { useContext, useEffect, useState } from 'react'
import Book from './Book'
import { Link } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const Stocks = () => {
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getStocks, stock } = context

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    async function fetchStock() {
      // یہاں آپ انتظار کرسکتے ہیں
      setLoading('اسٹاک لوڈ ہو رہا ہے')
      await getStocks()
      // ...
      setLoading('')
    }
    fetchStock()
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  // نمونہ ڈیٹا
  const data = stock

  const entriesPerPage = 5

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/#/dashboard">
            ہوم
          </Link>
        </h1>
        <center>
          <h1>اسٹاک</h1>
          <p>{loading}</p>
        </center>
        <Book data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default Stocks
