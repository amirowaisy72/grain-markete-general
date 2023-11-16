import React, { useContext, useEffect, useState } from 'react'
import Book from './Book'
import contextCreator from 'src/pages/context/contextCreator'
import { Link } from 'react-router-dom'

const Points = () => {
  // State functions and variables
  const context = useContext(contextCreator)
  const { getCashPoints, cashPoints, searchCashPointsAll } = context

  // States
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // Load Portfolio
  useEffect(() => {
    async function fetchCashPoints() {
      setLoading('کیش پوائنٹس لوڈ ہو رہے ہیں')
      await getCashPoints()
      setLoading('')
    }
    fetchCashPoints()
  }, []) // Or [] if effect doesn't need props or state

  // Sample data
  const data = cashPoints

  const entriesPerPage = 5

  const handleSearch = async (e) => {
    try {
      setWait('تلاش کر رہے ہیں...')
      await searchCashPointsAll(e.target.value)
      setWait('')
    } catch (error) {
      setWait('Some other problem occured')
    }
  }

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/#/dashboard">
            ہوم
          </Link>
        </h1>
        <center>
          <h1>تمام کیش پوائنٹس</h1>
          <p>{loading}</p>
          <input
            className="form-control mb-3"
            onKeyUp={handleSearch}
            type="text"
            placeholder="کیش پوائنٹس کو تلاش کریں..."
          />
        </center>
        <Book data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default Points
