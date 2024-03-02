"use client";

import { getAPIMethod } from "@artempoletsky/easyrpc/client"
import { API_ENDPOINT } from "../generated";
import { FLogout } from "../api/route";
import { Button } from "@mantine/core";

const logout = getAPIMethod<FLogout>(API_ENDPOINT, "logout");


export default function LogoutButton() {
  return <Button onClick={e => logout().then(() => window.location.href += "")}>Logout</Button>
}