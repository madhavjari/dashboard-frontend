import { jwtDecode } from "jwt-decode";

export default function checkUser(accessToken) {
  let userId = null;
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      userId = decoded.sub;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }
  return userId;
}
