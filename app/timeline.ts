
type ITimeline = {
  time: Date,
  overpayment: { one_time: number, recurring: number }
  base_payment: number,
  interest_paid: number,
  interest_rate: number,
  balance: number,
  start_balance: number,
}[];

const minimumRepayment = (interest_rate: number, principle: number, months: number) => {
  const aprc = interest_rate / 12;
  return principle * (aprc * Math.pow(1 + aprc, months)) / ((Math.pow(1 + aprc, months)) - 1);
}

const createMortgageTimeline = (mortgage: any, frames: any): ITimeline => {
  const timeline = [];

  const context = {
    month: 0,
    frame: 0,
    date: new Date(mortgage.start),
    balance: mortgage.principle,
  }

  const frame_settings = frames[context.frame];

  while (true) {
    // Clear one time frame settings

    const minimum_repayment = minimumRepayment(
      frame_settings.interest_rate,
      mortgage.principle,
      mortgage.intervals
    )

    // Apply interest
    const start_balance = context.balance;
    const interest = context.balance * frame_settings.interest_rate / 12;
    context.balance += interest;

    // Apply base payment
    context.balance -= Math.min(minimum_repayment, context.balance);

    // Apply overpayment(s)
    context.balance -= frame_settings.overpayment_onetime + frame_settings.overpayment_recurring;

    // Move to next month
    context.month++;

    timeline.push({
      time: new Date(context.date.setMonth(context.date.getMonth()+1)),
      overpayment: {
        one_time: frame_settings.overpayment_onetime,
        recurring: frame_settings.overpayment_recurring,
      },
      interest_rate: frame_settings.interest_rate,
      base_payment: minimum_repayment,
      interest_paid: interest,
      start_balance: start_balance,
      balance: context.balance
    });

    // Move to next frame if month is at next frame interval
    frame_settings.overpayment_onetime = 0;
    if(context.month >= frames[context.frame + 1]?.interval) {
      context.frame++;

      // Apply new frame to frame settings
      const new_frame = frames[context.frame];

      for (const key in new_frame) {
        console.log(new_frame[key])
        if(new_frame[key] !== 'undefined' && new_frame[key] !== null) {
          frame_settings[key] = new_frame[key];
        }
      }
    }

    if(
      context.month > mortgage.intervals ||
      context.balance <= 0
    ) {
      break;
    }
  }

  return timeline;
}

export default createMortgageTimeline;