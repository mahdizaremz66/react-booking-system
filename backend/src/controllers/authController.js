import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ResponseHandler } from "../utils/responseHandler.js";

const prisma = new PrismaClient();

export const usrLogin = async (req, res) => {
  try {
    const { usrUsername, usrPassword } = req.body;
    
    const user = await prisma.userAccount.findUnique({ 
      where: { usrUsername: usrUsername } 
    });
    
    if (!user) {
      return ResponseHandler.invalidCredentials(res);
    }
    
    const valid = await bcrypt.compare(usrPassword, user.usrPassword);
    if (!valid) {
      return ResponseHandler.invalidCredentials(res);
    }
    
    const person = await prisma.person.findUnique({ 
      where: { perCode: user.usrPerCode } 
    });
    
    const token = jwt.sign(
      { id: user.usrPerCode, role: user.usrRole }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    
    // ترکیب نام و نام خانوادگی
    const usrName = person ? `${person.perName} ${person.perLastName}`.trim() : user.usrUsername;
    
    const userData = {
      usrPerCode: user.usrPerCode,
      usrUsername: user.usrUsername,
      usrRole: user.usrRole,
      usrName: usrName,
      usrAvatar: user.usrAvatar || null
    };
    
    ResponseHandler.loginSuccess(res, { token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    ResponseHandler.internalError(res);
  }
};

export const usrRegister = async (req, res) => {
  try {
    const { usrUsername, usrPassword, perName, perLastName, usrAvatar } = req.body;
    
    // بررسی وجود کاربر
    const existingUser = await prisma.userAccount.findUnique({ 
      where: { usrUsername: usrUsername } 
    });
    
    if (existingUser) {
      return ResponseHandler.usernameExists(res);
    }

    // ایجاد کد شخص جدید
    const perCode = `P${Date.now()}`;
    
    // ایجاد شخص جدید
    const person = await prisma.person.create({
      data: {
        perCode: perCode,
        perName: perName,
        perLastName: perLastName || '',
        perIsActive: true,
        perCreatedBy: 'system'
      }
    });

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(usrPassword, 10);
    
    // ایجاد حساب کاربری
    const userAccount = await prisma.userAccount.create({
      data: {
        usrPerCode: perCode,
        usrUsername: usrUsername,
        usrPassword: hashedPassword,
        usrRole: 'viewer',
        usrIsActive: true,
        usrAvatar: usrAvatar || null,
        usrCreatedBy: 'system'
      }
    });

    // ایجاد کیف پول برای کاربر جدید
    await prisma.wallet.create({
      data: {
        wltPerCode: perCode,
        wltBalance: 0,
        wltCreatedBy: 'system'
      }
    });

    // ترکیب نام و نام خانوادگی
    const usrName = `${perName} ${perLastName || ''}`.trim();

    // بازگشت اطلاعات مشابه login
    const token = jwt.sign(
      { id: userAccount.usrPerCode, role: userAccount.usrRole }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    
    const userData = {
      usrPerCode: userAccount.usrPerCode,
      usrUsername: userAccount.usrUsername,
      usrRole: userAccount.usrRole,
      usrName: usrName,
      usrAvatar: userAccount.usrAvatar
    };
    
    ResponseHandler.registerSuccess(res, { token, user: userData });
  } catch (error) {
    console.error('Registration error:', error);
    ResponseHandler.internalError(res);
  }
}; 