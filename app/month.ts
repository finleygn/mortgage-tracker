export interface Month {
  time: number
  base_payment: number
  interest_paid: number

  // Current month frame, if exists
  frame: {
    interest_rate?: number,
    overpayment: {
      onetime?: number,
      recurring?: number,
    },
  }

  // Applied settings, including settings from previous months
  applied: {
    interest_rate?: number,
    overpayment: {
      onetime?: number,
      recurring?: number,
    },
  }

  balance: {
    start: number,
    end: number
  }
}

export function overpaymentTotal(month: Month): number {
  return month.applied.overpayment.recurring + month.applied.overpayment.onetime;
}

export function hasKeyframe(month: Month): boolean {
  return typeof month.frame.interest_rate !== 'undefined'
    || typeof month.frame.overpayment.recurring !== 'undefined'
    || typeof month.frame.overpayment.onetime !== 'undefined'
}

export function checkKeyframe(month: Month, name: "interest_rate" | "overpayment_recurring" | "overpayment_one_time"): boolean {
  switch (name) {
    case "interest_rate": {
      return typeof month.frame.interest_rate !== 'undefined';
    }
    case "overpayment_recurring": {
      return typeof month.frame.overpayment.recurring !== 'undefined';
    }
    case "overpayment_one_time": {
      return typeof month.frame.overpayment.onetime !== 'undefined';
    }
  }
}