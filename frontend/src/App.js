import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import { AllStates } from './pages/context/AllStates'
import CreateAccount from './pages/accounts/CreateAccount'
import { DebitCredit } from './pages/Entries/DebitCredit'
import Accounts from './pages/accounts/AccountBook/Accounts'
import UpdateAccount from './pages/accounts/AccountBook/UpdateAccount'
import DeleteAccount from './pages/accounts/AccountBook/DeleteAccount'
import DcCmoponent from './pages/Entries/DcBook/DcCmoponent'
import CashDcCmoponent from './pages/Entries/CashDCBook/CashDcCmoponent'
import UpdateDc from './pages/Entries/DcBook/UpdateDc'
import DeleteDc from './pages/Entries/DcBook/DeleteDc'
import CreateCashPoint from './pages/cashpoints/CreateCashPoint'
import Points from './pages/cashpoints/AllPoints/Points'
import UpdatePoint from './pages/cashpoints/AllPoints/UpdatePoint'
import DeletePoint from './pages/cashpoints/AllPoints/DeletePoint'
import CashDC from './pages/Entries/cashDC/CashDC'
import UpdateCashDc from './pages/Entries/CashDCBook/UpdateCashDc'
import DeleteCashDc from './pages/Entries/CashDCBook/DeleteCashDc'
import StockCreate from './pages/stock/create/StockCreate'
// import Main from './pages/Invoice/Landlord/Main'
import Buyer from './pages/Invoice/Buyer'
import Invoice from './pages/Invoice/Invoice'
import Stocks from './pages/stock/Stock Book/Stocks'
import Entries from './pages/stock/Stock Book/Entries'
import DeleteStockEntry from './pages/stock/Stock Book/DeleteStockEntry'
import Print from './pages/Invoice/Print'
import ExpenseFormulas from './pages/expense_schedule/ExpenseFormulas'
import EditExpenses from './pages/expense_schedule/EditExpenses'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Check if localStorage is empty
const isAuthenticated = !!localStorage.getItem('token')

class App extends Component {
  render() {
    return (
      <AllStates>
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route
                exact
                path="/accounts/create"
                name="Create Account"
                element={<CreateAccount />}
              />
              <Route
                exact
                path="/cashpoints/create"
                name="Create Cash Point"
                element={<CreateCashPoint />}
              />
              <Route exact path="/cashpoints/all" name="All Cash Points" element={<Points />} />
              <Route
                exact
                path="/updateCashPoint"
                name="Update Cash Point"
                element={<UpdatePoint />}
              />
              <Route
                exact
                path="/deleteCashPoint"
                name="Delete Cash Point"
                element={<DeletePoint />}
              />
              <Route
                exact
                path="/entries/debitcredit"
                name="Debit/Credit"
                element={<DebitCredit />}
              />
              <Route
                exact
                path="/updateAccount"
                name="Update Account"
                element={<UpdateAccount />}
              />
              <Route
                exact
                path="/deleteAccount"
                name="Delete Account"
                element={<DeleteAccount />}
              />
              <Route
                exact
                path="/updatecashdc"
                name="Update Cash Entry"
                element={<UpdateCashDc />}
              />
              <Route
                exact
                path="/deleteCashDc"
                name="Delete Cash Entry"
                element={<DeleteCashDc />}
              />
              <Route exact path="/invoice" name="Create Invoice" element={<Invoice />} />
              <Route exact path="/buyer" name="Buyer Invoice" element={<Buyer />} />
              <Route exact path="/cashentries" name="Cash Entries" element={<CashDcCmoponent />} />
              <Route exact path="/entries/cashdc" name="Cash Entry" element={<CashDC />} />
              <Route exact path="/updatedc" name="Update Entry" element={<UpdateDc />} />
              <Route exact path="/deleteDc" name="Delete Entry" element={<DeleteDc />} />
              <Route exact path="/accountledger" name="Account Ledger" element={<DcCmoponent />} />
              <Route exact path="/accountbook" name="Account Book" element={<Accounts />} />
              <Route exact path="/login" name="Login Page" element={<Login />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route
                path="*"
                name="Home"
                element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" />}
              />
              {/* Stock */}
              <Route exact path="/stock/inout" name="In/Out" element={<StockCreate />} />
              <Route exact path="/stockBook" name="Stock Book" element={<Stocks />} />
              <Route exact path="/stockEntries" name="Stock Entries" element={<Entries />} />
              <Route
                exact
                path="/deleteStock"
                name="Delete Stock Entry"
                element={<DeleteStockEntry />}
              />
              <Route exact path="/printInvoice" name="Print Invoice" element={<Print />} />
              <Route
                exact
                path="/expense_schedule" // Set the path conditionally
                name="Expense Schedule Formula"
                element={<ExpenseFormulas />}
              />
              <Route
                exact
                path="/expense_edit"
                name="Expense Formulas Edit"
                element={<EditExpenses />}
              />
              {/* <Route exact path="/register" name="Register admin" element={<Register />} /> */}
            </Routes>
          </Suspense>
        </HashRouter>
      </AllStates>
    )
  }
}

export default App
