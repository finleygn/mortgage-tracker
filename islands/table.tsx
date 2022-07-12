/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { tw } from '@twind';

const Forms = {
  InterestRate: ({ interestRate, vOverride }) => {
    const [value, setValue] = useState(vOverride);
    return (
      <input name="interest_rate" type="text" inputMode="numeric" placeholder={interestRate} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  },
  RegularOverpayment: ({ amount, vOverride }) => {
    const [value, setValue] = useState(vOverride);
    return (
      <input name="regular_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  },
  SingleOverpayment: ({ amount, vOverride }) => {
    const [value, setValue] = useState(vOverride);
    return (
      <input name="single_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
    )
  }
}

const now = Date.now();

const Row = ({ id, open, item, setOpen }) => {
  return (
    <Fragment>
      <tr className={tw`${item.time < now ? "opacity-100" : "opacity-60"}`}>
        <td>
          {Object.values(item.frame_changes).some(v => v !== undefined) ? "x" : " "}
        </td>
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
          -£{(item.overpayment.onetime + item.overpayment.recurring).toFixed(2)}
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
        <td className={tw`ml-4 border-l p-3`} colSpan={8}>
          <form method="POST">
            <div className={tw`grid grid-cols-3 gap-5 w-full mb-2`}>
              <div>
                <p>Interest Rate {item.frame_changes.interest_rate ? "(x)" : null}</p>
                <Forms.InterestRate interestRate={item.interest_rate} vOverride={item.frame_changes.interest_rate} />
              </div>
              <div>
                <p>Regular Overpayment {item.frame_changes.overpayment_recurring ? "(x)" : null}</p>
                <Forms.RegularOverpayment amount={item.overpayment.recurring} vOverride={item.frame_changes.overpayment_recurring}/>
              </div>
              <div>
                <p>Singular Overpayment {item.frame_changes.overpayment_onetime ? "(x)" : null}</p>
                <Forms.SingleOverpayment amount={item.overpayment.onetime} vOverride={item.frame_changes.overpayment_onetime} />
              </div>
            </div>
            <input type="hidden" name="interval" value={id} />
            <input type="hidden" name="action" value="post" />
            <button type="submit" className={tw`bg-white mb-2 text-black`}>Save</button>
          </form>
          <form method="post">
            <input type="hidden" name="interval" value={id} />
            <input type="hidden" name="action" value="delete" />
            <button type="submit" className={tw`bg-white text-black`}>Clear Values</button>
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
            KF
          </th>
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
          <Row id={index} key={item.time} item={item} open={open === index} setOpen={setOpen} />
        ))}
      </table>
    </div>
  )
}

export default Table;