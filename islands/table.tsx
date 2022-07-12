/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { tw } from '@twind';
import { hasKeyframe, overpaymentTotal, checkKeyframe } from "../app/month.ts";

const InterestRate = ({ interestRate, vOverride }) => {
  const [value, setValue] = useState(vOverride);
  return (
    <input name="interest_rate" type="text" inputMode="numeric" placeholder={interestRate} value={value} onChange={(e) => setValue(e.target.value)} />
  )
};

const RegularOverpayment = ({ amount, vOverride }) => {
  const [value, setValue] = useState(vOverride);
  return (
    <input name="regular_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
  )
};

const SingleOverpayment = ({ amount, vOverride }) => {
  const [value, setValue] = useState(vOverride);
  return (
    <input name="single_overpayment" type="text" inputMode="numeric" placeholder={amount} value={value} onChange={(e) => setValue(e.target.value)} />
  )
};

const now = Date.now();

const Row = ({ id, open, month, setOpen }) => {
  return (
    <Fragment>
      <tr className={tw`${month.time < now ? "opacity-100" : "opacity-60"}`}>
        <td>
          {hasKeyframe(month) ? "x" : " "}
        </td>
        <td>
          {new Intl.DateTimeFormat("en-GB").format(new Date(month.time))}
        </td>
        <td>
          £{month.balance.start.toFixed(2)}
        </td>
        <td className={tw`text-red-500`}>
          +£{month.interest_paid.toFixed(2)}
        </td>
        <td className={tw`text-green-500`}>
          -£{month.base_payment.toFixed(2)}
        </td>
        <td className={tw`text-green-500`}>
          -£{(overpaymentTotal(month)).toFixed(2)}
        </td>
        <td>
          £{month.balance.end.toFixed(2)}
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
                <p>Interest Rate {checkKeyframe(month, "interest_rate") ? "(x)" : null}</p>
                <InterestRate interestRate={month.applied.interest_rate} vOverride={month.frame.interest_rate} />
              </div>
              <div>
                <p>Regular Overpayment {checkKeyframe(month, "overpayment_recurring") ? "(x)" : null}</p>
                <RegularOverpayment amount={month.applied.overpayment.recurring} vOverride={month.frame.overpayment.recurring} />
              </div>
              <div>
                <p>Singular Overpayment {checkKeyframe(month, "overpayment_onetime") ? "(x)" : null}</p>
                <SingleOverpayment amount={month.applied.overpayment.onetime} vOverride={month.frame.overpayment.onetime} />
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
          <Row
            id={index}
            key={item.time}
            month={item}
            open={open === index}
            setOpen={setOpen}
          />
        ))}
      </table>
    </div>
  )
}

export default Table;