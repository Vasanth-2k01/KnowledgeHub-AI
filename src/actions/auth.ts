'use server';

import bcryptjs from 'bcryptjs';
import connectDB from '@/config/db';
import User from '@/models/User';
import { RegisterInput, registerSchema } from '@/validators/auth';

export async function registerAction(data: RegisterInput) {
  try {
    // Validate the input again on the server
    const parsedData = registerSchema.safeParse(data);
    
    if (!parsedData.success) {
      return { error: 'Invalid input data' };
    }
    
    const { name, email, password } = parsedData.data;

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: 'Email is already registered' };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      provider: 'credentials',
      role: 'user',
    });

    return { success: true };
  } catch (error) {
    console.error('Error in registerAction:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
