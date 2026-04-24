import { CommonService } from "./commonservice.page";

export class BankService extends CommonService {
  public static async GetAll(storeId: string) {
    return this.GetAll(`Bank/List?storeId=${storeId}`);
  }

  public static async Insert(data: any) {
    return this.Post("Bank/Insert", data);
  }

  public static async Update(id: string, data: any) {
    return this.Put(`Bank/Update/${id}`, data);
  }

  public static async Delete(id: string) {
    return this.DeleteById(`Bank/Delete/${id}`);
  }
}
