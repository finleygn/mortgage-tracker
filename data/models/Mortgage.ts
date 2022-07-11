import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';
import Frame from './Frame.ts';

class Mortgage extends Model {
  static table = 'mortgages';

  static fields = {
    id: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
    name: DataTypes.STRING,
    principle: DataTypes.INTEGER,
    intervals: DataTypes.INTEGER,
    start: DataTypes.INTEGER,
  };

  static intervals() {
    return this.hasMany(Frame);
  }
}

export default Mortgage;