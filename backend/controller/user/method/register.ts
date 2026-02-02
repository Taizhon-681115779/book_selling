import { successRes, errRes } from "../../main";
import User from "../../../model/user";
import { IUser } from "../../../types/user";

export default async function register(data: IUser) {
  try {
    // 1. เช็คว่า Username หรือ Email ซ้ำไหม 
    const existingUser = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }]
    });

    if (existingUser) {
      return errRes.BAD_REQUEST({ message: "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว" });
    }

    // 2. สร้าง User ใหม่ (อย่าลืมใส่ creditBalance เริ่มต้นเป็น 0 ตามที่ออกแบบไว้) [cite: 42]
    const newUser = await User.create(data);
    return successRes(newUser);
  } catch (error: any) {
    console.log(`INTERNAL_SERVER_ERROR: ${error.message}`);
    return errRes.INTERNAL_SERVER_ERROR({ message: error.message });
  }
}