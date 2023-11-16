import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const EditExpenses = () => {
  const location = useLocation()

  const [expandedCategories, setExpandedCategories] = useState({})

  const toggleCategory = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }))
  }

  const renderData = (data, parentCategory = '') => {
    const excludeFields = ['_id', '__v']

    const renderCategory = (category, categoryData) => {
      if (excludeFields.includes(category)) {
        return null
      }

      const isExpanded = expandedCategories[parentCategory]

      return (
        <ul key={category}>
          <li>
            <span onClick={() => toggleCategory(category)} style={{ cursor: 'pointer' }}>
              {category}
            </span>
            {isExpanded && (
              <ul>
                {Object.keys(categoryData).map((sideType) => (
                  <li key={sideType}>
                    {sideType}
                    {categoryData[sideType] &&
                      typeof categoryData[sideType] === 'object' &&
                      renderItems(categoryData[sideType], category)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      )
    }

    const renderItems = (items, parentCategory) => {
      if (!items || typeof items !== 'object') {
        return null
      }

      const renderFormula = (formula) => {
        if (formula && typeof formula === 'object') {
          return (
            <ul>
              {Object.keys(formula).map((key) => (
                <li key={key}>
                  {key}: {formula[key]}
                </li>
              ))}
            </ul>
          )
        } else if (formula !== null) {
          return <span>{formula}</span>
        } else {
          return null
        }
      }

      const isExpanded = expandedCategories[parentCategory]

      return (
        <ul>
          {Object.keys(items).map((item) => (
            <li key={item}>
              {item}
              {isExpanded && (
                <>
                  {renderFormula(items[item]?.Formula)}
                  {items[item]?.Info && <span>Info: {items[item].Info}</span>}
                  {renderCategory(item, items[item])}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div>
        <h2>Nested Data Structure</h2>
        {renderCategory('', location.state.expenses)}
      </div>
    )
  }

  return <div>{renderData(location.state.expenses)}</div>
}

export default EditExpenses
