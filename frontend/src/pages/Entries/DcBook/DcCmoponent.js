import React, { useContext, useEffect, useState } from 'react'
import DcBook from './DcBook'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DcCmoponent = () => {
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getEntries, dc, getGuarrenty } = context

  // لوکیشن نیویگیٹر
  const location = useLocation()

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    async function fetchEntries() {
      setLoading('انٹریز لوڈ ہو رہی ہیں...')
      await getEntries(location.state.name)
      setLoading('')
    }
    fetchEntries()
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  const [guarranter, setGuarrenter] = useState('')
  const [guarrenty, setGuarrenty] = useState('')

  useEffect(() => {
    async function fetchGuarrenty() {
      const response = await getGuarrenty(location.state.name)
      setGuarrenty(response.guarrantyGiven)
      setGuarrenter(response.guarrantyTaken)
    }
    fetchGuarrenty()
  }, [])

  const data = dc

  const entriesPerPage = 5

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/accountbook">
            واپس
          </Link>
        </h1>
        <center>
          <h1>{location.state.name} اکاؤنٹ</h1>
          <p>{loading}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ float: 'left' }}>گارنٹر: {guarranter}</h3>
            <h3 style={{ float: 'right' }}>گارنٹی: {guarrenty}</h3>
          </div>
        </center>
        <DcBook data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default DcCmoponent
