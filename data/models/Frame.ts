import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';
import Mortgage from './Mortgage.ts';
class Frame extends Model {
  static table = 'frames';

  static fields = {
    id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
    interval: DataTypes.INTEGER,
    interest_rate: DataTypes.FLOAT,
    overpayment_onetime: DataTypes.FLOAT,
    overpayment_recurring: DataTypes.FLOAT
  };

  static mortgage() {
    return this.hasOne(Mortgage);
  }
}

export default Frame;