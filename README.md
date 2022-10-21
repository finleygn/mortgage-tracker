# Mortgage Tracker

Needs improvement but works for my personal use for the moment

## daily interest calculation from mortgage provider (still to implement)

```
How we calculate daily interest
For each month, we look at what you owe at the very start of the month. Then we look at anything we need to add to what you owe, such as a charge, or anything you pay off, say through a monthly payment, during that month. We'll calculate your interest for the month as follows:

(what you owe at start of month) x (yearly interest rate) x (days in the month)
PLUS
(any added amount) x (yearly interest rate) x (remaining days in month, including the day of addition)
MINUS
(any payment) x (yearly interest rate) x (remaining days in month, including the day of your payment)
We divide the total figure by 365 (366 in a leap year). We do our calculation to four decimal places at each step. We round up the result to the nearest penny to give you your interest charge for the month.

For example:
Someone owes £100,000 on 1st June, and on 16th June they make a payment of £20,000. Their yearly interest rate is 6%. On that basis, we work out their interest for June as follows.
£100,000 x 6% x 30 (being the number of days in June) = £180,000.0000
£20,000 x 6% x 15 (being the number of days from 16th to 30th June) = £18,000.0000
£180,000.0000 - £18,000.0000 = £162,000.0000
£162,000.0000 / 365 = £443.8356

Total interest charge for June = £443.84

for overpayments u can just take away from the base interest rate again 
```
