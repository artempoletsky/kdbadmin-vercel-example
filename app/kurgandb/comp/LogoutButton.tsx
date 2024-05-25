"use client";

import { Button } from "@mantine/core";
import { adminRPC } from "../globals";

const logout = adminRPC().method("logout");

export default function LogoutButton() {
  return <Button onClick={e => logout().then(() => window.location.href += "")}>Logout</Button>
}