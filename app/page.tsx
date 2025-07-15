// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Langsung arahkan ke halaman login
  redirect("/login");
}
