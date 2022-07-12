import type { Month } from './month.ts';

const minimumRepayment = (interest_rate: number, principle: number, months: number) => {
  const aprc = interest_rate / 12;
  return principle * (aprc * Math.pow(1 + aprc, months)) / ((Math.pow(1 + aprc, months)) - 1);
}

class Timeline {
  private months: Month[];
  private regularMonths: Month[];
  private mortgage: any;
  private frames: any;

  constructor(mortgage: any, frames: any) {
    this.mortgage = mortgage;
    this.frames = frames;
    this.months = [];
    this.regularMonths = [];

    this.createMonths();
    this.createRegularMonths();
  }

  private createMonths() {
    const context = {
      month: 0,
      frame: 0,
      date: this.mortgage.start,
      balance: this.mortgage.principle,
      settings: this.frames[0]
    }

    while (true) {
      const minimum_repayment = minimumRepayment(
        context.settings.interest_rate,
        this.mortgage.principle,
        this.mortgage.intervals
      );

      const start_balance = context.balance;
      const frame = this.frames[context.frame].interval === context.month ? this.frames[context.frame] : {};

      // Apply interest
      const interest = context.balance * context.settings.interest_rate / 12;
      context.balance += interest;
      // Apply base payment
      context.balance -= Math.min(minimum_repayment, context.balance);
      // Apply overpayment(s)
      context.balance -= context.settings.overpayment_onetime + context.settings.overpayment_recurring;

      this.months.push({
        time: context.date,
        base_payment: minimum_repayment,
        interest_paid: interest,
        frame: {
          interest_rate: frame.interest_rate || undefined,
          overpayment: {
            onetime: frame.overpayment_onetime || undefined,
            recurring: frame.overpayment_recurring || undefined,
          }
        },
        applied: {
          interest_rate: context.settings.interest_rate,
          overpayment: {
            onetime: context.settings.overpayment_onetime,
            recurring: context.settings.overpayment_recurring,
          }
        },
        balance: {
          start: start_balance,
          end: context.balance,
        }
      });

      context.settings.overpayment_onetime = 0;

      // Move to next month
      context.month++;
      context.date = new Date(context.date).setMonth(new Date(context.date).getMonth()+1);

      if(context.month >= this.frames[context.frame + 1]?.interval) {
        context.frame++;

        // Apply new frame to frame settings
        const new_frame = this.frames[context.frame];

        for (const key in new_frame) {
          if(new_frame[key] !== 'undefined' && new_frame[key] !== null) {
            context.settings[key] = new_frame[key];
          }
        }
      }

      if(
        context.month > this.mortgage.intervals ||
        context.balance <= 0
      ) {
        break;
      }
    }
  }

  private createRegularMonths() {
    const context = {
      month: 0,
      frame: 0,
      date: this.mortgage.start,
      balance: this.mortgage.principle,
      settings: this.frames[0]
    }

    while (true) {
      const minimum_repayment = minimumRepayment(
        context.settings.interest_rate,
        this.mortgage.principle,
        this.mortgage.intervals
      );

      const start_balance = context.balance;
      const frame = this.frames[context.frame].interval === context.month ? this.frames[context.frame] : {};

      // Apply interest
      const interest = context.balance * context.settings.interest_rate / 12;
      context.balance += interest;
      // Apply base payment
      context.balance -= Math.min(minimum_repayment, context.balance);

      this.regularMonths.push({
        time: context.date,
        base_payment: minimum_repayment,
        interest_paid: interest,
        frame: {
          interest_rate: frame.interest_rate || undefined,
        },
        applied: {
          interest_rate: context.settings.interest_rate,
        },
        balance: {
          start: start_balance,
          end: context.balance,
        }
      });

      // Move to next month
      context.month++;
      context.date = new Date(context.date).setMonth(new Date(context.date).getMonth()+1);

      if(context.month >= this.frames[context.frame + 1]?.interval) {
        context.frame++;

        // Apply new frame to frame settings
        const new_frame = this.frames[context.frame];

        for (const key in new_frame) {
          if(new_frame[key] !== 'undefined' && new_frame[key] !== null) {
            context.settings[key] = new_frame[key];
          }
        }
      }

      if(
        context.month > this.mortgage.intervals ||
        context.balance <= 0
      ) {
        break;
      }
    }
  }

  public getMonths() {
    return this.months;
  }

  public getRegularMonths() {
    return this.regularMonths;
  }
}

export default Timeline;