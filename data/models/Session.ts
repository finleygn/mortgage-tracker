import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

class Session extends Model {
  static table = 'sessions';
  static timestamp = false;
  
  static fields = {
    id: { primaryKey: true, type: DataTypes.STRING },
  };
}

export default Session;