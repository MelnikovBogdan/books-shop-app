import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async generateHash(str: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(str, salt);

    return hash;
  }

  async compareHash(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
