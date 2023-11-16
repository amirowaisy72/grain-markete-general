import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// Function to decode the token
const getRole = () => {
  try {
    const token = localStorage.getItem('token')
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role
  } catch (error) {
    return ''
  }
}

const _nav = [
  {
    component: CNavItem,
    name: 'ڈیش بورڈ',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'نئی',
    },
  },
  {
    component: CNavGroup,
    name: 'انوائس',
    to: '/invoice',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'نیا انوائس بنائیں',
        to: '/invoice',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'کتابیں',
    to: '/accounts',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'اکاؤنٹس کتاب',
        to: '/accountbook',
      },
      {
        component: CNavItem,
        name: 'کیش کتاب',
        to: '/cashpoints/all',
      },
      {
        component: CNavItem,
        name: 'اسٹاک کتاب',
        to: '/stockBook',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'انٹریز',
    to: '/entries',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'کھاتا انٹری',
        to: '/entries/debitcredit',
      },
      {
        component: CNavItem,
        name: 'کیش انٹری',
        to: '/entries/cashdc',
      },
      {
        component: CNavItem,
        name: 'اسٹاک انٹری',
        to: '/stock/inout',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'رجسٹریشن',
    to: '/cashpoints',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'کیش پوائنٹ رجسٹریشن',
        to: '/cashpoints/create',
      },
      {
        component: CNavItem,
        name: 'اکاؤنٹ رجسٹریشن',
        to: '/accounts/create',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'خرچہ شیڈول',
    to: '/expense_schedule',
  },
  // {
  //   component: CNavGroup,
  //   name: 'بیس',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'اکسائیڈن',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'بریڈکرمب',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'کارڈز',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'کیروسل',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'کولپس',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'لسٹ گروپ',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'نیوز اور ٹیبز',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'صفحہ بندی',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'پلیس ہولڈرز',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'پوپ اوورز',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'پروگریس',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'اسپنرز',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'ٹیبلز',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'ٹول ٹپس',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'بٹنز',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'بٹنز',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'بٹن گروپس',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'ڈراپ ڈاؤنز',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'فارمز',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'فارم کنٹرول',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'سلیکٹ',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'چیکس اور ریڈیوز',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'رینج',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'انپٹ گروپ',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'فلاٹنگ لیبلز',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'لاوٹ',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'ویلیڈیشن',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'چارٹس',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'آئیکنز',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'کوریو فری',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'نئی',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'کوریو جھنڈیاں',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'کوریو برانڈز',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'نوٹیفکیشنز',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'الرٹس',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'بیجز',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'موڈل',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'ٹوسٹس',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'ویجیٹس',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'نئی',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'ایکسٹراز',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'صفحات',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'لاگ ان',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'رجسٹر',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'خرابی 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'خرابی 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'دستاویزات',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
