



export async function isAdmin(): Promise<boolean> {
  return true;
}


let authorized = false;
export async function login(user: string, password: string): Promise<boolean> {
  // if (process.env.KURGANB_ADMIN_USER === user && process.env.KURGANB_ADMIN_PASSWORD === password) {
  authorized = true;
  // }
  return false;
  return authorized;
}

export async function logout(): Promise<void> {
  authorized = false;
}