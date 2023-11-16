import React from 'react'

function calculateExpenses(
  data,
  crop,
  totalAmount,
  completeBags,
  incompleteBags,
  isMember,
  totalWeightInKgs,
  side,
) {
  const expenses = {}
  if (
    crop !== 'Gandum' &&
    crop !== 'Kapaas' &&
    crop !== 'Sarson' &&
    crop !== 'Mirch' &&
    crop !== 'Moonji'
  ) {
    crop = 'Others'
  }

  if (data) {
    Object.keys(data).forEach((expenseType) => {
      if (data[expenseType][side]) {
        const expense = data[expenseType][side][crop]

        if (expense) {
          const formula = expense.Formula
          const info = expense.Info
          let expenseCalculated = 0

          if (typeof formula === 'object') {
            if (formula && 'CompleteBag' in formula) {
              if (completeBags !== undefined) {
                expenseCalculated = formula.CompleteBag * completeBags
              }
              if (incompleteBags !== undefined && incompleteBags !== null) {
                expenseCalculated += formula.IncompleteBag * incompleteBags
              }
            } else if (formula && 'CompleteBagMember' in formula) {
              if (isMember) {
                expenseCalculated = formula.CompleteBagMember * completeBags
              } else {
                expenseCalculated = formula.CompleteBagNonMember * completeBags
              }
            } else if (formula && 'PerMand' in formula) {
              expenseCalculated = formula.PerMand * (totalWeightInKgs / 40)
            } else if (formula && 'PerKg' in formula) {
              expenseCalculated = formula.PerKg * totalWeightInKgs
            } else {
              //
            }
          } else if (typeof formula === 'number') {
            if (info === '% of total amount') {
              expenseCalculated = (formula / 100) * totalAmount
            } else if (info === 'per Quintal (only for non-member)') {
              if (!isMember) {
                expenseCalculated = formula * (totalWeightInKgs / 100)
              }
            }
          }

          if (expenseCalculated > 0) {
            expenses[expenseType] = {
              formula:
                typeof formula === 'object'
                  ? formula
                  : typeof formula === 'number'
                  ? formula.toFixed(2)
                  : 'N/A',
              expenseCalculated,
            }
          }
        }
      }
    })
  }

  return expenses
}

export default calculateExpenses // Export the calculateExpenses function
