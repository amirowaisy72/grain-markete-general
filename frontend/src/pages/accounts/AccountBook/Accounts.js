import React, { useContext, useEffect, useState } from 'react'
import Book from './Book'
import { Link } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const Accounts = () => {
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getAccounts, accounts, searchAccountAll, getAddresses, searchByAddress } = context

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])

  useEffect(() => {
    try {
      async function fetchaddresses() {
        // setWait('فارمولا لوڈ ہو رہے ہیں')
        const response = await getAddresses()
        setAddressSuggestions(response)
        // Assuming response is a valid object
        // ...
        // setWait('')
      }
      fetchaddresses()
    } catch (error) {}
  }, [])

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    try {
      async function fetchAccounts() {
        // یہاں آپ انتظار کرسکتے ہیں
        setLoading('اکاؤنٹس لوڈ ہو رہے ہیں')
        await getAccounts()
        // ...
        setLoading('')
      }
      fetchAccounts()
    } catch (error) {
      setLoading('Some other problem occured')
    }
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  // نمونہ ڈیٹا
  const data = accounts

  const entriesPerPage = 5

  const handleSearch = async (e) => {
    try {
      // setLoading('تلاش کر رہا ہے...')
      await searchAccountAll(e.target.value)
      // setWait('')
    } catch (error) {
      setLoading('Some other problem occured')
    }
  }

  const handleAddressSearch = async (address) => {
    await searchByAddress(address)
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
          <h1>اکاؤنٹس کتاب</h1>
          <p>{loading}</p>
          {/* Dropdown for address suggestions */}
          <div className="row mb-3">
            <div className="col-md-6">
              <select
                className="form-control"
                onChange={(e) => handleAddressSearch(e.target.value)}
              >
                <option value="">ایڈریس کو فلٹر کریں</option>
                {addressSuggestions.map((address, index) => (
                  <option key={index} value={address.name}>
                    {address.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                onKeyUp={handleSearch}
                type="text"
                placeholder="اکاؤنٹس تلاش کریں..."
              />
            </div>
          </div>
        </center>
        <Book data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default Accounts
