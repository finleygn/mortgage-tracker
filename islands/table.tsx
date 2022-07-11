/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { tw } from '@twind';

const Forms = {
  InterestRate: ({ interestRate }) => {
    const [value, setValue] = useState();
    return (
      <input name="interest_rate" type="text" inputMode="numeric" placeholder={interestRate} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  },
  RegularOverpayment: ({ amount }) => {
    const [value, setValue] = useState();
    return (
      <input name="regular_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  },
  SingleOverpayment: ({ amount }) => {
    const [value, setValue] = useState();
    return (
      <input name="single_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  }
}

const Row = ({ id, open, item, setOpen }) => {
  return (
    <Fragment>
      <tr>
        <td>
          {new Intl.DateTimeFormat("en-GB").format(new Date(item.time))}
        </td>
        <td>
          £{item.start_balance.toFixed(2)}
        </td>
        <td className={tw`text-red-500`}>
          +£{item.interest_paid.toFixed(2)}
        </td>
        <td className={tw`text-green-500`}>
          -£{item.base_payment.toFixed(2)}
        </td>
        <td className={tw`text-green-500`}>
          -£{(item.overpayment.one_time + item.overpayment.recurring).toFixed(2)}
        </td>
        <td>
          £{item.balance.toFixed(2)}
        </td>
        <td>
          <button title="overpay" className={tw`w-full bg-white text-black`} onClick={() => !open ? setOpen(id) : setOpen(undefined)}>
            {open ? "CLOSE" : "EDIT"}
          </button>
        </td>
      </tr>
      {!!open && (
        <td className={tw`ml-4 border-l p-3`} colSpan={7}>
          <form method="POST">
            <div className={tw`grid grid-cols-3 gap-5 w-full`}>
              <div>
                <p>Interest Rate</p>
                <Forms.InterestRate interestRate={item.interest_rate} />
              </div>
              <div>
                <p>Regular Overpayment</p>
                <Forms.RegularOverpayment amount={item.overpayment.recurring} />
              </div>
              <div>
                <p>Singular Overpayment</p>
                <Forms.SingleOverpayment amount={item.overpayment.one_time} />
              </div>
            </div>
            <input type="hidden" name="interval" value={id} />
            <button type="submit">Save</button>
          </form>
        </td>
      )}
    </Fragment>
  )
}

const Table = ({ timeline }) => {
  const [open, setOpen] = useState();

  return (
    <div className={tw`w-full border border-white py-3 px-4`}>
      <table className={tw`text-left w-full text-lg`}>
        <tr className={tw`border-b border-white`}>
          <th>
            Date
          </th>
          <th>
            Opening Balance
          </th>
          <th>
            Interest Paid
          </th>
          <th>
            Regular Payment
          </th>
          <th>
            Overpayment Total
          </th>
          <th>
            Closing Balance
          </th>
          <th>
            Action
          </th>
        </tr>
        {timeline.map((item, index) => (
          <Row id={index} key={index} item={item} open={open === index} setOpen={setOpen} />
        ))}
      </table>
    </div>
  )
}

export default Table;