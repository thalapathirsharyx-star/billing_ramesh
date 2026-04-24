import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { company } from '@Database/Table/Admin/company';
import { user } from '@Database/Table/Admin/user';
import { user_role } from '@Database/Table/Admin/user_role';
import { currency } from '@Database/Table/Admin/currency';
import { country } from '@Database/Table/Admin/country';
import { EncryptionService } from '../Encryption.service';
import { RegisterModel } from '@Model/Admin/User.model';

@Injectable()
export class AuthService {
  constructor(private _JwtService: JwtService, private _EncryptionService: EncryptionService) { }

  async ValidateUser(usernameOrEmail: string, password: string): Promise<any> {
    const UserData = await user.findOne({ 
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ], 
      relations: ['user_role'] 
    });
    const CompanyData = await company.find({ relations: ["currency"] });
    if (!UserData) {
      throw new Error('Invalid email id');
    }
    if (UserData.status == false) {
      throw new Error('User suspended, contanct administration');
    }
    if (this._EncryptionService.Decrypt(UserData.password) != password) {
      throw new Error('Invalid password');
    }
    const payload = {
      email: UserData.email,
      user_id: UserData.id,
      user_role_id: UserData.user_role_id,
      user_role_name: UserData.user_role.name,
      company: CompanyData[0]
    };
    const api_token = this._JwtService.sign(payload);
    return { api_token, user: payload };
  }

  async Register(data: RegisterModel): Promise<any> {
    const existingUser = await user.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // 1. Create a default company for the new user
    const CompanyData = new company();
    CompanyData.name = `${data.firstName}'s Store`;
    CompanyData.email = data.email;
    CompanyData.address = "Store Address";
    CompanyData.postal_code = "000000";
    CompanyData.created_by_id = "0";
    CompanyData.created_on = new Date();
    
    const CurrencyData = await currency.findOne({ where: {} });
    const CountryData = await country.findOne({ where: {} });
    
    if (!CurrencyData || !CountryData) {
      throw new Error('System initialization incomplete: Currency or Country not found');
    }
    
    CompanyData.currency_id = CurrencyData.id;
    CompanyData.country_id = CountryData.id;
    
    await company.save(CompanyData);

    // 2. Find super admin role
    const role = await user_role.findOne({ where: { name: 'super_admin' } });

    // 3. Create User
    const UserData = new user();
    UserData.first_name = data.firstName;
    UserData.last_name = data.lastName;
    UserData.email = data.email;
    UserData.username = data.username;
    UserData.password = this._EncryptionService.Encrypt(data.password);
    UserData.mobile = data.mobile;
    UserData.user_role_id = role.id;
    UserData.created_by_id = "0";
    UserData.created_on = new Date();
    
    await user.save(UserData);

    await user.save(UserData);
    
    return this.ValidateUser(data.email, data.password);
  }
}
